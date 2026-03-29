const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

const isPositiveNumber = (num) => {
  return typeof num === 'number' && num > 0;
};

const validateUserCreation = (data, role = null) => {
  const errors = {};

  if (!data.name || !data.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!data.email || !data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!data.phone || !data.phone.trim()) {
    errors.phone = 'Phone is required';
  }

  if (data.commissionPercent !== undefined && data.commissionPercent < 0) {
    errors.commissionPercent = 'Commission percent cannot be negative';
  }

  return errors;
};

const validateWalletAdjustment = (data) => {
  const errors = {};

  if (!data.targetUserId) {
    errors.targetUserId = 'Target user is required';
  }

  if (!['credit', 'debit'].includes(data.type)) {
    errors.type = 'Type must be credit or debit';
  }

  if (!isPositiveNumber(data.amount)) {
    errors.amount = 'Amount must be a positive number';
  }

  return errors;
};

const validateTransaction = (data) => {
  const errors = {};

  if (!['recharge', 'billpay', 'aeps', 'dmt'].includes(data.type)) {
    errors.type = 'Invalid transaction type';
  }

  if (!isPositiveNumber(data.amount)) {
    errors.amount = 'Amount must be a positive number';
  }

  if (data.status && !['pending', 'success', 'failed'].includes(data.status)) {
    errors.status = 'Invalid status';
  }

  return errors;
};

const validateWalletTransfer = (data) => {
  const errors = {};

  if (!data.retailerId) {
    errors.retailerId = 'Retailer ID is required';
  }

  if (!isPositiveNumber(data.amount)) {
    errors.amount = 'Amount must be a positive number';
  }

  return errors;
};

module.exports = {
  isValidEmail,
  isValidPhone,
  isPositiveNumber,
  validateUserCreation,
  validateWalletAdjustment,
  validateTransaction,
  validateWalletTransfer,
};
