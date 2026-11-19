import { useEffect, useState } from 'react';
import api from '../../api/axios';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/marketplace/farmer-orders/')
      .then((response) => setOrders(response.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load orders.');
      });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-green-700 mb-6">My Orders</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {orders.length === 0 && !error && <p className="text-gray-500">No orders for your products yet.</p>}

      <div className="space-y-3">
        {orders.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-gray-800">{item.product_title}</h3>
              <p className="text-gray-500 text-sm">Qty: {item.quantity} × ₹{item.price_at_purchase}</p>
              <p className="text-gray-500 text-sm">Buyer: {item.buyer}</p>
              <p className="text-gray-500 text-sm">📍 {item.shipping_address}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-700">₹{(item.quantity * item.price_at_purchase).toFixed(2)}</p>
              <p className="text-gray-400 text-xs">
                {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </p>
              <p className="text-gray-400 text-xs">Order #{item.order_id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;