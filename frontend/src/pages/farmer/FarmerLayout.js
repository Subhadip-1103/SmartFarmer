import { Link, Outlet, useNavigate } from 'react-router-dom';

function FarmerLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-56 bg-white border-r border-gray-200 p-5 flex flex-col">
        <h2 className="text-lg font-bold text-green-700 mb-6">Farmer Panel</h2>
        <nav className="flex flex-col gap-1 flex-1">
          <Link to="/farmer-dashboard" className="px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700">
            🏠 Dashboard
          </Link>
          <Link to="/farmer-dashboard/add-product" className="px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700">
            ➕ Add Product
          </Link>
          <Link to="/farmer-dashboard/my-products" className="px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700">
            📦 My Products
          </Link>
          <Link to="/farmer-dashboard/my-orders" className="px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700">
            📋 My Orders
          </Link>
        </nav>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-gray-500 hover:underline mb-2 text-left"
        >
          ← Main Dashboard
        </button>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline text-left"
        >
          Logout
        </button>
      </div>

      {/* Page content */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
}

export default FarmerLayout;