import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../api/axios';

function ProductList() {
  const { categoryId } = useParams();
  const location = useLocation();
  const categoryName = location.state?.categoryName || 'Products';
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/marketplace/products/?category=${categoryId}`)
      .then((response) => setProducts(response.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load products.');
      });
  }, [categoryId]);

  const handleAddToCart = async (productId) => {
    try {
      await api.post('/marketplace/cart/add/', { product: productId, quantity: 1 });
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      console.error(err);
      setMessage('Please log in to add items to cart.');
    }
  };
  const handleBuyNow = async (productId) => {
    try {
      await api.post('/marketplace/cart/add/', { product: productId, quantity: 1 });
      navigate('/cart');
    } catch (err) {
      console.error(err);
      setMessage('Please log in to purchase.');
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-green-700 font-medium mb-4 hover:underline"
        >
          ← Back
        </button>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-700">{categoryName}</h2>
          <button
            onClick={() => navigate('/cart')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
          >
            View Cart
          </button>
        </div>

        {message && <p className="bg-green-50 text-green-700 text-sm px-3 py-2 rounded mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {products.length === 0 && !error && <p className="text-gray-500">No products in this category yet.</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-36 object-cover rounded-lg mb-3"
                />
              )}
              <h3
                onClick={() => navigate(`/marketplace/product/${product.id}`)}
                className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-green-700"
              >
                {product.title}
              </h3>
              <p className="text-gray-500 text-sm">by {product.seller_name}</p>
              <p className="text-green-700 font-bold mt-1">₹{product.price} / {product.unit}</p>
              <p className="text-gray-500 text-sm">Stock: {product.stock_quantity}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="flex-1 bg-gray-100 text-gray-800 py-1.5 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleBuyNow(product.id)}
                  className="flex-1 bg-green-600 text-white py-1.5 rounded-lg hover:bg-green-700 transition text-sm"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductList;