import React from 'react';

export interface ProgressBarProps {
  /**
   * Current progress value (0-100)
   */
  value: number;
  
  /**
   * Optional label to display alongside the progress bar
   */
  label?: string;
  
  /**
   * Whether to show the percentage text
   */
  showPercentage?: boolean;
  
  /**
   * Optional CSS classes
   */
  className?: string;
  
  /**
   * Height of the progress bar
   */
  height?: 'sm' | 'md' | 'lg';
  
  /**
   * Color of the progress bar
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

/**
 * Progress bar component that shows completion status
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercentage = false,
  className = '',
  height = 'md',
  color = 'primary'
}) => {
  // Ensure value is between 0-100
  const normalizedValue = Math.min(100, Math.max(0, value));
  
  // Determine height class
  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  }[height];
  
  // Determine color class for the filled part
  const colorClass = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error'
  }[color];
  
  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between mb-1 text-xs font-medium">
          {label && <span className="text-neutral-600">{label}</span>}
          {showPercentage && <span className="text-neutral-500">{normalizedValue}%</span>}
        </div>
      )}
      <div className="w-full bg-neutral-200 rounded-full overflow-hidden">
        <div 
          className={`${heightClass} ${colorClass} rounded-full transition-all duration-300 ease-in-out`}
          style={{ width: `${normalizedValue}%` }}
          role="progressbar"
          aria-valuenow={normalizedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

export default ProgressBar;