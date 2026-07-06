const Toast = ({ message, type, onClose }) => {
  const bgClass = type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : 'bg-info';

  return (
    <div className={`toast show align-items-center text-white ${bgClass} border-0 mb-2`} role="alert">
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={onClose} />
      </div>
    </div>
  );
};

export default Toast;
