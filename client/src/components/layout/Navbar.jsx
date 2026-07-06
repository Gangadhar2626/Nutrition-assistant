import { Link, useNavigate } from 'react-router-dom';
import { FaLeaf, FaBars } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
      <div className="container-fluid px-3">
        {user && (
          <button className="btn btn-link text-white d-md-none me-2 p-0" onClick={onToggleSidebar}>
            <FaBars size={20} />
          </button>
        )}
        <Link className="navbar-brand navbar-brand-custom d-flex align-items-center gap-2" to="/">
          <FaLeaf />
          Nutrition Assistant
        </Link>
        <div className="ms-auto d-flex align-items-center gap-3">
          {user ? (
            <>
              <span className="text-white-50 d-none d-sm-inline">
                {user.name} ({user.role})
              </span>
              <Link to="/profile" className="btn btn-outline-light btn-sm">
                Profile
              </Link>
              <button className="btn btn-light btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-light btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-light btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
