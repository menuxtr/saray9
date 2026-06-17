import React from 'react';

export default function FormInput({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  helperText,
  textarea = false,
  rows = 3,
  ...props
}) {
  const inputClasses = "w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200";

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-neutral-300 mb-1.5">
          {label} {required && <span className="text-amber-500">*</span>}
        </label>
      )}
      
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={inputClasses}
          {...props}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={inputClasses}
          {...props}
        />
      )}

      {helperText && (
        <p className="mt-1.5 text-xs text-neutral-400 font-medium">
          {helperText}
        </p>
      )}
    </div>
  );
}
