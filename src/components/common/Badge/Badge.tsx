import React from 'react';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  /**
   * Badge content (text or count)
   */
  children: React.ReactNode;
  
  /**
   * Color variant
   * @default 'primary'
   */
  variant?: BadgeVariant;
  
  /**
   * Size variant
   * @default 'md'
   */
  size?: BadgeSize;
  
  /**
   * Whether badge is a pill shape (fully rounded)
   * @default true
   */
  pill?: boolean;
  
  /**
   * Whether badge is outlined instead of filled
   * @default false
   */
  outlined?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Optional icon to display before text
   */
  icon?: React.ReactNode;
}

/**
 * Badge component for displaying status text or counts
 * 
 * @example
 * // Basic badge
 * <Badge>New</Badge>
 * 
 * @example
 * // Badge with count 
 * <Badge variant="error" size="sm">5</Badge>
 * 
 * @example
 * // Outlined badge with icon
 * <Badge 
 *   variant="success" 
 *   outlined 
 *   icon={<CheckIcon className="w-3 h-3 mr-1" />}
 * >
 *   Completed
 * </Badge>
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  pill = true,
  outlined = false,
  className = '',
  icon,
}) => {
  // Variant color maps
  const variantClasses = {
    filled: {
      primary: 'bg-primary-500 text-white',
      secondary: 'bg-secondary-500 text-white',
      success: 'bg-success text-white',
      warning: 'bg-warning text-white',
      error: 'bg-error text-white',
      info: 'bg-info text-white',
    },
    outlined: {
      primary: 'bg-primary-50 text-primary-700 border border-primary-500',
      secondary: 'bg-secondary-50 text-secondary-700 border border-secondary-500',
      success: 'bg-success-50 text-success border border-success',
      warning: 'bg-warning-50 text-warning border border-warning',
      error: 'bg-error-50 text-error border border-error',
      info: 'bg-info-50 text-info border border-info',
    },
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-2.5 py-1',
  };
  
  // Shape classes
  const shapeClasses = pill ? 'rounded-full' : 'rounded';
  
  // Combine all classes
  const badgeClasses = `
    inline-flex items-center font-medium
    ${sizeClasses[size]}
    ${shapeClasses}
    ${outlined ? variantClasses.outlined[variant] : variantClasses.filled[variant]}
    ${className}
  `;

  return (
    <span 
      className={badgeClasses}
      data-testid="badge"
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;