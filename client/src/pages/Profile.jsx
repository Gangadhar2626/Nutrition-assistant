import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail, validatePassword, validateRequired } from '../utils/validators';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!validateRequired(form.name)) newErrors.name = 'Name is required';
    if (!validateRequired(form.email)) newErrors.email = 'Email is required';
    else if (!validateEmail(form.email)) newErrors.email = 'Invalid email format';
    if (form.password && !validatePassword(form.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = { name: form.name, email: form.email };
      if (form.password) data.password = form.password;
      await updateProfile(data);
      showToast('Profile updated successfully!', 'success');
      setForm((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h2 className="mb-4">My Profile</h2>
      <div className="card page-card">
        <div className="card-body p-4">
          <div className="mb-3">
            <span className="badge bg-primary text-capitalize">{user?.role}</span>
          </div>
          <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
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
            <div className="mb-4">
              <label className="form-label">New Password (leave blank to keep current)</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
