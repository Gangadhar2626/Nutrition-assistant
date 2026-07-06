import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmModal from '../../components/common/ConfirmModal';
import { mealPlanAPI, userAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { validateRequired, validateNumber } from '../../utils/validators';

const emptyForm = {
  title: '',
  description: '',
  breakfast: '',
  lunch: '',
  dinner: '',
  snacks: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
};

const MealPlans = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, editing: null });
  const [assignModal, setAssignModal] = useState({ show: false, plan: null, userId: '' });
  const [deleteModal, setDeleteModal] = useState({ show: false, plan: null });
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      const [plansRes, usersRes] = await Promise.all([
        mealPlanAPI.getAll(),
        userAPI.getAvailableClients(),
      ]);
      setMealPlans(plansRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setErrors({});
    setModal({ show: true, editing: null });
  };

  const openEdit = (plan) => {
    setForm({
      title: plan.title,
      description: plan.description || '',
      breakfast: plan.breakfast || '',
      lunch: plan.lunch || '',
      dinner: plan.dinner || '',
      snacks: plan.snacks || '',
      calories: plan.calories,
      protein: plan.protein,
      carbs: plan.carbs,
      fat: plan.fat,
    });
    setErrors({});
    setModal({ show: true, editing: plan._id });
  };

  const validate = () => {
    const newErrors = {};
    if (!validateRequired(form.title)) newErrors.title = 'Title is required';
    ['calories', 'protein', 'carbs', 'fat'].forEach((field) => {
      if (!validateNumber(form[field])) newErrors[field] = 'Must be a valid number';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      ...form,
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fat: Number(form.fat),
    };

    try {
      if (modal.editing) {
        await mealPlanAPI.update(modal.editing, data);
        showToast('Meal plan updated!', 'success');
      } else {
        await mealPlanAPI.create(data);
        showToast('Meal plan created!', 'success');
      }
      setModal({ show: false, editing: null });
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await mealPlanAPI.delete(deleteModal.plan._id);
      showToast('Meal plan deleted!', 'success');
      setDeleteModal({ show: false, plan: null });
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const handleAssign = async () => {
    if (!assignModal.userId) {
      showToast('Please select a client', 'error');
      return;
    }
    try {
      await mealPlanAPI.assign(assignModal.plan._id, assignModal.userId);
      showToast('Meal plan assigned!', 'success');
      setAssignModal({ show: false, plan: null, userId: '' });
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Assign failed', 'error');
    }
  };

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="mb-0">Meal Plans</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          <FaPlus className="me-1" /> Create Plan
        </button>
      </div>

      <div className="card page-card">
        <div className="card-body p-0">
          {mealPlans.length === 0 ? (
            <p className="text-muted p-4 mb-0">No meal plans yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Title</th>
                    <th>Calories</th>
                    <th>Protein</th>
                    <th>Assigned To</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mealPlans.map((plan) => (
                    <tr key={plan._id}>
                      <td>{plan.title}</td>
                      <td>{plan.calories}</td>
                      <td>{plan.protein}g</td>
                      <td>{plan.assignedTo?.name || 'Unassigned'}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(plan)}>
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => setAssignModal({ show: true, plan, userId: plan.assignedTo?._id || '' })}
                          >
                            <FaUserPlus />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setDeleteModal({ show: true, plan })}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modal.show && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{modal.editing ? 'Edit Meal Plan' : 'Create Meal Plan'}</h5>
                  <button type="button" className="btn-close" onClick={() => setModal({ show: false, editing: null })} />
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Title *</label>
                        <input
                          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                          value={form.title}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Description</label>
                        <input className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Breakfast</label>
                        <textarea className="form-control" rows={2} value={form.breakfast} onChange={(e) => setForm({ ...form, breakfast: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Lunch</label>
                        <textarea className="form-control" rows={2} value={form.lunch} onChange={(e) => setForm({ ...form, lunch: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Dinner</label>
                        <textarea className="form-control" rows={2} value={form.dinner} onChange={(e) => setForm({ ...form, dinner: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Snacks</label>
                        <textarea className="form-control" rows={2} value={form.snacks} onChange={(e) => setForm({ ...form, snacks: e.target.value })} />
                      </div>
                      {['calories', 'protein', 'carbs', 'fat'].map((field) => (
                        <div className="col-md-3" key={field}>
                          <label className="form-label text-capitalize">{field} *</label>
                          <input
                            type="number"
                            className={`form-control ${errors[field] ? 'is-invalid' : ''}`}
                            value={form[field]}
                            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                          />
                          {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setModal({ show: false, editing: null })}>Cancel</button>
                    <button type="submit" className="btn btn-primary">{modal.editing ? 'Update' : 'Create'}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}

      {assignModal.show && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Assign Meal Plan</h5>
                  <button type="button" className="btn-close" onClick={() => setAssignModal({ show: false, plan: null, userId: '' })} />
                </div>
                <div className="modal-body">
                  <p>Assign <strong>{assignModal.plan?.title}</strong> to a client:</p>
                  <select
                    className="form-select"
                    value={assignModal.userId}
                    onChange={(e) => setAssignModal({ ...assignModal, userId: e.target.value })}
                  >
                    <option value="">Select client...</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setAssignModal({ show: false, plan: null, userId: '' })}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleAssign}>Assign</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}

      <ConfirmModal
        show={deleteModal.show}
        title="Delete Meal Plan"
        message={`Are you sure you want to delete "${deleteModal.plan?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ show: false, plan: null })}
      />
    </DashboardLayout>
  );
};

export default MealPlans;
