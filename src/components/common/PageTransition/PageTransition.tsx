import React from 'react';
import { motion, Variants } from 'framer-motion';
import { pageTransitionVariants } from '../../../utils/transitions';

export interface PageTransitionProps {
  /**
   * Content to be rendered with transition effects
   */
  children: React.ReactNode;
  
  /**
   * Optional custom animation variants
   * @default pageTransitionVariants (fade)
   */
  variants?: Variants;
  
  /**
   * Optional className for the container
   */
  className?: string;
}

/**
 * PageTransition component provides consistent animations between route changes
 * 
 * @example
 * // Basic usage with default fade transition
 * <PageTransition>
 *   <YourPageContent />
 * </PageTransition>
 * 
 * @example
 * // Using a custom transition variant
 * <PageTransition variants={slideUpVariants}>
 *   <YourPageContent />
 * </PageTransition>
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  variants = pageTransitionVariants,
  className = '',
}) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      className={`h-full w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;