import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/users/login/', formData);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response?.data);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fbfcf8]">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-5xl items-center px-5 py-10 sm:px-8">
        <div className="grid w-full overflow-hidden rounded-[2rem] shadow-xl shadow-green-950/5 lg:grid-cols-2">
          {/* Brand panel */}
          <div className="hidden flex-col justify-between bg-green-950 p-10 text-white lg:flex">
            <div>
              <p className="font-serif text-2xl font-bold tracking-tight">Smart Farmer</p>
              <p className="mt-1 text-sm text-lime-300">Grow smarter. Farm better.</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold leading-tight">Welcome back to your farm's dashboard.</h2>
              <ul className="mt-6 space-y-3 text-sm text-green-100">
                <li>Weather-ready decisions</li>
                <li>Crop guidance for your soil</li>
                <li>Direct access to buyers</li>
              </ul>
            </div>
            <p className="text-xs text-green-300">Practical support for farmers, from field insights to direct trade.</p>
          </div>

          {/* Form panel */}
          <div className="bg-white p-8 sm:p-10">
            <h2 className="font-serif text-2xl font-bold text-green-950">Log in</h2>
            <p className="mt-1 text-sm text-slate-500">Access your Smart Agriculture Guidance and Farmer Marketplace System account</p>

            {error && (
              <p className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Username</label>
                <input
                  name="username"
                  placeholder="Enter your username"
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-green-700 py-3 text-sm font-bold text-white shadow-sm shadow-green-800/20 transition hover:bg-green-800"
              >
                Log in
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-green-700 hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;