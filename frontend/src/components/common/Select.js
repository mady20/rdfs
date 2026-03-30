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
    <div className="flex flex-col gap-1.5 w-full mb-4">
      {label && (
        <label htmlFor={name} className="text-sm font-semibold text-on-surface">
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
        className={`w-full px-4 py-2.5 transition-all duration-200 border rounded-lg bg-surface text-on-surface focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          error
            ? 'border-error focus:ring-error focus:border-error'
            : 'border-border focus:ring-primary focus:border-primary hover:border-on-surface-variant/30'
        }`}
      >
        <option value="">-- Select Option --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-sm text-error font-medium animate-fade-in">{error}</span>}
    </div>
  );
};

export default Select;
