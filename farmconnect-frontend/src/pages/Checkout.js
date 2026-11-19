import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const EMPTY_ADDRESS = { village: '', postOffice: '', district: '', state: '', pin: '' };

function Checkout() {
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/marketplace/cart/')
      .then((response) => setCart(response.data))
      .catch((err) => {
        console.error(err);
        setError('Please log in to checkout.');
      });
  }, []);

  const handleAddressChange = (field) => (e) => {
    setAddress({ ...address, [field]: e.target.value });
  };

  const formattedAddress = [address.village, address.postOffice, address.district, address.state, address.pin]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(', ');

  const handlePayment = async () => {
    if (!address.village.trim() || !address.district.trim() || !address.state.trim() || !address.pin.trim()) {
      setError('Please fill in Village, District, State, and PIN code.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // Step 1: Create order on our backend + Razorpay
      // shipping_address stays a single string on the backend, so the structured
      // fields below are joined here before sending - no backend change needed.
      const createRes = await api.post('/marketplace/checkout/create-order/', {
        shipping_address: formattedAddress,
      });

      const { order_id, razorpay_order_id, amount, currency, razorpay_key } = createRes.data;

      // Step 2: Open Razorpay checkout popup
      const options = {
        key: razorpay_key,
        amount: amount,
        currency: currency,
        name: 'SmartFarmer',
        description: 'Order Payment',
        order_id: razorpay_order_id,
        handler: async function (response) {
          // Step 3: Verify payment on our backend
          try {
            await api.post('/marketplace/checkout/verify-payment/', {
              order_id: order_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            navigate('/order-success', { state: { orderId: order_id } });
          } catch (err) {
            console.error(err);
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: '',
          email: '',
        },
        theme: {
          color: '#16a34a',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err.response?.data);
      setError('Failed to start checkout. Please try again.');
      setLoading(false);
    }
  };

  if (error && !cart) return <p className="text-center text-red-600 mt-20">{error}</p>;
  if (!cart) return <p className="text-center text-gray-500 mt-20">Loading...</p>;

  const total = cart.items.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.product_detail.price),
    0
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fbfcf8] px-5 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-green-100 bg-white p-8 shadow-sm">
        <button
          onClick={() => navigate('/cart')}
          className="mb-4 text-sm font-semibold text-green-700 hover:underline"
        >
          &larr; Back to Cart
        </button>

        <h2 className="font-serif text-2xl font-bold text-green-950">Checkout</h2>

        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <div className="mt-6 space-y-2">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-slate-700">
              <span>{item.product_detail.title} × {item.quantity}</span>
              <span>₹{(item.quantity * item.product_detail.price).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex justify-between border-t border-green-100 pt-3 text-lg font-bold text-green-950">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        <label className="mb-2 mt-6 block text-xs font-semibold uppercase tracking-wide text-slate-500">Shipping Address</label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            type="text"
            value={address.village}
            onChange={handleAddressChange('village')}
            placeholder="Village *"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
          />
          <input
            type="text"
            value={address.postOffice}
            onChange={handleAddressChange('postOffice')}
            placeholder="Post Office"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
          />
          <input
            type="text"
            value={address.district}
            onChange={handleAddressChange('district')}
            placeholder="District *"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
          />
          <input
            type="text"
            value={address.state}
            onChange={handleAddressChange('state')}
            placeholder="State *"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
          />
          <input
            type="text"
            value={address.pin}
            onChange={handleAddressChange('pin')}
            placeholder="PIN Code *"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100 sm:col-span-2"
          />
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-green-700 py-3 text-sm font-bold text-white shadow-sm shadow-green-800/20 transition hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}

export default Checkout;