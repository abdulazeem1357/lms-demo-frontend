import React, { TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
  containerClassName?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  className = '',
  containerClassName = '',
  ...rest
}) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <div className="mb-2 flex justify-between">
          <label htmlFor={rest.id} className="block text-sm font-medium text-neutral-700">
            {label}
          </label>
          {helperText && <span className="text-xs text-neutral-500">{helperText}</span>}
        </div>
      )}
      <textarea
        className={`
          w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-neutral-400
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          ${error ? 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-neutral-300'}
          ${rest.disabled ? 'bg-neutral-100 cursor-not-allowed text-neutral-500' : ''}
          ${className}
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${rest.id}-error` : undefined}
        {...rest}
      />
      {error && (
        <p
          className="mt-1 text-sm text-red-600"
          id={rest.id ? `${rest.id}-error` : undefined}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Textarea;