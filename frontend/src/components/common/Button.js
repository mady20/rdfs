import React from 'react';

export const Button = ({ children, variant = 'primary', type = 'button', onClick, disabled = false, className = '' }) => {
  const base = 'inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark hover:shadow-soft hover:-translate-y-0.5',
    secondary: 'bg-surface text-on-surface hover:bg-surface-container-high border border-border hover:shadow-sm',
    danger: 'bg-error text-white hover:brightness-95 hover:shadow-sm hover:-translate-y-0.5',
    ghost: 'bg-transparent text-primary hover:bg-primary/5',
  };

  const classes = `${base} ${variants[variant] || variants.primary} px-5 py-2.5 ${className}`;

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
};

export default Button;
