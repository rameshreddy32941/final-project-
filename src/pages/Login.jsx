import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import './Login.css';

export function Login() {
  const [role, setRole] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      login(username, password, role);
      setLoading(false);
      navigate(role === 'admin' ? '/admin' : '/student');
    }, 500);
  };

  return (
    <div className="login-container">
      <div className="login-card fade-in">
        <h1>StudentFeed</h1>
        <p className="subtitle">Feedback System</p>

        <form onSubmit={handleSubmit}>
          <div className="role-selector">
            <label className={role === 'student' ? 'active' : ''}>
              <input
                type="radio"
                name="role"
                value="student"
                checked={role === 'student'}
                onChange={(e) => setRole(e.target.value)}
              />
              Student
            </label>
            <label className={role === 'admin' ? 'active' : ''}>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === 'admin'}
                onChange={(e) => setRole(e.target.value)}
              />
              Admin
            </label>
          </div>

          <div className="form-group">
            <label>ID / Username</label>
            <input
              type="text"
              placeholder="Enter your ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="demo-text">Demo: Use any ID and password to login</p>
      </div>
    </div>
  );
}
