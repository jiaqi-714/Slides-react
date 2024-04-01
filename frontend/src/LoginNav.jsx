//LoginNav.jsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import the useAuth hook

export function LoginNav () {
  const { isAuthenticated } = useAuth(); // Use the hook to get the auth status
  const location = useLocation();
  console.log(isAuthenticated)
  if (isAuthenticated) return null;

  return (
    <div>
      {location.pathname === '/register' ? (
        <p>
          Already have an account? <Link to="/login" style={{ color: 'blue' }}>Login here.</Link>
        </p>
      ) : (
        <p>
          Haven&apos;t registered yet? <Link to="/register" style={{ color: 'blue' }}>Register here.</Link>
        </p>
      )}
    </div>
  );
}
