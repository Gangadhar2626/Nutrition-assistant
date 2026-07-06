import { Link } from 'react-router-dom';
import { FaLeaf, FaUserMd, FaUser, FaChartLine } from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <section className="landing-hero text-center">
        <div className="container">
          <FaLeaf size={64} className="mb-4" />
          <h1 className="display-4 fw-bold mb-3">Nutrition Assistant</h1>
          <p className="lead mb-4 mx-auto" style={{ maxWidth: 600 }}>
            Your complete platform for personalized meal planning, nutrition tracking, and health progress monitoring.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/register" className="btn btn-light btn-lg px-4">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline-light btn-lg px-4">
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card page-card h-100 text-center p-4">
                <FaUserMd size={40} className="text-primary mx-auto mb-3" />
                <h5>Dietitians</h5>
                <p className="text-muted">
                  Create and assign personalized meal plans to your clients with detailed macro tracking.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card page-card h-100 text-center p-4">
                <FaUser size={40} className="text-primary mx-auto mb-3" />
                <h5>Users</h5>
                <p className="text-muted">
                  Follow your assigned meal plan and track daily calories, macros, and weight progress.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card page-card h-100 text-center p-4">
                <FaChartLine size={40} className="text-primary mx-auto mb-3" />
                <h5>Analytics</h5>
                <p className="text-muted">
                  Visualize your nutrition data with interactive charts and monitor your health journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
