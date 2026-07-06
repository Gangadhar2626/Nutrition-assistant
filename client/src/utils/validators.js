export const validateEmail = (email) => {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  return value !== undefined && value !== null && String(value).trim() !== '';
};

export const validateNumber = (value, min = 0) => {
  const num = Number(value);
  return !isNaN(num) && num >= min;
};

export const getRoleDashboardPath = (role) => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'dietitian':
      return '/dietitian';
    case 'user':
      return '/user';
    default:
      return '/';
  }
};

export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const toInputDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
};
