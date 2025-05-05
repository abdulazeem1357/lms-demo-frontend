import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

export interface ModalProps {
  /**
   * Controls whether the modal is displayed
   */
  isOpen: boolean;
  
  /**
   * Called when the modal should close
   */
  onClose: () => void;
  
  /**
   * Modal content
   */
  children: React.ReactNode;
  
  /**
   * Optional title for the modal
   */
  title?: string;
  
  /**
   * Maximum width of the modal
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /**
   * Whether to show the close button in the header
   */
  showCloseButton?: boolean;
  
  /**
   * Whether to close when clicking outside
   */
  closeOnClickOutside?: boolean;
  
  /**
   * Whether to close when pressing escape key
   */
  closeOnEsc?: boolean;
  
  /**
   * Additional classes for the modal content
   */
  contentClassName?: string;
}

/**
 * Modal component with backdrop and animations
 * 
 * @example
 * <Modal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   title="Edit Profile"
 * >
 *   <div className="p-4">Modal content goes here</div>
 *   <div className="flex justify-end p-4 bg-neutral-50 border-t">
 *     <Button onClick={() => setIsModalOpen(false)}>Close</Button>
 *     <Button variant="primary" className="ml-2">Save</Button>
 *   </div>
 * </Modal>
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  showCloseButton = true,
  closeOnClickOutside = true,
  closeOnEsc = true,
  contentClassName = '',
}) => {
  // Ref for the modal content
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full m-4',
  }[size];
  
  // Close on escape key press
  useEffect(() => {
    const handleEscKeyPress = (e: KeyboardEvent) => {
      if (isOpen && closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKeyPress);
    return () => window.removeEventListener('keydown', handleEscKeyPress);
  }, [isOpen, closeOnEsc, onClose]);

  // Portal container
  const portalContainer = typeof document !== 'undefined' ? document.body : null;

  // Handle body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset'; // Restore background scroll
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Don't render if no portal container
  if (!portalContainer) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-neutral-900 bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              e.stopPropagation();
              if (closeOnClickOutside) {
                onClose();
              }
            }}
          />
          
          {/* Modal container */}
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              // Only close if clicking the backdrop (not modal content)
              if (e.target === e.currentTarget && closeOnClickOutside) {
                onClose();
              }
            }}
          >
            {/* Modal content */}
            <motion.div
              ref={modalRef}
              className={`relative w-full ${sizeClasses} overflow-hidden rounded-lg bg-white text-left shadow-xl`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling to backdrop
            >
              {/* Header with title and close button */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                  {title && (
                    <h3 
                      id="modal-title"
                      className="text-lg font-semibold text-neutral-800"
                    >
                      {title}
                    </h3>
                  )}
                  {showCloseButton && (
                    <button
                      type="button"
                      className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      onClick={onClose}
                      aria-label="Close modal"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              )}
              
              {/* Modal content */}
              <div className={contentClassName}>
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    portalContainer
  );
};

export default Modal;