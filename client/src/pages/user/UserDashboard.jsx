import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import MacroBarChart from '../../components/charts/MacroBarChart';
import WeightLineChart from '../../components/charts/WeightLineChart';
import { mealPlanAPI, progressAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const UserDashboard = () => {
  const [mealPlan, setMealPlan] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, progressRes] = await Promise.all([
          mealPlanAPI.getAll(),
          progressAPI.getAll(),
        ]);
        setMealPlan(plansRes.data[0] || null);
        setProgress(progressRes.data);
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const latestProgress = progress.length > 0 ? progress[0] : null;
  const targets = mealPlan || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="mb-0">My Dashboard</h2>
        <Link to="/user/progress" className="btn btn-primary">
          Track Progress
        </Link>
      </div>

      {mealPlan ? (
        <div className="card page-card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">{mealPlan.title}</h5>
          </div>
          <div className="card-body">
            {mealPlan.description && <p className="text-muted">{mealPlan.description}</p>}
            <div className="row g-3 mb-3">
              <div className="col-md-3"><strong>Calories:</strong> {mealPlan.calories} kcal</div>
              <div className="col-md-3"><strong>Protein:</strong> {mealPlan.protein}g</div>
              <div className="col-md-3"><strong>Carbs:</strong> {mealPlan.carbs}g</div>
              <div className="col-md-3"><strong>Fat:</strong> {mealPlan.fat}g</div>
            </div>
            <div className="row">
              {['breakfast', 'lunch', 'dinner', 'snacks'].map((meal) => (
                mealPlan[meal] && (
                  <div className="col-md-6 mb-3" key={meal}>
                    <div className="meal-section">
                      <h6 className="text-capitalize fw-bold">{meal}</h6>
                      <p className="mb-0">{mealPlan[meal]}</p>
                    </div>
                  </div>
                )
              ))}
            </div>
            {mealPlan.dietitian && (
              <small className="text-muted">Dietitian: {mealPlan.dietitian.name}</small>
            )}
          </div>
        </div>
      ) : (
        <div className="alert alert-info">No meal plan assigned yet. Contact your dietitian.</div>
      )}

      <h4 className="mb-3">Today's Nutrition</h4>
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card page-card p-3">
            <MacroBarChart
              label="Calories"
              consumed={latestProgress?.caloriesConsumed || 0}
              target={targets.calories}
              color="#0d6efd"
            />
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="card page-card p-3">
            <MacroBarChart
              label="Protein (g)"
              consumed={latestProgress?.proteinConsumed || 0}
              target={targets.protein}
              color="#198754"
            />
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="card page-card p-3">
            <MacroBarChart
              label="Carbs (g)"
              consumed={latestProgress?.carbsConsumed || 0}
              target={targets.carbs}
              color="#ffc107"
            />
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="card page-card p-3">
            <MacroBarChart
              label="Fat (g)"
              consumed={latestProgress?.fatConsumed || 0}
              target={targets.fat}
              color="#dc3545"
            />
          </div>
        </div>
      </div>

      <div className="card page-card p-4">
        <WeightLineChart progressData={progress} />
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
