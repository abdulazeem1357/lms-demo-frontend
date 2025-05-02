import React, { ButtonHTMLAttributes } from 'react';
import { Spinner } from '../Spinner';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * Size of the button
   * @default 'medium'
   */
  size?: ButtonSize;
  
  /**
   * Whether the button is in a loading state
   */
  isLoading?: boolean;
  
  /**
   * Text to display when in loading state
   */
  loadingText?: string;
  
  /**
   * Whether to show the loading spinner
   */
  showSpinner?: boolean;
  
  /**
   * Additional CSS classes to apply to the button
   */
  className?: string;
  
  /**
   * Children elements
   */
  children: React.ReactNode;
}

/**
 * Primary button component for user interactions
 * 
 * @example
 * // Primary button
 * <Button onClick={handleSubmit}>Submit</Button>
 * 
 * @example
 * // Secondary button with loading state
 * <Button variant="secondary" isLoading showSpinner loadingText="Submitting...">
 *   Submit
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  loadingText,
  showSpinner = false,
  className = '',
  disabled = false,
  children,
  ...props
}) => {
  // Base button styles
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-avocado-500';
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-avocado-600 text-white hover:bg-avocado-700 active:bg-avocado-800 disabled:bg-gray-300',
    secondary: 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400',
  };
  
  // Size styles
  const sizeStyles = {
    small: 'text-xs px-2.5 py-1.5',
    medium: 'text-sm px-4 py-2',
    large: 'text-base px-6 py-3',
  };
  
  // Disabled and loading styles
  const disabledStyles = (disabled || isLoading) ? 'cursor-not-allowed opacity-70' : '';
  
  // Combine all styles
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`;
  
  return (
    <button
      className={buttonStyles}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && showSpinner && (
        <Spinner 
          size={size === 'small' ? 14 : size === 'medium' ? 18 : 22} 
          className="mr-2"
          color={variant === 'primary' ? 'border-white' : 'border-avocado-500'}
        />
      )}
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
};

export default Button;