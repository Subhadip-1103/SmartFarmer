import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

function FarmerHome() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/marketplace/my-products/')
      .then((response) => setProducts(response.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load your products.');
      });
  }, []);

  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stock_quantity <= 5);
  const activeProducts = products.filter((p) => p.is_active).length;

  return (
    <div>
      <h2 className="text-2xl font-bold text-green-700 mb-6">Farmer Dashboard</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm">Total Products</p>
          <p className="text-2xl font-bold text-gray-800">{totalProducts}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm">Active Listings</p>
          <p className="text-2xl font-bold text-gray-800">{activeProducts}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm">Low Stock (≤5)</p>
          <p className="text-2xl font-bold text-red-600">{lowStockProducts.length}</p>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-700 font-medium mb-2">⚠️ Low Stock Alerts</p>
          <ul className="text-sm text-red-600 list-disc list-inside">
            {lowStockProducts.map((p) => (
              <li key={p.id}>{p.title} — only {p.stock_quantity} left</li>
            ))}
          </ul>
        </div>
      )}

      <Link
        to="/farmer-dashboard/add-product"
        className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
      >
        + Add New Product
      </Link>
    </div>
  );
}

export default FarmerHome;