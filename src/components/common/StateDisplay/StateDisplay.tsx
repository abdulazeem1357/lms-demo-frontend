import React from 'react';
import { ExclamationCircleIcon, FolderOpenIcon } from '@heroicons/react/24/outline';
import { Button } from '../Button';

export type StateVariant = 'empty' | 'error';

export interface StateAction {
  /**
   * Text to display on the action button
   */
  text: string;
  
  /**
   * Click handler for the action button
   */
  onClick: () => void;
}

export interface StateDisplayProps {
  /**
   * The type of state to display
   * @default 'empty'
   */
  variant?: StateVariant;
  
  /**
   * Title text for the state
   */
  title: string;
  
  /**
   * Descriptive message explaining the state
   */
  message: string;
  
  /**
   * Optional custom icon to display
   * Default icons are provided based on variant
   */
  icon?: React.ReactNode;
  
  /**
   * Optional action button configuration
   */
  action?: StateAction;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Size of the state display
   * @default 'default'
   */
  size?: 'compact' | 'default' | 'large';
}

/**
 * StateDisplay component for consistently showing empty states or errors
 * 
 * @example
 * // Basic empty state
 * <StateDisplay 
 *   title="No results found" 
 *   message="Try adjusting your search or filters"
 * />
 * 
 * @example
 * // Error state with action
 * <StateDisplay 
 *   variant="error"
 *   title="Failed to load data" 
 *   message="There was an error retrieving your information"
 *   action={{ 
 *     text: "Try Again", 
 *     onClick: () => refetch() 
 *   }}
 * />
 * 
 * @example
 * // Empty state with custom icon
 * <StateDisplay 
 *   title="Your cart is empty" 
 *   message="Add items to your cart to continue"
 *   icon={<ShoppingCartIcon className="w-16 h-16 text-gray-400" />}
 * />
 */
export const StateDisplay: React.FC<StateDisplayProps> = ({
  variant = 'empty',
  title,
  message,
  icon,
  action,
  className = '',
  size = 'default',
}) => {
  // Default icons based on variant
  const defaultIcons = {
    empty: <FolderOpenIcon className="w-full h-full" />,
    error: <ExclamationCircleIcon className="w-full h-full" />
  };

  // Container and text sizes based on size prop
  const sizeClasses = {
    compact: {
      container: 'py-4 px-6',
      icon: 'w-10 h-10',
      title: 'text-lg',
      message: 'text-sm'
    },
    default: {
      container: 'py-8 px-6',
      icon: 'w-16 h-16',
      title: 'text-xl',
      message: 'text-base'
    },
    large: {
      container: 'py-12 px-8',
      icon: 'w-24 h-24',
      title: 'text-2xl',
      message: 'text-lg'
    }
  };

  // Variant-specific styles
  const variantStyles = {
    empty: {
      icon: 'text-neutral-400',
      container: 'bg-neutral-50',
    },
    error: {
      icon: 'text-error',
      container: 'bg-error-50',
    }
  };

  // Selected icon - custom or default based on variant
  const selectedIcon = icon || defaultIcons[variant];

  return (
    <div 
      className={`
        flex flex-col items-center justify-center text-center
        rounded-lg border border-gray-200
        ${variantStyles[variant].container}
        ${sizeClasses[size].container}
        ${className}
      `}
      role={variant === 'error' ? 'alert' : 'status'}
      data-testid={`state-${variant}`}
    >
      <div className={`${sizeClasses[size].icon} ${variantStyles[variant].icon} mb-4`}>
        {selectedIcon}
      </div>
      
      <h3 className={`font-semibold text-gray-900 ${sizeClasses[size].title} mb-2`}>
        {title}
      </h3>
      
      <p className={`text-gray-600 max-w-md ${sizeClasses[size].message} mb-6`}>
        {message}
      </p>
      
      {action && (
        <Button 
          onClick={action.onClick}
          variant={variant === 'error' ? 'secondary' : 'primary'}
          size={size === 'compact' ? 'sm' : size === 'large' ? 'lg' : 'md'}
        >
          {action.text}
        </Button>
      )}
    </div>
  );
};

export default StateDisplay;