import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/AuthLayout';
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from '../components/Icons';
import { useAuth } from '../context/useAuth';
import { getApiErrorMessage } from '../utils/errors';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      navigate('/');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Login failed. Please check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Sign in to your digital library"
      cardTitle="LOGIN TO BOOKIFY"
      cardSubtitle="manage your digital library"
      footer={
        <>
          Don&apos;t have an account? <Link to="/register" className="auth-link">Sign Up</Link>
        </>
      }
    >
      {error && <div className="auth-error">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="login-email">
            Username or Email
          </label>
          <div className="auth-input-wrap">
            <UserIcon className="auth-input-icon" />
            <input
              id="login-email"
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="login-password">
            Password
          </label>
          <div className="auth-input-wrap">
            <LockIcon className="auth-input-icon" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <div className="auth-forgot-row">
          <button type="button" className="auth-forgot-link">
            Forgot Password?
          </button>
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Signing In...' : 'LOGIN'}
        </button>
      </form>
    </AuthShell>
  );
};
