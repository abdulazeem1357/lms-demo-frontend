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
      primary: 'bg-avocado-500 text-white',
      secondary: 'bg-gray-500 text-white',
      success: 'bg-green-500 text-white',
      warning: 'bg-yellow-500 text-white',
      error: 'bg-red-500 text-white',
      info: 'bg-blue-500 text-white',
    },
    outlined: {
      primary: 'bg-avocado-50 text-avocado-700 border border-avocado-500',
      secondary: 'bg-gray-50 text-gray-700 border border-gray-500',
      success: 'bg-green-50 text-green-700 border border-green-500',
      warning: 'bg-yellow-50 text-yellow-700 border border-yellow-500',
      error: 'bg-red-50 text-red-700 border border-red-500',
      info: 'bg-blue-50 text-blue-700 border border-blue-500',
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