import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get('/marketplace/products/')
      .then((response) => setAllProducts(response.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load products.');
      })
      .finally(() => setLoading(false));
  }, []);

  const results = allProducts.filter((p) => {
    const haystack = `${p.title || ''} ${p.seller_name || ''}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

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

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-green-700 font-medium mb-4 hover:underline"
        >
          &larr; Back
        </button>

        <h2 className="text-2xl font-bold text-green-700 mb-2">Search results</h2>
        <p className="text-gray-500 mb-6">
          {query ? <>Showing results for &quot;{query}&quot;</> : 'Enter a search term above'}
        </p>

        {message && <p className="bg-green-50 text-green-700 text-sm px-3 py-2 rounded mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {loading && <p className="text-gray-500">Searching...</p>}
        {!loading && !error && results.length === 0 && (
          <p className="text-gray-500">No products matched &quot;{query}&quot;.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {results.map((product) => (
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
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="flex-1 bg-gray-100 text-gray-800 py-1.5 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => navigate(`/marketplace/product/${product.id}`)}
                  className="flex-1 bg-green-600 text-white py-1.5 rounded-lg hover:bg-green-700 transition text-sm"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
