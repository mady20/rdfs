import React from 'react';

export const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  disabled = false,
  required = false,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-on-surface mb-1">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md bg-surface-bright text-on-surface focus:outline-none focus:border-primary ${error ? 'border-error' : 'border-border'}`}
      >
        <option value="">-- Select Option --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-sm text-error mt-1 block">{error}</span>}
    </div>
  );
};

export default Select;
