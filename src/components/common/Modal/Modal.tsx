import React, { useEffect, useRef, useCallback } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../Button/Button';
import { createPortal } from 'react-dom';

export interface ModalProps {
  /**
   * Modal title displayed in the header
   */
  title: string;
  
  /**
   * Whether the modal is visible
   */
  isOpen: boolean;
  
  /**
   * Callback function when modal is closed
   */
  onClose: () => void;
  
  /**
   * Content to render in modal body
   */
  children: React.ReactNode;
  
  /**
   * Optional footer content (typically action buttons)
   */
  footer?: React.ReactNode;
  
  /**
   * Maximum width of modal
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /**
   * If true, clicking overlay will not close modal
   * @default false
   */
  disableOverlayClick?: boolean;
  
  /**
   * If true, pressing escape key will not close modal
   * @default false
   */
  disableEscapeKey?: boolean;

  /**
   * Additional classes for the modal container
   */
  className?: string;
  
  /**
   * Custom ID for the modal (used for a11y)
   * @default 'modal-{random-id}'
   */
  id?: string;
  
  /**
   * Determines if the close button is shown in the header
   * @default true
   */
  showCloseButton?: boolean;
  
  /**
   * If true, places the modal at the center of the viewport
   * @default true
   */
  centered?: boolean;
}

/**
 * Modal component with overlay, header, body, and footer sections.
 * Implements focus trapping and keyboard accessibility.
 * 
 * @example
 * // Basic modal
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirmation"
 * >
 *   <p>Are you sure you want to proceed?</p>
 * </Modal>
 * 
 * @example
 * // Modal with custom footer
 * <Modal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="Edit Profile"
 *   footer={
 *     <>
 *       <Button variant="secondary" onClick={handleClose}>Cancel</Button>
 *       <Button onClick={handleSave}>Save Changes</Button>
 *     </>
 *   }
 * >
 *   <p>Form content goes here</p>
 * </Modal>
 */
export const Modal: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
  footer,
  size = 'md',
  disableOverlayClick = false,
  disableEscapeKey = false,
  className = '',
  id = `modal-${Math.random().toString(36).substring(2, 9)}`,
  showCloseButton = true,
  centered = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const titleId = `${id}-title`;
  const contentId = `${id}-content`;

  // Size classes mapping
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  // Handle Escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (isOpen && !disableEscapeKey && event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose, disableEscapeKey]);

  // Improved focus trap functionality
  const handleFocusCapture = useCallback(() => {
    // Move focus back to the modal if it leaves
    if (modalRef.current && !modalRef.current.contains(document.activeElement)) {
      modalRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Save the element that had focus before opening modal
      previouslyFocusedElement.current = document.activeElement as HTMLElement;

      // Focus the modal container
      if (modalRef.current) {
        modalRef.current.focus();
      }

      // Prevent scrolling of background content
      document.body.style.overflow = 'hidden';
      
      // Ensure focus remains within the modal
      document.addEventListener('focusin', handleFocusCapture);
    } else {
      // Restore background scrolling when modal closes
      document.body.style.overflow = '';

      // Return focus to the element that had it before modal opened
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
      
      // Remove focus capture when modal is closed
      document.removeEventListener('focusin', handleFocusCapture);
    }
    
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('focusin', handleFocusCapture);
    };
  }, [isOpen, handleFocusCapture]);

  // Create a focus trap
  const handleTabKey = (event: React.KeyboardEvent) => {
    if (event.key !== 'Tab' || !modalRef.current) return;

    // Get all focusable elements within modal
    const focusableElements = Array.from(
      modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.hasAttribute('disabled') && (el.getAttribute('tabindex') !== '-1'));
    
    // Handle empty or no focusable elements
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // If shift+tab on first element, move to last element
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
    } 
    // If tab on last element, move to first element
    else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
  };

  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!disableOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;
  
  // Modal markup to be rendered in portal
  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={contentId}
      data-testid="modal-overlay"
    >
      <div
        ref={modalRef}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col w-full 
          ${sizeClasses[size]} max-h-[90vh] transform transition-all duration-300 ease-in-out
          ${centered ? 'my-auto' : 'mt-16'}
          ${className}`}
        tabIndex={-1} // Makes div focusable but not tab-reachable
        onKeyDown={handleTabKey}
        data-testid="modal-container"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 
            id={titleId}
            className="text-xl font-semibold text-gray-900 dark:text-gray-100"
          >
            {title}
          </h2>
          {showCloseButton && (
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded p-1"
              onClick={onClose}
              aria-label="Close modal"
              data-testid="modal-close-button"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Modal body */}
        <div 
          id={contentId}
          className="px-6 py-4 flex-1 overflow-y-auto text-neutral-800"
          data-testid="modal-body"
        >
          {children}
        </div>

        {/* Modal footer (optional) */}
        {footer && (
          <div 
            className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 rounded-b-lg flex justify-end space-x-3"
            data-testid="modal-footer"
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Use createPortal to render the modal at the document root
  return createPortal(modalContent, document.body);
};

export default Modal;