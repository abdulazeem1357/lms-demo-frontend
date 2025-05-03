import React from 'react';

export interface CardProps {
  /**
   * Card content
   */
  children: React.ReactNode;
  
  /**
   * Optional CSS classes to apply to the card
   */
  className?: string;
  
  /**
   * Whether to add hover effects
   */
  hoverable?: boolean;
  
  /**
   * Click handler for the card
   */
  onClick?: () => void;
}

/**
 * Card component with consistent styling
 */
const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick,
}) => {
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-md overflow-hidden
        ${hoverable ? 'transition-transform duration-300 hover:shadow-lg hover:-translate-y-1' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;