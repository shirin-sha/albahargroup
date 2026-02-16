'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const AdminLoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // TODO: Replace this with real authentication logic
    setTimeout(() => {
      const isValidDemoUser = username === 'admin' && password === 'admin123';

      if (isValidDemoUser) {
        router.push('/admin/dashboard');
      } else {
        setError('Invalid username or password');
        setIsSubmitting(false);
      }
    }, 600);
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-wrapper">
        <div className="admin-login-card radius18">
          <div className="admin-login-header">
            <h1>Admin Panel</h1>
            <p>Sign in with your administrator credentials.</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && <p className="admin-login-error">{error}</p>}

            <button
              type="submit"
              className="button button-primary admin-login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AdminLoginPage;

