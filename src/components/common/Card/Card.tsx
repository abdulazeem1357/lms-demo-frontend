import React from 'react';
import { motion } from 'framer-motion';

export interface CardProps {
  /**
   * Content to be rendered inside the card
   */
  children: React.ReactNode;
  
  /**
   * Additional CSS classes to apply to the card
   */
  className?: string;
  
  /**
   * Whether the card should have hover effects
   * @default true
   */
  hoverEffect?: boolean;
  
  /**
   * Card border style
   * @default 'none'
   */
  border?: 'none' | 'thin' | 'subtle';
  
  /**
   * Card elevation/shadow level
   * @default 'medium'
   */
  elevation?: 'none' | 'low' | 'medium' | 'high';
  
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Card component for containing related content with optional hover effects
 * 
 * @example
 * // Basic card
 * <Card>
 *   <h3 className="text-lg font-medium">Card Title</h3>
 *   <p className="mt-2">Card content goes here</p>
 * </Card>
 * 
 * @example
 * // Card with custom styling and hover effects
 * <Card 
 *   className="bg-gray-50" 
 *   elevation="high"
 *   border="thin"
 *   onClick={() => navigate('/details')}
 * >
 *   <p>Interactive card with custom styling</p>
 * </Card>
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  border = 'none',
  elevation = 'medium',
  onClick,
}) => {
  // Border styles
  const borderStyles = {
    none: '',
    thin: 'border border-gray-200',
    subtle: 'border border-gray-100',
  };
  
  // Elevation/shadow styles
  const elevationStyles = {
    none: '',
    low: 'shadow-sm',
    medium: 'shadow',
    high: 'shadow-md',
  };
  
  // Base card styles
  const cardStyles = `
    bg-white 
    rounded-lg 
    overflow-hidden
    ${borderStyles[border]}
    ${elevationStyles[elevation]}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;
  
  // Hover animation variants
  const hoverVariants = {
    initial: {
      scale: 1,
      boxShadow: elevationStyles[elevation],
    },
    hover: {
      scale: hoverEffect ? 1.02 : 1,
      boxShadow: hoverEffect ? elevationStyles.high : elevationStyles[elevation],
    },
  };

  return (
    <motion.div
      className={cardStyles}
      initial="initial"
      whileHover="hover"
      variants={hoverVariants}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      data-testid="card"
    >
      <div className="p-4">
        {children}
      </div>
    </motion.div>
  );
};

export default Card;