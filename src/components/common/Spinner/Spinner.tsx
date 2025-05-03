import React from 'react';

export interface SpinnerProps {
  /**
   * Size of the spinner
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Color of the spinner
   */
  color?: 'primary' | 'secondary' | 'white';
  
  /**
   * Optional CSS classes
   */
  className?: string;
  
  /**
   * Optional label to display next to the spinner
   */
  label?: string;
}

/**
 * Animated loading spinner component
 */
const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
  label
}) => {
  // Determine size class
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }[size];
  
  // Determine color class
  const colorClass = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    white: 'text-white'
  }[color];
  
  return (
    <div className={`inline-flex items-center ${className}`}>
      <svg
        className={`animate-spin ${sizeClass} ${colorClass}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        data-testid="loading-spinner"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {label && <span className="ml-2 text-sm font-medium text-neutral-700">{label}</span>}
    </div>
  );
};

export default Spinner;