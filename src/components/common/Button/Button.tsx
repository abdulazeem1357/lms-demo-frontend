import React, { ButtonHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Spinner } from '../Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'ghost' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  /**
   * Button contents (text or elements)
   */
  children: React.ReactNode;
  
  /**
   * Color variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * Size variant of the button
   * @default 'md'
   */
  size?: ButtonSize;
  
  /**
   * Whether the button should take up the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Makes the button corners rounded
   * @default false
   */
  rounded?: boolean;
  
  /**
   * Shows a loading spinner and disables the button
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * Disables the button
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Icon to display before the button text
   */
  startIcon?: React.ReactNode;
  
  /**
   * Icon to display after the button text
   */
  endIcon?: React.ReactNode;
  
  /**
   * Optional click handler
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Primary UI component for user interaction
 * 
 * @example
 * // Basic primary button
 * <Button>Click me</Button>
 * 
 * @example
 * // Secondary button with custom size
 * <Button variant="secondary" size="lg">Secondary Action</Button>
 * 
 * @example
 * // Full width button with loading state
 * <Button fullWidth isLoading>Processing...</Button>
 * 
 * @example
 * // Button with icons
 * <Button startIcon={<UserIcon className="w-4 h-4" />}>Profile</Button>
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  rounded = false,
  isLoading = false,
  disabled = false,
  startIcon,
  endIcon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  // Variant styling classes
  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white focus:ring-primary-200',
    secondary: 'bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-400 text-neutral-800 focus:ring-neutral-100',
    success: 'bg-success hover:bg-success/90 active:bg-success/80 text-white focus:ring-green-200',
    warning: 'bg-warning hover:bg-warning/90 active:bg-warning/80 text-white focus:ring-yellow-200',
    error: 'bg-error hover:bg-error/90 active:bg-error/80 text-white focus:ring-red-200',
    info: 'bg-info hover:bg-info/90 active:bg-info/80 text-white focus:ring-blue-200',
    ghost: 'bg-transparent hover:bg-neutral-100 active:bg-neutral-200 text-neutral-700 focus:ring-neutral-100',
    link: 'bg-transparent hover:underline text-primary-600 hover:text-primary-700 p-0 focus:ring-0'
  };

  // Size styling classes
  const sizeClasses = {
    xs: 'text-xs px-2.5 py-1.5',
    sm: 'text-sm px-3 py-2',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-5 py-2.5',
    xl: 'text-xl px-6 py-3'
  };

  // Button is "text-only" when it has the link variant
  const isTextOnly = variant === 'link';
  
  // Base button classes
  const buttonClasses = `
    ${!isTextOnly ? 'inline-flex items-center justify-center font-medium transition-colors' : ''}
    ${!isTextOnly ? 'focus:outline-none focus:ring-2 focus:ring-offset-1' : ''}
    ${!isTextOnly && !rounded ? 'rounded-md' : ''}
    ${!isTextOnly && rounded ? 'rounded-full' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${isTextOnly ? '' : sizeClasses[size]}
    ${variantClasses[variant]}
    ${disabled || isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim();

  // Animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: disabled || isLoading || isTextOnly ? 1 : 1.02 },
    tap: { scale: disabled || isLoading || isTextOnly ? 1 : 0.98 },
  };

  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      variants={buttonVariants}
      transition={{ duration: 0.1 }}
      data-testid="button"
      aria-busy={isLoading}
      {...(props as HTMLMotionProps<"button">)}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <span className="mr-2">
            <Spinner size={16} color={`${variant === 'secondary' ? 'border-neutral-600' : 'border-white'}`} />
          </span>
          {children}
        </div>
      ) : (
        <>
          {startIcon && <span className="mr-2">{startIcon}</span>}
          {children}
          {endIcon && <span className="ml-2">{endIcon}</span>}
        </>
      )}
    </motion.button>
  );
};

export default Button;