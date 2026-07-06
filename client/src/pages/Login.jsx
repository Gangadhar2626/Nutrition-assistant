import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail, validateRequired } from '../utils/validators';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!validateRequired(form.email)) newErrors.email = 'Email is required';
    else if (!validateEmail(form.email)) newErrors.email = 'Invalid email format';
    if (!validateRequired(form.password)) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const path = await login(form.email, form.password);
      showToast('Login successful!', 'success');
      navigate(path);
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <FaLeaf size={40} className="text-primary mb-2" />
            <h3 className="fw-bold">Welcome Back</h3>
            <p className="text-muted">Sign in to your account</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center mt-3 mb-0">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
