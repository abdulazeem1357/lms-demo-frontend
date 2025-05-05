import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

/**
 * Props for the SecureVideoPlayer component
 */
interface SecureVideoPlayerProps {
  /** The URL for the secure video stream */
  videoUrl: string;
  /** Optional lecture ID for context */
  lectureId?: string;
  /** Optional course ID for context */
  courseId?: string;
  /** Optional title to display in the player header */
  title?: string;
}

/**
 * A secure video player component that renders a DRM-protected video in an iframe
 * with minimal controls and security notices
 */
const SecureVideoPlayer: React.FC<SecureVideoPlayerProps> = ({
  videoUrl,
  title,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);

  // Handle back navigation
  const handleBack = () => {
    navigate(-1); // Go back to the previous page in history
  };

  // Add keyboard shortcut for easier navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handle iframe load events
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setIframeError(true);
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-900 text-white overflow-hidden">
      {/* Header with Back Button and Title */}
      <header className="px-4 py-3 flex items-center justify-between bg-neutral-800 shadow-md">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-200 hover:bg-neutral-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Go back to previous page"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            <span>Back</span>
          </button>
        </div>
        
        {title && (
          <div className="font-medium text-neutral-100 truncate max-w-lg">
            {title}
          </div>
        )}
        
        <div className="flex items-center text-primary-400">
          <ShieldCheckIcon className="w-5 h-5 mr-1" />
          <span className="text-xs font-medium">Secured</span>
        </div>
      </header>

      {/* Video Player Iframe */}
      <main className="flex-grow relative bg-black flex items-center justify-center overflow-hidden">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 bg-opacity-75 z-10">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-neutral-600 border-t-primary-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-neutral-300 text-sm">Loading secure player...</p>
            </div>
          </div>
        )}
        
        {/* Error state */}
        {iframeError && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 z-10">
            <div className="text-center p-6 max-w-md">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-4">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-200 mb-2">Failed to load video</h3>
              <p className="text-neutral-400 mb-4">There was an error loading the secure video player. Please try refreshing or contact support.</p>
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 focus:ring-primary-500"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        <iframe
          src={videoUrl}
          className="w-full h-full border-none bg-black"
          title={title || "DRM Protected Video"}
          allowFullScreen
          allow="encrypted-media; picture-in-picture; fullscreen"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        ></iframe>
      </main>

      {/* Footer with DRM Notice */}
      <footer className="p-3 text-center bg-neutral-800 border-t border-neutral-700">
        <div className="flex items-center justify-center text-xs text-neutral-400">
          <ShieldCheckIcon className="w-4 h-4 mr-1 text-primary-400" />
          <p>DRM Protected Content - Screen recording is disabled for security reasons</p>
        </div>
      </footer>
    </div>
  );
};

export default SecureVideoPlayer;