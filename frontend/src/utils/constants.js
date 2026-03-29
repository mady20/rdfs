export const ROLES = {
  ADMIN: 'admin',
  DISTRIBUTOR: 'distributor',
  RETAILER: 'retailer',
};

export const TRANSACTION_TYPES = [
  { label: 'Recharge', value: 'recharge' },
  { label: 'Bill Payment', value: 'billpay' },
  { label: 'AEPS', value: 'aeps' },
  { label: 'DMT', value: 'dmt' },
];

export const TRANSACTION_STATUS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Success', value: 'success' },
  { label: 'Failed', value: 'failed' },
];

export const WALLET_TYPES = [
  { label: 'Credit', value: 'credit' },
  { label: 'Debit', value: 'debit' },
];
