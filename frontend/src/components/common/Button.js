import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  className = '',
}) => {
  const baseStyles =
    'px-4 py-2 rounded-md font-medium transition-all cursor-pointer border-none text-sm font-medium';

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400',
    ghost: 'bg-transparent text-indigo-600 border-indigo-600 border hover:bg-indigo-50',
  };

  const buttonClasses = `${baseStyles} ${variants[variant]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      style={{
        backgroundColor:
          variant === 'primary'
            ? 'var(--primary)'
            : variant === 'secondary'
            ? 'var(--surface-container)'
            : variant === 'danger'
            ? 'var(--error)'
            : 'transparent',
        color:
          variant === 'primary'
            ? 'white'
            : variant === 'secondary'
            ? 'var(--on-surface)'
            : variant === 'danger'
            ? 'white'
            : 'var(--primary)',
        padding: '8px 16px',
        borderRadius: 'var(--radius-md)',
        border: variant === 'ghost' ? '1px solid var(--primary)' : 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  );
};

export default Button;
