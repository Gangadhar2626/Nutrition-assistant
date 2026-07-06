import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/admin/AdminDashboard';
import DietitianDashboard from './pages/dietitian/DietitianDashboard';
import MealPlans from './pages/dietitian/MealPlans';
import UserDashboard from './pages/user/UserDashboard';
import Progress from './pages/user/Progress';
import { getRoleDashboardPath } from './utils/validators';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (user) return <Navigate to={getRoleDashboardPath(user.role)} replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/dietitian" element={<ProtectedRoute roles={['dietitian']}><DietitianDashboard /></ProtectedRoute>} />
      <Route path="/dietitian/meal-plans" element={<ProtectedRoute roles={['dietitian']}><MealPlans /></ProtectedRoute>} />
      <Route path="/user" element={<ProtectedRoute roles={['user']}><UserDashboard /></ProtectedRoute>} />
      <Route path="/user/progress" element={<ProtectedRoute roles={['user']}><Progress /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
