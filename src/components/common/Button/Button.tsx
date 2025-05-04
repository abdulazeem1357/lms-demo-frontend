import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant determining color scheme and importance
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  
  /**
   * Button size
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Full width button
   */
  fullWidth?: boolean;
  
  /**
   * Optional icon to display before button text
   */
  startIcon?: React.ReactNode;
  
  /**
   * Optional icon to display after button text
   */
  endIcon?: React.ReactNode;
  
  /**
   * Is button in loading state
   */
  isLoading?: boolean;
  
  /**
   * Is button disabled
   */
  disabled?: boolean;
  
  /**
   * Optional additional classes
   */
  className?: string;
}

/**
 * Button component with various styles and states
 * 
 * @example
 * <Button variant="primary" size="md" onClick={() => console.log('clicked')}>
 *   Click me
 * </Button>
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  startIcon,
  endIcon,
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }[size];
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-sm focus:ring-primary-500 disabled:bg-primary-300',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700 text-white shadow-sm focus:ring-secondary-500 disabled:bg-secondary-300',
    outline: 'border border-neutral-300 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-700 focus:ring-primary-500 disabled:bg-neutral-100 disabled:text-neutral-400',
    ghost: 'bg-transparent hover:bg-neutral-100 active:bg-neutral-200 text-neutral-700 focus:ring-primary-500 disabled:text-neutral-400',
    danger: 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-sm focus:ring-red-500 disabled:bg-red-300'
  }[variant];
  
  // Disabled and loading states
  const isDisabled = disabled || isLoading;
  
  // Render loading spinner
  const renderSpinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
  
  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${sizeClasses}
        ${variantClasses}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={isDisabled}
      type={props.type || 'button'}
      {...props}
    >
      {isLoading && renderSpinner()}
      {!isLoading && startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      {!isLoading && endIcon && <span className="ml-2">{endIcon}</span>}
    </button>
  );
};

export default Button;