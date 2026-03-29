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
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span style={{ color: 'var(--error)' }}>*</span>}
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
        className={`w-full px-3 py-2 border rounded-md bg-surface-bright text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary ${error ? 'border-error' : 'border-border'}`}
      />
      {error && <span className="form-error-message">{error}</span>}
    </div>
  );
};

export default Input;
