import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';


function MyProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadProducts = () => {
    api.get('/marketplace/my-products/')
      .then((response) => setProducts(response.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load your products.');
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/marketplace/my-products/${id}/`);
      loadProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to delete product.');
    }
  };

  const toggleActive = async (product) => {
    try {
      await api.patch(`/marketplace/my-products/${product.id}/`, { is_active: !product.is_active });
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-700">My Products</h2>
        <Link
          to="/farmer-dashboard/add-product"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
        >
          + Add Product
        </Link>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {products.length === 0 && !error && <p className="text-gray-500">You haven't listed any products yet.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="font-semibold text-gray-800">{product.title}</h3>
            <p className="text-gray-500 text-sm">{product.category_name}</p>
            <p className="text-green-700 font-bold mt-1">₹{product.price} / {product.unit}</p>
            <p className="text-gray-500 text-sm">Stock: {product.stock_quantity}</p>
            <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-2 ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
              {product.is_active ? 'Active' : 'Inactive'}
            </span>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => navigate(`/farmer-dashboard/edit-product/${product.id}`)}
                className="flex-1 bg-blue-50 text-blue-600 py-1.5 rounded-lg hover:bg-blue-100 transition text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => toggleActive(product)}
                className="flex-1 bg-gray-100 text-gray-700 py-1.5 rounded-lg hover:bg-gray-200 transition text-sm"
              >
                {product.is_active ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="flex-1 bg-red-50 text-red-600 py-1.5 rounded-lg hover:bg-red-100 transition text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyProducts;