import React from 'react';
import { 
  ExclamationCircleIcon, 
  InformationCircleIcon, 
  FaceSmileIcon 
} from '@heroicons/react/24/outline';

export interface StateDisplayProps {
  /**
   * Type of state to display
   */
  type: 'empty' | 'error' | 'info' | 'success';
  
  /**
   * Main message to display
   */
  title: string;
  
  /**
   * Optional secondary message
   */
  message?: string;
  
  /**
   * Optional action button
   */
  actionButton?: React.ReactNode;
  
  /**
   * Optional custom icon to override the default
   */
  icon?: React.ReactNode;
  
  /**
   * Optional CSS classes
   */
  className?: string;
}

/**
 * Component for displaying empty states, errors, or information messages
 */
const StateDisplay: React.FC<StateDisplayProps> = ({
  type = 'empty',
  title,
  message,
  actionButton,
  icon,
  className = '',
}) => {
  // Determine the icon and colors based on type
  const getIconAndColors = () => {
    switch (type) {
      case 'error':
        return {
          icon: icon || <ExclamationCircleIcon className="w-12 h-12" />,
          bgColor: 'bg-red-50',
          iconColor: 'text-error',
          borderColor: 'border-error',
        };
      case 'info':
        return {
          icon: icon || <InformationCircleIcon className="w-12 h-12" />,
          bgColor: 'bg-blue-50',
          iconColor: 'text-info',
          borderColor: 'border-info',
        };
      case 'success':
        return {
          icon: icon || <FaceSmileIcon className="w-12 h-12" />,
          bgColor: 'bg-green-50',
          iconColor: 'text-success',
          borderColor: 'border-success',
        };
      case 'empty':
      default:
        return {
          icon: icon || <InformationCircleIcon className="w-12 h-12" />,
          bgColor: 'bg-neutral-50',
          iconColor: 'text-neutral-400',
          borderColor: 'border-neutral-200',
        };
    }
  };

  const { icon: displayIcon, bgColor, iconColor, borderColor } = getIconAndColors();

  return (
    <div className={`flex flex-col items-center justify-center p-8 rounded-lg border ${borderColor} ${bgColor} ${className}`}>
      <div className={`mb-4 ${iconColor}`}>
        {displayIcon}
      </div>
      <h3 className="text-lg font-medium text-neutral-800 mb-2">{title}</h3>
      {message && <p className="text-neutral-600 text-center mb-4">{message}</p>}
      {actionButton && <div className="mt-2">{actionButton}</div>}
    </div>
  );
};

export default StateDisplay;