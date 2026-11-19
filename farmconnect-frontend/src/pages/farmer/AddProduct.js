import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    unit: 'kg',
    stock_quantity: '',
    category: '',
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    // Farmers can only list under the "marketplace" (Farm Produce) section
    api.get('/marketplace/categories/?section=marketplace')
      .then((response) => setCategories(response.data))
      .catch((err) => console.error(err));
  }, []);

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
      await api.post('/marketplace/my-products/', data);
      alert('Product added successfully!');
      navigate('/farmer-dashboard/my-products');
    } catch (err) {
      console.error(err.response?.data);
      setError(JSON.stringify(err.response?.data));
    }
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-green-700 mb-6">Add Product</h2>

      {error && <p className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4 break-words">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <input
          name="title"
          placeholder="Product title (e.g. Fresh Tomatoes)"
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          name="category"
          onChange={handleChange}
          value={formData.category}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <div className="flex gap-3">
          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Price (₹)"
            onChange={handleChange}
            required
            className="w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            name="unit"
            placeholder="Unit (kg, litre, piece)"
            value={formData.unit}
            onChange={handleChange}
            className="w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <input
          name="stock_quantity"
          type="number"
          placeholder="Stock quantity"
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div>
          <label className="block text-sm text-gray-600 mb-1">Product Image</label>
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
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;