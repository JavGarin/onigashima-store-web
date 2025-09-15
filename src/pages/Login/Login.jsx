import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './Login.css';

const Login = ({ handleLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let authResponse;
      if (isLogin) {
        // --- Handle Login ---
        authResponse = await supabase.auth.signInWithPassword({ email, password });
      } else {
        // --- Handle Sign Up ---
        authResponse = await supabase.auth.signUp({ email, password });
        if (authResponse.data.user && authResponse.data.user.identities && authResponse.data.user.identities.length === 0) {
            throw new Error("This user already exists. Please try logging in.");
        }
      }

      const { error: authError } = authResponse;
      if (authError) throw authError;

      // If signup is successful, Supabase sends a confirmation email. 
      // We can log them in directly for this example.
      if (authResponse.data.user) {
        handleLogin(); // Update the app's auth state
        navigate(from, { replace: true }); // Redirect to the intended page or home
      } else if (!isLogin) {
        alert('Sign up successful! Please check your email to confirm your account.');
        setIsLogin(true); // Switch to login view
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>
        <p className="toggle-auth">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;