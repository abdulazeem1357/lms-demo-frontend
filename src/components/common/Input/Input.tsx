import React, { InputHTMLAttributes, useState, useRef, useEffect } from 'react';

export type InputStatus = 'default' | 'error' | 'success';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Label text for the input
   */
  label: string;
  
  /**
   * Error message to display below the input
   */
  error?: string;
  
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
  wrapperClassName?: string;
  
  /**
   * Whether the input is required
   */
  required?: boolean;
  
  /**
   * Left icon to display inside input
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Right icon to display inside input
   */
  rightIcon?: React.ReactNode;
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
 *   error="Username is already taken" 
 * />
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  className = '',
  wrapperClassName = '',
  label,
  error,
  successMessage,
  status = 'default',
  required = false,
  value,
  defaultValue,
  onChange,
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
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
  const containerClasses = `relative mb-6 ${wrapperClassName}`;
  
  // Input classes
  const inputClasses = `
    block w-full px-3 py-2.5 border rounded-md transition-colors
    focus:outline-none focus:ring-2 focus:ring-offset-0
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    ${status === 'error' 
      ? 'border-error focus:border-error focus:ring-error-200' 
      : status === 'success'
      ? 'border-success focus:border-success focus:ring-success-200'
      : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-200'}
    ${className}
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
          htmlFor={props.id} 
          className={`
            block text-sm font-medium mb-1 text-gray-700
            ${status === 'error' ? 'text-error' : status === 'success' ? 'text-success' : ''}
          `}
        >
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref || inputRef}
            className={inputClasses}
            onChange={handleChange}
            onFocus={handleFocus}
            aria-invalid={status === 'error'}
            aria-required={required}
            value={value}
            defaultValue={defaultValue}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {rightIcon}
            </div>
          )}
          
          {status === 'error' && !rightIcon && error && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        {status === 'error' && error && (
          <p 
            className="mt-1 text-sm text-red-600"
            id={`${props.id}-error`}
            aria-live="polite"
          >
            {error}
          </p>
        )}
        
        {status === 'success' && successMessage && (
          <p 
            className="mt-1 text-sm text-green-600"
            id={`${props.id}-success`}  
            aria-live="polite"
          >
            {successMessage}
          </p>
        )}
      </div>
    </div>
  );
});

Input.displayName = 'Input';

export default Input;