import React from 'react';

export const Input = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled = false,
  error,
  required = false,
  className = '',
  ...rest
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-on-surface mb-1">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`${className} w-full px-3 py-2 border rounded-md bg-surface-bright text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary ${error ? 'border-error' : 'border-border'}`}
        {...rest}
      />
      {error && <span className="text-sm text-error mt-1 block">{error}</span>}
    </div>
  );
};

export default Input;
