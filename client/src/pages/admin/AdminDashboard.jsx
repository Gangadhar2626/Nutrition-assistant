import { useState, useEffect } from 'react';
import { FaUsers, FaUserMd, FaUtensils } from 'react-icons/fa';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmModal from '../../components/common/ConfirmModal';
import { userAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalDietitians: 0, totalMealPlans: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleModal, setRoleModal] = useState({ show: false, user: null, newRole: 'user' });
  const [deleteModal, setDeleteModal] = useState({ show: false, user: null });
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([userAPI.getStats(), userAPI.getAllUsers()]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id) => {
    try {
      await userAPI.approveDietitian(id);
      showToast('Dietitian approved!', 'success');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Approval failed', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await userAPI.deleteUser(deleteModal.user._id);
      showToast('User deleted!', 'success');
      setDeleteModal({ show: false, user: null });
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const handleRoleChange = async () => {
    try {
      await userAPI.updateRole(roleModal.user._id, roleModal.newRole);
      showToast('Role updated!', 'success');
      setRoleModal({ show: false, user: null, newRole: 'user' });
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Role update failed', 'error');
    }
  };

  const roleBadge = (role) => {
    const colors = { admin: 'danger', dietitian: 'warning', user: 'primary' };
    return <span className={`badge bg-${colors[role] || 'secondary'} text-capitalize`}>{role}</span>;
  };

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h2 className="mb-4">Admin Dashboard</h2>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card stat-card">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="stat-icon bg-primary bg-opacity-10 text-primary">
                <FaUsers />
              </div>
              <div>
                <h3 className="mb-0">{stats.totalUsers}</h3>
                <small className="text-muted">Total Users</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stat-card">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="stat-icon bg-warning bg-opacity-10 text-warning">
                <FaUserMd />
              </div>
              <div>
                <h3 className="mb-0">{stats.totalDietitians}</h3>
                <small className="text-muted">Total Dietitians</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stat-card">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="stat-icon bg-success bg-opacity-10 text-success">
                <FaUtensils />
              </div>
              <div>
                <h3 className="mb-0">{stats.totalMealPlans}</h3>
                <small className="text-muted">Total Meal Plans</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card page-card">
        <div className="card-header bg-white">
          <h5 className="mb-0">Manage Users</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{roleBadge(u.role)}</td>
                    <td>
                      {u.role === 'dietitian' && !u.isApproved ? (
                        <span className="badge bg-secondary">Pending</span>
                      ) : (
                        <span className="badge bg-success">Active</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        {u.role === 'dietitian' && !u.isApproved && (
                          <button className="btn btn-sm btn-success" onClick={() => handleApprove(u._id)}>
                            Approve
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setRoleModal({ show: true, user: u, newRole: u.role })}
                        >
                          Role
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setDeleteModal({ show: true, user: u })}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        show={deleteModal.show}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteModal.user?.name}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ show: false, user: null })}
      />

      {roleModal.show && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Change Role</h5>
                  <button type="button" className="btn-close" onClick={() => setRoleModal({ show: false, user: null, newRole: 'user' })} />
                </div>
                <div className="modal-body">
                  <p>Change role for <strong>{roleModal.user?.name}</strong></p>
                  <select
                    className="form-select"
                    value={roleModal.newRole}
                    onChange={(e) => setRoleModal({ ...roleModal, newRole: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="dietitian">Dietitian</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setRoleModal({ show: false, user: null, newRole: 'user' })}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleRoleChange}>Save</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
