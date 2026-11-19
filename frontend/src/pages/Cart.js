import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Cart() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadCart = () => {
    api.get('/marketplace/cart/')
      .then((response) => setCart(response.data))
      .catch((err) => {
        console.error(err);
        setError('Please log in to view your cart.');
      });
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      await api.patch(`/marketplace/cart/item/${itemId}/`, { quantity: newQuantity });
      loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/marketplace/cart/item/${itemId}/remove/`);
      loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  if (error) return <p className="text-center text-red-600 mt-20">{error}</p>;
  if (!cart) return <p className="text-center text-gray-500 mt-20">Loading cart...</p>;

  const total = cart.items.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.product_detail.price),
    0
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fbfcf8] px-5 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => navigate('/marketplace')}
          className="mb-4 text-sm font-semibold text-green-700 hover:underline"
        >
          &larr; Continue Shopping
        </button>

        <p className="text-xs font-bold uppercase tracking-[.18em] text-green-600">Marketplace</p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-green-950">Your cart</h2>

        {cart.items.length === 0 && <p className="mt-6 text-slate-500">Your cart is empty.</p>}

        <div className="mt-6 space-y-3">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-2xl border border-green-100 bg-white p-4 shadow-sm"
            >
              {item.product_detail.image && (
                <img
                  src={item.product_detail.image}
                  alt={item.product_detail.title}
                  className="h-16 w-16 rounded-xl object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-green-950">{item.product_detail.title}</h3>
                <p className="text-sm text-slate-500">₹{item.product_detail.price} / {item.product_detail.unit}</p>
              </div>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                className="w-16 rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
              />
              <button
                onClick={() => removeItem(item.id)}
                className="text-sm font-semibold text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {cart.items.length > 0 && (
          <div className="mt-6 rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-lg font-bold text-green-950">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button
              className="mt-4 w-full rounded-xl bg-green-700 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-800"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;