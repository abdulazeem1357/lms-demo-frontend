import React from 'react';

interface SpinnerProps {
  /**
   * Size of the spinner in pixels
   * @default 24
   */
  size?: number;
  
  /**
   * Color of the spinner - uses Tailwind color classes
   * @default 'border-avocado-500'
   */
  color?: string;
  
  /**
   * Additional CSS classes to apply to the spinner
   */
  className?: string;
}

/**
 * Animated spinner component for loading states
 * 
 * @example
 * // Default spinner
 * <Spinner />
 * 
 * @example
 * // Custom size and color
 * <Spinner size={32} color="border-blue-500" />
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 24,
  color = 'border-avocado-500',
  className = '',
}) => {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-solid border-current
      border-r-transparent ${color} ${className}`}
      style={{
        width: size,
        height: size,
      }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;