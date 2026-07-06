import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';

const NotFound = () => {
  return (
    <>
      <Navbar />
      <div className="text-center py-5 mt-5">
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <h3 className="mb-3">Page Not Found</h3>
        <p className="text-muted mb-4">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">
          <FaHome className="me-2" /> Go Home
        </Link>
      </div>
    </>
  );
};

export default NotFound;
