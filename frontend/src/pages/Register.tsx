import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/AuthLayout';
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from '../components/Icons';
import { useAuth } from '../context/useAuth';
import { getApiErrorMessage } from '../utils/errors';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !name.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await register(email.trim(), password, name.trim());
      navigate('/');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Join Bookify"
      subtitle="Create your modern programming library"
      cardTitle="CREATE ACCOUNT"
      cardSubtitle="start building your collection"
      footer={
        <>
          Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
        </>
      }
    >
      {error && <div className="auth-error">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="register-name">
            Full Name
          </label>
          <div className="auth-input-wrap">
            <UserIcon className="auth-input-icon" />
            <input
              id="register-name"
              type="text"
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              disabled={loading}
            />
          </div>
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="register-email">
            Email Address
          </label>
          <div className="auth-input-wrap">
            <UserIcon className="auth-input-icon" />
            <input
              id="register-email"
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
          <label className="auth-label" htmlFor="register-password">
            Password
          </label>
          <div className="auth-input-wrap">
            <LockIcon className="auth-input-icon" />
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
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

        <div className="auth-field">
          <label className="auth-label" htmlFor="register-confirm">
            Confirm Password
          </label>
          <div className="auth-input-wrap">
            <LockIcon className="auth-input-icon" />
            <input
              id="register-confirm"
              type={showPassword ? 'text' : 'password'}
              className="auth-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              disabled={loading}
            />
          </div>
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'SIGN UP'}
        </button>
      </form>
    </AuthShell>
  );
};
