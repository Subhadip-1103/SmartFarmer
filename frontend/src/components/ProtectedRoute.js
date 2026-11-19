import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/axios';

function ProtectedRoute({ children, allowedRoles }) {
  const [status, setStatus] = useState('loading'); // loading | allowed | denied

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setStatus('denied');
      return;
    }

    api.get('/users/profile/')
      .then((response) => {
        if (allowedRoles.includes(response.data.role)) {
          setStatus('allowed');
        } else {
          setStatus('denied');
        }
      })
      .catch(() => setStatus('denied'));
  }, [allowedRoles]);

  if (status === 'loading') return <p className="text-center text-gray-500 mt-20">Checking access...</p>;
  if (status === 'denied') return <Navigate to="/dashboard" replace />;
  return children;
}

export default ProtectedRoute;