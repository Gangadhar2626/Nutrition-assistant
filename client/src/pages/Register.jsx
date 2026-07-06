import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail, validatePassword, validateRequired } from '../utils/validators';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!validateRequired(form.name)) newErrors.name = 'Name is required';
    if (!validateRequired(form.email)) newErrors.email = 'Email is required';
    else if (!validateEmail(form.email)) newErrors.email = 'Invalid email format';
    if (!validatePassword(form.password)) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await register(form);
      if (result.pending) {
        showToast('Registration successful! Awaiting admin approval.', 'info');
        navigate('/login');
      } else {
        showToast('Registration successful!', 'success');
        navigate(result.path);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed', 'error');
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
            <h3 className="fw-bold">Create Account</h3>
            <p className="text-muted">Join Nutrition Assistant today</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
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
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <div className="mb-4">
              <label className="form-label">Register As</label>
              <select
                className="form-select"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="dietitian">Dietitian</option>
              </select>
              {form.role === 'dietitian' && (
                <small className="text-muted">Dietitian accounts require admin approval.</small>
              )}
            </div>
            <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>
          <p className="text-center mt-3 mb-0">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
