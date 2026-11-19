import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    api.get('/marketplace/categories/?section=marketplace')
      .then((response) => setCategories(response.data))
      .catch((err) => console.error(err));

    api.get(`/marketplace/my-products/${id}/`)
      .then((response) => {
        const p = response.data;
        setFormData({
          title: p.title,
          description: p.description,
          price: p.price,
          unit: p.unit,
          stock_quantity: p.stock_quantity,
          category: p.category,
        });
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load product.');
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (imageFile) data.append('image', imageFile);

    try {
      await api.patch(`/marketplace/my-products/${id}/`, data);
      alert('Product updated successfully!');
      navigate('/farmer-dashboard/my-products');
    } catch (err) {
      console.error(err.response?.data);
      setError(JSON.stringify(err.response?.data));
    }
  };

  if (!formData) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-green-700 mb-6">Edit Product</h2>

      {error && <p className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4 break-words">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <div className="flex gap-3">
          <input
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <input
          name="stock_quantity"
          type="number"
          value={formData.stock_quantity}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div>
          <label className="block text-sm text-gray-600 mb-1">Replace Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProduct;