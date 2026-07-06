import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmModal from '../../components/common/ConfirmModal';
import MacroBarChart from '../../components/charts/MacroBarChart';
import WeightLineChart from '../../components/charts/WeightLineChart';
import { progressAPI, mealPlanAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { validateRequired, validateNumber, formatDate, toInputDate } from '../../utils/validators';

const emptyForm = {
  weight: '',
  caloriesConsumed: '',
  proteinConsumed: '',
  carbsConsumed: '',
  fatConsumed: '',
  date: new Date().toISOString().split('T')[0],
};

const Progress = () => {
  const [progress, setProgress] = useState([]);
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, editing: null });
  const [deleteModal, setDeleteModal] = useState({ show: false, entry: null });
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      const [progressRes, plansRes] = await Promise.all([
        progressAPI.getAll(),
        mealPlanAPI.getAll(),
      ]);
      setProgress(progressRes.data);
      setMealPlan(plansRes.data[0] || null);
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

  const openEdit = (entry) => {
    setForm({
      weight: entry.weight,
      caloriesConsumed: entry.caloriesConsumed,
      proteinConsumed: entry.proteinConsumed,
      carbsConsumed: entry.carbsConsumed,
      fatConsumed: entry.fatConsumed,
      date: toInputDate(entry.date),
    });
    setErrors({});
    setModal({ show: true, editing: entry._id });
  };

  const validate = () => {
    const newErrors = {};
    if (!validateNumber(form.weight)) newErrors.weight = 'Valid weight required';
    if (!validateRequired(form.date)) newErrors.date = 'Date is required';
    ['caloriesConsumed', 'proteinConsumed', 'carbsConsumed', 'fatConsumed'].forEach((field) => {
      if (form[field] !== '' && !validateNumber(form[field])) {
        newErrors[field] = 'Must be a valid number';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      weight: Number(form.weight),
      caloriesConsumed: Number(form.caloriesConsumed) || 0,
      proteinConsumed: Number(form.proteinConsumed) || 0,
      carbsConsumed: Number(form.carbsConsumed) || 0,
      fatConsumed: Number(form.fatConsumed) || 0,
      date: form.date,
    };

    try {
      if (modal.editing) {
        await progressAPI.update(modal.editing, data);
        showToast('Progress updated!', 'success');
      } else {
        await progressAPI.create(data);
        showToast('Progress logged!', 'success');
      }
      setModal({ show: false, editing: null });
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await progressAPI.delete(deleteModal.entry._id);
      showToast('Progress deleted!', 'success');
      setDeleteModal({ show: false, entry: null });
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const latest = progress[0];
  const targets = mealPlan || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="mb-0">Progress Tracking</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          <FaPlus className="me-1" /> Log Progress
        </button>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card page-card p-3">
            <MacroBarChart label="Calories" consumed={latest?.caloriesConsumed || 0} target={targets.calories} color="#0d6efd" />
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="card page-card p-3">
            <MacroBarChart label="Protein (g)" consumed={latest?.proteinConsumed || 0} target={targets.protein} color="#198754" />
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="card page-card p-3">
            <MacroBarChart label="Carbs (g)" consumed={latest?.carbsConsumed || 0} target={targets.carbs} color="#ffc107" />
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="card page-card p-3">
            <MacroBarChart label="Fat (g)" consumed={latest?.fatConsumed || 0} target={targets.fat} color="#dc3545" />
          </div>
        </div>
      </div>

      <div className="card page-card p-4 mb-4">
        <WeightLineChart progressData={progress} />
      </div>

      <div className="card page-card">
        <div className="card-header bg-white">
          <h5 className="mb-0">Progress History</h5>
        </div>
        <div className="card-body p-0">
          {progress.length === 0 ? (
            <p className="text-muted p-4 mb-0">No progress entries yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Weight</th>
                    <th>Calories</th>
                    <th>Protein</th>
                    <th>Carbs</th>
                    <th>Fat</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.map((entry) => (
                    <tr key={entry._id}>
                      <td>{formatDate(entry.date)}</td>
                      <td>{entry.weight} kg</td>
                      <td>{entry.caloriesConsumed}</td>
                      <td>{entry.proteinConsumed}g</td>
                      <td>{entry.carbsConsumed}g</td>
                      <td>{entry.fatConsumed}g</td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(entry)}>
                            <FaEdit />
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteModal({ show: true, entry })}>
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
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{modal.editing ? 'Edit Progress' : 'Log Progress'}</h5>
                  <button type="button" className="btn-close" onClick={() => setModal({ show: false, editing: null })} />
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Date *</label>
                        <input
                          type="date"
                          className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                          value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                        />
                        {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Weight (kg) *</label>
                        <input
                          type="number"
                          step="0.1"
                          className={`form-control ${errors.weight ? 'is-invalid' : ''}`}
                          value={form.weight}
                          onChange={(e) => setForm({ ...form, weight: e.target.value })}
                        />
                        {errors.weight && <div className="invalid-feedback">{errors.weight}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Calories Consumed</label>
                        <input type="number" className="form-control" value={form.caloriesConsumed} onChange={(e) => setForm({ ...form, caloriesConsumed: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Protein (g)</label>
                        <input type="number" className="form-control" value={form.proteinConsumed} onChange={(e) => setForm({ ...form, proteinConsumed: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Carbs (g)</label>
                        <input type="number" className="form-control" value={form.carbsConsumed} onChange={(e) => setForm({ ...form, carbsConsumed: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Fat (g)</label>
                        <input type="number" className="form-control" value={form.fatConsumed} onChange={(e) => setForm({ ...form, fatConsumed: e.target.value })} />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setModal({ show: false, editing: null })}>Cancel</button>
                    <button type="submit" className="btn btn-primary">{modal.editing ? 'Update' : 'Save'}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}

      <ConfirmModal
        show={deleteModal.show}
        title="Delete Progress"
        message="Are you sure you want to delete this progress entry?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ show: false, entry: null })}
      />
    </DashboardLayout>
  );
};

export default Progress;
