import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [marketOpen, setMarketOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const marketRef = useRef(null);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('access_token'));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (marketRef.current && !marketRef.current.contains(e.target)) {
        setMarketOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    navigate('/');
  };

  const goTo = (path) => {
    setMobileOpen(false);
    setMarketOpen(false);
    navigate(path);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-green-700">
          🌾 Smart Farmer
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-green-700 text-sm font-medium">Home</Link>
          <Link to="/courses" className="text-gray-600 hover:text-green-700 text-sm font-medium">Learning Platform</Link>

          <div className="relative" ref={marketRef}>
            <button
              onClick={() => setMarketOpen(!marketOpen)}
              className="text-gray-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
            >
              Marketplace <span className="text-xs">▾</span>
            </button>
            {marketOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                <button onClick={() => goTo('/marketplace/categories/marketplace')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50">
                  🌾 Farm Produce
                </button>
                <button onClick={() => goTo('/marketplace/categories/shop')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50">
                  🧪 Fertilizer & Seed Shop
                </button>
              </div>
            )}
          </div>

          <Link to="/ai-service" className="text-gray-600 hover:text-green-700 text-sm font-medium">AI Service</Link>
          <Link to="/weather" className="text-gray-600 hover:text-green-700 text-sm font-medium">Weather</Link>
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link to="/cart" className="text-gray-500 hover:text-green-700" title="Cart">🛒</Link>
              <Link to="/my-orders" className="text-gray-500 hover:text-green-700" title="My Orders">📋</Link>
              <Link to="/dashboard" className="text-gray-500 hover:text-green-700" title="Profile">👤</Link>
              <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-green-700 font-medium">Login</Link>
              <Link to="/register" className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-gray-600 text-2xl"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 py-3 space-y-2 bg-white">
          <button onClick={() => goTo('/')} className="block w-full text-left text-sm text-gray-700 py-1">Home</button>
          <button onClick={() => goTo('/courses')} className="block w-full text-left text-sm text-gray-700 py-1">Learning Platform</button>
          <button onClick={() => goTo('/marketplace/categories/marketplace')} className="block w-full text-left text-sm text-gray-700 py-1">🌾 Farm Produce</button>
          <button onClick={() => goTo('/marketplace/categories/shop')} className="block w-full text-left text-sm text-gray-700 py-1">🧪 Fertilizer & Seed Shop</button>
          <button onClick={() => goTo('/ai-service')} className="block w-full text-left text-sm text-gray-700 py-1">AI Service</button>
          <button onClick={() => goTo('/weather')} className="block w-full text-left text-sm text-gray-700 py-1">Weather</button>
          <div className="border-t border-gray-200 pt-2 mt-2">
            {isLoggedIn ? (
              <>
                <button onClick={() => goTo('/cart')} className="block w-full text-left text-sm text-gray-700 py-1">🛒 Cart</button>
                <button onClick={() => goTo('/my-orders')} className="block w-full text-left text-sm text-gray-700 py-1">📋 My Orders</button>
                <button onClick={() => goTo('/dashboard')} className="block w-full text-left text-sm text-gray-700 py-1">👤 Profile</button>
                <button onClick={handleLogout} className="block w-full text-left text-sm text-red-600 py-1">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => goTo('/login')} className="block w-full text-left text-sm text-gray-700 py-1">Login</button>
                <button onClick={() => goTo('/register')} className="block w-full text-left text-sm text-green-700 font-medium py-1">Register</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;