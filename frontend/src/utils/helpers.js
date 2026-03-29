export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (amount) => {
  return `₹${parseFloat(amount).toFixed(2)}`;
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'success':
    case 'active':
      return 'status-success';
    case 'pending':
      return 'status-pending';
    case 'failed':
      return 'status-failed';
    case 'inactive':
      return 'status-inactive';
    default:
      return '';
  }
};

export const getStatusLabel = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const apiErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An error occurred. Please try again.';
};
