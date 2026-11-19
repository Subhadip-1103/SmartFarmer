import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function MyUserOrder() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/marketplace/my-orders/')
      .then((response) => setOrders(response.data))
      .catch((err) => {
        console.error(err);
        setError('Please log in to view your orders.');
      });
  }, []);

  const statusColor = (status) => {
    if (status === 'paid') return 'bg-green-100 text-green-700';
    if (status === 'failed') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/marketplace')}
          className="text-green-700 font-medium mb-4 hover:underline"
        >
          ← Back to Marketplace
        </button>

        <h2 className="text-2xl font-bold text-green-700 mb-6">My Orders</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {orders.length === 0 && !error && <p className="text-gray-500">You haven't placed any orders yet.</p>}

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800">Order #{order.id}</h3>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-3">
                {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>

              <div className="space-y-1 mb-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-700">
                    <span>{item.product_title} × {item.quantity}</span>
                    <span>₹{(item.quantity * item.price_at_purchase).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-800">
                <span>Total</span>
                <span>₹{order.total_amount}</span>
              </div>

              {order.shipping_address && (
                <p className="text-gray-500 text-sm mt-2">📍 {order.shipping_address}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyUserOrder;