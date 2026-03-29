const ROLES = {
  ADMIN: 'admin',
  DISTRIBUTOR: 'distributor',
  RETAILER: 'retailer',
};

const WALLET_LEDGER_TYPES = {
  CREDIT: 'credit',
  DEBIT: 'debit',
  TRANSFER_IN: 'transfer_in',
  TRANSFER_OUT: 'transfer_out',
  MANUAL_CREDIT: 'manual_credit',
  MANUAL_DEBIT: 'manual_debit',
};

const TRANSACTION_TYPES = {
  RECHARGE: 'recharge',
  BILLPAY: 'billpay',
  AEPS: 'aeps',
  DMT: 'dmt',
  WALLET_TRANSFER: 'wallet_transfer',
  MANUAL_CREDIT: 'manual_credit',
  MANUAL_DEBIT: 'manual_debit',
};

const TRANSACTION_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
};

module.exports = {
  ROLES,
  WALLET_LEDGER_TYPES,
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
};
