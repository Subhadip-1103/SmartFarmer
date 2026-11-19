import { useLocation, useNavigate } from 'react-router-dom';

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-green-700 mb-2">Order Placed!</h2>
        <p className="text-gray-600 mb-1">Your payment was successful.</p>
        {orderId && <p className="text-gray-500 text-sm mb-6">Order ID: #{orderId}</p>}

        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/my-orders')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;