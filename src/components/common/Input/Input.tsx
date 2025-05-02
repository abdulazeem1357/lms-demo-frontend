import React, { InputHTMLAttributes, useState, useRef, useEffect } from 'react';

export type InputStatus = 'default' | 'error' | 'success';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Label text for the input
   */
  label: string;
  
  /**
   * ID for the input element
   * Required for accessibility to link label with input
   */
  id: string;
  
  /**
   * Error message to display below the input
   */
  errorMessage?: string;
  
  /**
   * Success message to display below the input
   */
  successMessage?: string;
  
  /**
   * Input status for validation styling
   * @default 'default'
   */
  status?: InputStatus;
  
  /**
   * Additional classes to apply to the input container
   */
  className?: string;
  
  /**
   * Whether the input is required
   */
  required?: boolean;
}

/**
 * Input component with floating label and validation states
 * 
 * @example
 * // Basic input with label
 * <Input id="email" label="Email" type="email" required />
 * 
 * @example
 * // Input with validation error
 * <Input 
 *   id="username" 
 *   label="Username" 
 *   status="error" 
 *   errorMessage="Username is already taken" 
 * />
 */
export const Input: React.FC<InputProps> = ({
  className = '',
  id,
  label,
  errorMessage,
  successMessage,
  status = 'default',
  required = false,
  value,
  defaultValue,
  onChange,
  ...props
}) => {
  // Track whether input has content to control label animation
  const [hasContent, setHasContent] = useState<boolean>(
    Boolean(value || defaultValue || props.placeholder)
  );
  
  // Track whether input has been focused at least once
  const [hasBeenFocused, setHasBeenFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update hasContent when value prop changes
  useEffect(() => {
    setHasContent(Boolean(value));
  }, [value]);

  // Container classes
  const containerClasses = `relative mb-6 ${className}`;
  
  // Label classes
  const labelClasses = `
    absolute transition-all duration-200 pointer-events-none
    ${hasContent || hasBeenFocused ? 'text-xs -top-2 left-2' : 'text-base top-2.5 left-3'}
    ${hasContent || hasBeenFocused ? 'bg-white px-1' : ''}
    ${status === 'error' ? 'text-red-500' : status === 'success' ? 'text-green-600' : 'text-gray-600'}
  `;
  
  // Input classes
  const inputClasses = `
    block w-full px-3 py-2.5 border rounded-md transition-colors
    focus:outline-none focus:ring-2 focus:ring-offset-0
    ${status === 'error' 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
      : status === 'success'
      ? 'border-green-500 focus:border-green-500 focus:ring-green-200'
      : 'border-gray-300 focus:border-avocado-500 focus:ring-avocado-200'}
  `;

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasContent(Boolean(e.target.value));
    if (onChange) {
      onChange(e);
    }
  };

  // Handle focus
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setHasBeenFocused(true);
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  return (
    <div className={containerClasses}>
      <div className="relative">
        <label 
          htmlFor={id} 
          className={labelClasses}
        >
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        
        <input
          ref={inputRef}
          id={id}
          className={inputClasses}
          onChange={handleChange}
          onFocus={handleFocus}
          aria-invalid={status === 'error'}
          aria-required={required}
          value={value}
          defaultValue={defaultValue}
          {...props}
        />
      </div>
      
      {status === 'error' && errorMessage && (
        <p 
          className="mt-1 text-sm text-red-600"
          id={`${id}-error`}
          aria-live="polite"
        >
          {errorMessage}
        </p>
      )}
      
      {status === 'success' && successMessage && (
        <p 
          className="mt-1 text-sm text-green-600"
          id={`${id}-success`}  
          aria-live="polite"
        >
          {successMessage}
        </p>
      )}
    </div>
  );
};

export default Input;