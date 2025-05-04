import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StateDisplay } from '../StateDisplay';
import { Button } from '../Button';

export interface Props {
  /**
   * The children to render within the error boundary
   */
  children: ReactNode;
  
  /**
   * Optional custom fallback component to render when an error occurs
   */
  fallback?: ReactNode;
  
  /**
   * Optional callback function to execute when an error occurs
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  
  /**
   * Optional message to display when an error occurs
   */
  errorMessage?: string;
  
  /**
   * Optional title for the error display
   */
  errorTitle?: string;
  
  /**
   * Whether to reset the error boundary on prop changes
   */
  resetOnPropsChange?: boolean;
}

interface State {
  /**
   * Whether an error has been caught
   */
  hasError: boolean;
  
  /**
   * The error that was caught
   */
  error: Error | null;
}

/**
 * ErrorBoundary component that catches JavaScript errors in its child component tree,
 * logs the errors, and displays a fallback UI instead of crashing the whole application.
 *
 * @example
 * <ErrorBoundary 
 *   fallback={<p>Something went wrong</p>}
 *   onError={(error) => logErrorToService(error)}
 * >
 *   <ChildComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  /**
   * Update state to render fallback UI when an error occurs
   */
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * Handle component prop updates - reset error state if configured
   */
  public componentDidUpdate(prevProps: Props): void {
    if (
      this.state.hasError &&
      this.props.resetOnPropsChange &&
      this.props.children !== prevProps.children
    ) {
      this.setState({ hasError: false, error: null });
    }
  }

  /**
   * Log error details to console and call custom error handler if provided
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Reset the error boundary state
   */
  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  /**
   * Render fallback UI if there's an error, otherwise render children
   */
  public render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback, errorTitle, errorMessage } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return (
        <StateDisplay
          type="error"
          title={errorTitle || "Something went wrong"}
          message={errorMessage || error?.message || "An unexpected error occurred"}
          actionButton={
            <Button variant="primary" onClick={this.handleReset}>
              Try again
            </Button>
          }
        />
      );
    }

    // If there's no error, render children normally
    return children;
  }
}

export default ErrorBoundary;