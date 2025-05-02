import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TooltipProps {
  /**
   * Text content to display in the tooltip
   */
  content: string;
  
  /**
   * Element that triggers the tooltip
   */
  children: React.ReactElement;
  
  /**
   * Position of the tooltip relative to the trigger element
   * @default 'top'
   */
  position?: 'top' | 'right' | 'bottom' | 'left';
  
  /**
   * Delay before showing tooltip in milliseconds
   * @default 300
   */
  delayShow?: number;
  
  /**
   * Additional CSS classes to apply to the tooltip
   */
  className?: string;
  
  /**
   * Whether the tooltip is dark or light themed
   * @default 'dark'
   */
  theme?: 'light' | 'dark';
}

/**
 * Tooltip component that displays text on hover/focus of its trigger element
 * 
 * @example
 * // Basic tooltip
 * <Tooltip content="Helpful information">
 *   <button>Hover me</button>
 * </Tooltip>
 * 
 * @example
 * // Tooltip with custom position and theme
 * <Tooltip 
 *   content="Click to submit your form" 
 *   position="bottom"
 *   theme="light"
 * >
 *   <Button variant="primary">Submit</Button>
 * </Tooltip>
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delayShow = 300,
  className = '',
  theme = 'dark',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Theme classes
  const themeClasses = {
    dark: 'bg-gray-800 text-white',
    light: 'bg-white text-gray-800 border border-gray-200',
  };

  // Position calculation based on trigger element dimensions
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Calculate positions for each placement option
    const positions = {
      top: {
        x: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + scrollLeft,
        y: triggerRect.top - tooltipRect.height - 8 + scrollTop,
      },
      right: {
        x: triggerRect.right + 8 + scrollLeft,
        y: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2 + scrollTop,
      },
      bottom: {
        x: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + scrollLeft,
        y: triggerRect.bottom + 8 + scrollTop,
      },
      left: {
        x: triggerRect.left - tooltipRect.width - 8 + scrollLeft,
        y: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2 + scrollTop,
      },
    };
    
    setTooltipPosition(positions[position]);
  };

  // Handle showing tooltip with delay
  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // Calculate position after visibility is set to ensure tooltip dimensions are available
      setTimeout(calculatePosition, 0);
    }, delayShow);
  };

  // Handle hiding tooltip
  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Animation variants
  const variants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  // Arrow position classes
  const arrowPositionClasses = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-gray-800 border-l-transparent border-r-transparent border-b-0',
    right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-full border-r-gray-800 border-t-transparent border-b-transparent border-l-0',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-gray-800 border-l-transparent border-r-transparent border-t-0',
    left: 'right-0 top-1/2 -translate-y-1/2 translate-x-full border-l-gray-800 border-t-transparent border-b-transparent border-r-0',
  };

  // Light theme arrow adjustments
  const arrowThemeClasses = {
    dark: {
      top: 'border-t-gray-800',
      right: 'border-r-gray-800',
      bottom: 'border-b-gray-800',
      left: 'border-l-gray-800',
    },
    light: {
      top: 'border-t-white',
      right: 'border-r-white',
      bottom: 'border-b-white',
      left: 'border-l-white',
    },
  };

  return (
    <>
      {/* Trigger element wrapper */}
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {React.cloneElement(children)}
      </div>
      
      {/* Tooltip */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            role="tooltip"
            className={`fixed z-50 px-3 py-2 text-sm rounded shadow-md pointer-events-none
              ${themeClasses[theme]} ${className}`}
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            transition={{ duration: 0.15 }}
          >
            {content}
            
            {/* Arrow */}
            <div 
              className={`absolute w-0 h-0 border-solid border-4
                ${arrowPositionClasses[position].replace(
                  theme === 'dark' ? '' : `border-${position}-gray-800`,
                  arrowThemeClasses[theme][position]
                )}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Tooltip;