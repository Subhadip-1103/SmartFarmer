import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    api.get(`/marketplace/products/${id}/`)
      .then((response) => setProduct(response.data))
      .catch((err) => {
        console.error(err);
        setError('Product not found.');
      });
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await api.post('/marketplace/cart/add/', { product: product.id, quantity });
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      console.error(err);
      setMessage('Please log in to add items to cart.');
    }
  };
  const handleBuyNow = async () => {
    try {
      await api.post('/marketplace/cart/add/', { product: product.id, quantity });
      navigate('/cart');
    } catch (err) {
      console.error(err);
      setMessage('Please log in to purchase.');
    }
  };
  if (error) return <p className="text-center text-red-600 mt-20">{error}</p>;
  if (!product) return <p className="text-center text-gray-500 mt-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="text-green-700 font-medium mb-4 hover:underline"
        >
          ← Back
        </button>

        {product.image && (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-56 object-cover rounded-xl mb-4"
          />
        )}

        <h2 className="text-2xl font-bold text-gray-800">{product.title}</h2>
        <p className="text-gray-500 text-sm mt-1">Sold by {product.seller_name}</p>
        <p className="text-green-700 font-bold text-xl mt-2">₹{product.price} / {product.unit}</p>
        <p className="text-gray-500 text-sm mt-1">Stock available: {product.stock_quantity}</p>
        <p className="text-gray-700 mt-4">{product.description}</p>

        {message && <p className="bg-green-50 text-green-700 text-sm px-3 py-2 rounded mt-4">{message}</p>}

        <div className="flex items-center gap-3 mt-5">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 border border-gray-300 rounded-lg px-3 py-2"
          />
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;