import React from 'react';
import styles from './SkeletonLoader.module.css';

export type SkeletonVariant = 'line' | 'circle' | 'rectangle';
export type SkeletonTheme = 'light' | 'dark' | 'avocado';

export interface SkeletonLoaderProps {
  /**
   * The type of skeleton shape to display
   * @default 'line'
   */
  variant?: SkeletonVariant;
  
  /**
   * Width of the skeleton (CSS value or number for pixels)
   * @default '100%' for line/rectangle, '40px' for circle
   */
  width?: string | number;
  
  /**
   * Height of the skeleton (CSS value or number for pixels)
   * @default '12px' for line, '40px' for circle/rectangle
   */
  height?: string | number;
  
  /**
   * Border radius of the skeleton
   * @default '4px' for line/rectangle, '50%' for circle
   */
  borderRadius?: string;

  /**
   * Add className to the skeleton for custom styling
   */
  className?: string;
  
  /**
   * Number of skeleton items to render (for repeated elements)
   * @default 1
   */
  count?: number;
  
  /**
   * Gap between multiple items when count > 1
   * @default '0.5rem'
   */
  gap?: string;

  /**
   * Color theme of the skeleton
   * @default 'light'
   */
  theme?: SkeletonTheme;

  /**
   * Disable the animation for static skeletons
   * @default false
   */
  disableAnimation?: boolean;

  /**
   * Animation type to use
   * @default 'pulse'
   */
  animation?: 'pulse' | 'shimmer';
}

/**
 * Skeleton loader component for displaying loading states
 * 
 * @example
 * // Basic line loader (default)
 * <SkeletonLoader />
 * 
 * @example
 * // Circle loader for avatar placeholder
 * <SkeletonLoader variant="circle" width={48} height={48} />
 * 
 * @example
 * // Multiple line skeletons for text
 * <SkeletonLoader count={3} />
 * 
 * @example
 * // Rectangle for card or image placeholder
 * <SkeletonLoader variant="rectangle" height="200px" />
 * 
 * @example
 * // Avocado theme skeleton with shimmer animation
 * <SkeletonLoader theme="avocado" animation="shimmer" />
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'line',
  width,
  height,
  borderRadius,
  className = '',
  count = 1,
  gap = '0.5rem',
  theme = 'light',
  disableAnimation = false,
  animation = 'pulse',
}) => {
  // Default dimensions based on variant
  const getDefaultWidth = () => {
    return variant === 'circle' ? '40px' : '100%';
  };
  
  const getDefaultHeight = () => {
    return variant === 'line' ? '12px' : '40px';
  };
  
  const getDefaultBorderRadius = () => {
    return variant === 'circle' ? '50%' : '4px';
  };
  
  // Convert number to pixel values if needed
  const getSize = (size: string | number | undefined, defaultSize: string) => {
    if (size === undefined) return defaultSize;
    return typeof size === 'number' ? `${size}px` : size;
  };
  
  // Calculate final dimensions
  const finalWidth = getSize(width, getDefaultWidth());
  const finalHeight = getSize(height, getDefaultHeight());
  const finalBorderRadius = borderRadius || getDefaultBorderRadius();

  // Base styles for the skeleton
  const baseStyles = {
    width: finalWidth,
    height: finalHeight,
    borderRadius: finalBorderRadius,
  };

  // Theme-based background colors
  const themeClasses = {
    light: 'bg-neutral-200',
    dark: 'bg-neutral-700',
    avocado: 'bg-primary-200',
  };

  // Animation class
  const animationClass = disableAnimation ? '' : (animation === 'pulse' ? 'animate-pulse' : '');

  // Generate multiple skeletons if count > 1
  const skeletons = Array.from({ length: count }).map((_, index) => (
    <div
      key={index}
      style={{
        ...baseStyles,
        marginBottom: index < count - 1 ? gap : undefined,
        position: 'relative',
        overflow: 'hidden',
      }}
      className={`${themeClasses[theme]} ${animationClass} ${className}`}
      role="progressbar"
      aria-busy="true"
      aria-valuemin={0}
      aria-valuemax={100}
      data-testid="skeleton-loader"
    >
      {!disableAnimation && animation === 'shimmer' && (
        <div className={styles.shimmerOverlay} />
      )}
    </div>
  ));

  return <>{skeletons}</>;
};

export default SkeletonLoader;