import React from 'react';

export const Button = ({ children, variant = 'primary', type = 'button', onClick, disabled = false, className = '', ...rest }) => {
  const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-surface-container text-on-surface hover:bg-surface-container-high border',
    danger: 'bg-error text-white hover:brightness-90',
    ghost: 'bg-transparent text-primary border border-primary',
  };

  const classes = `${base} ${variants[variant] || variants.primary} px-4 py-2 ${className}`;

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} {...rest}>
      {children}
    </button>
  );
};

export default Button;
