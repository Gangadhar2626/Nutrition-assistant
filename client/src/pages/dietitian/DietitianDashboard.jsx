import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaUtensils } from 'react-icons/fa';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { mealPlanAPI, userAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const DietitianDashboard = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, clientsRes] = await Promise.all([
          mealPlanAPI.getAll(),
          userAPI.getClients(),
        ]);
        setMealPlans(plansRes.data);
        setClients(clientsRes.data);
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="mb-0">Dietitian Dashboard</h2>
        <Link to="/dietitian/meal-plans" className="btn btn-primary">
          Manage Meal Plans
        </Link>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card stat-card">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="stat-icon bg-primary bg-opacity-10 text-primary">
                <FaUtensils />
              </div>
              <div>
                <h3 className="mb-0">{mealPlans.length}</h3>
                <small className="text-muted">Active Meal Plans</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card stat-card">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="stat-icon bg-success bg-opacity-10 text-success">
                <FaUsers />
              </div>
              <div>
                <h3 className="mb-0">{clients.length}</h3>
                <small className="text-muted">Assigned Clients</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card page-card mb-4">
        <div className="card-header bg-white">
          <h5 className="mb-0">Recent Meal Plans</h5>
        </div>
        <div className="card-body p-0">
          {mealPlans.length === 0 ? (
            <p className="text-muted p-4 mb-0">No meal plans yet. Create your first plan!</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Title</th>
                    <th>Calories</th>
                    <th>Assigned To</th>
                  </tr>
                </thead>
                <tbody>
                  {mealPlans.slice(0, 5).map((plan) => (
                    <tr key={plan._id}>
                      <td>{plan.title}</td>
                      <td>{plan.calories} kcal</td>
                      <td>{plan.assignedTo?.name || 'Unassigned'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="card page-card">
        <div className="card-header bg-white">
          <h5 className="mb-0">Assigned Clients</h5>
        </div>
        <div className="card-body p-0">
          {clients.length === 0 ? (
            <p className="text-muted p-4 mb-0">No clients assigned yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client._id}>
                      <td>{client.name}</td>
                      <td>{client.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DietitianDashboard;
