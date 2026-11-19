import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'farmer',
    phone_number: '',
    address: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/users/register/', formData);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      console.error(err.response?.data);
      setError(JSON.stringify(err.response?.data));
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
              <h2 className="text-3xl font-bold leading-tight">Join a growing community of farmers and buyers.</h2>
              <ul className="mt-6 space-y-3 text-sm text-green-100">
                <li>AI-powered crop guidance</li>
                <li>Learning resources for every season</li>
                <li>A direct marketplace, no middlemen</li>
              </ul>
            </div>
            <p className="text-xs text-green-300">Practical support for farmers, from field insights to direct trade.</p>
          </div>

          {/* Form panel */}
          <div className="bg-white p-8 sm:p-10">
            <h2 className="font-serif text-2xl font-bold text-green-950">Create account</h2>
            <p className="mt-1 text-sm text-slate-500">Join Smart Agriculture Guidance and Farmer Marketplace System today</p>

            {error && (
              <p className="mt-5 break-words rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  name="username"
                  placeholder="Username"
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
                />
              </div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
              />
              <select
                name="role"
                onChange={handleChange}
                value={formData.role}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
              >
                <option value="farmer">I am a Farmer</option>
                <option value="buyer">I am a Buyer</option>
              </select>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  name="phone_number"
                  placeholder="Phone Number"
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
                />
                <input
                  name="address"
                  placeholder="Address"
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-green-700 py-3 text-sm font-bold text-white shadow-sm shadow-green-800/20 transition hover:bg-green-800"
              >
                Create account
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-green-700 hover:underline">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
