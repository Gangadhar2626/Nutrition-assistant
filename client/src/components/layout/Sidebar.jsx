import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaUtensils, FaChartLine, FaUsers } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const adminLinks = [
    { to: '/admin', icon: FaTachometerAlt, label: 'Dashboard' },
  ];

  const dietitianLinks = [
    { to: '/dietitian', icon: FaTachometerAlt, label: 'Dashboard' },
    { to: '/dietitian/meal-plans', icon: FaUtensils, label: 'Meal Plans' },
  ];

  const userLinks = [
    { to: '/user', icon: FaTachometerAlt, label: 'Dashboard' },
    { to: '/user/progress', icon: FaChartLine, label: 'Progress' },
  ];

  let links = userLinks;
  if (user?.role === 'admin') links = adminLinks;
  else if (user?.role === 'dietitian') links = dietitianLinks;

  return (
    <>
      {isOpen && <div className="sidebar-overlay d-md-none" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="px-3 mb-3">
          <small className="text-muted text-uppercase fw-bold">Navigation</small>
        </div>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin' || to === '/dietitian' || to === '/user'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Icon />
            {label}
          </NavLink>
        ))}
        {user?.role === 'admin' && (
          <div className="px-3 mt-4">
            <small className="text-muted d-flex align-items-center gap-2">
              <FaUsers /> Admin Panel
            </small>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
