import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLectureById } from '../../services/lecture';
import { ILecture } from '../../types/course.types';

// Import existing common components
import { Spinner } from '../../components/common/Spinner';
import { StateDisplay } from '../../components/common/StateDisplay';
import Button from '../../components/common/Button/Button';

// Remove local Button component

/**
 * Simple video player component
 * TODO: Replace with actual VideoPlayer component when available
 */
const VideoPlayer = ({ 
  src, 
  drmToken,
  onError,
  onBuffering
}: { 
  src: string; 
  drmToken?: string;
  onError?: () => void;
  onBuffering?: (isBuffering: boolean) => void;
}) => (
  <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
      <div className="text-center">
        <div className="text-3xl mb-4">🎬</div>
        <div className="text-sm">
          {src ? (
            <>Video Player - Source: {src.substring(0, 30)}...</>
          ) : (
            <>Video source not available</>
          )}
          {drmToken && <div className="mt-2 text-xs">DRM protected content</div>}
        </div>
      </div>
    </div>
  </div>
);

/**
 * Simple notes sidebar component
 * TODO: Replace with actual NotesSidebar component when available
 */
const NotesSidebar = ({ lectureId }: { lectureId: string }) => (
  <div className="bg-white rounded-lg p-4 border border-neutral-200">
    <h3 className="font-medium text-lg mb-4">Lecture Notes</h3>
    <div className="text-sm text-neutral-600">
      Notes for lecture: {lectureId}
    </div>
    <textarea
      className="w-full mt-4 p-3 border border-neutral-300 rounded-md resize-none h-64 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      placeholder="Take notes here..."
    />
    <div className="mt-2 text-xs text-neutral-500 text-right">
      Notes are automatically saved
    </div>
  </div>
);

/**
 * LecturePage component for displaying video lecture content and associated notes
 */
const LecturePage: React.FC = () => {
  const { lectureId = '' } = useParams<{ lectureId: string }>();
  const [isBuffering, setIsBuffering] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  
  // Fetch lecture details
  const { 
    data: lecture,
    isLoading: isLectureLoading,
    isError: isLectureError,
    refetch: refetchLecture,
    error
  } = useQuery({
    queryKey: ['lecture', lectureId],
    queryFn: () => getLectureById(lectureId),
    enabled: !!lectureId,
  });

  // TODO: Implement these queries when services are available
  // For now, we'll just simulate having previous and next lectures
  const previousLecture = {
    id: '123',
    title: 'Previous Lecture (Simulated)'
  };
  
  const nextLecture = {
    id: '456',
    title: 'Next Lecture (Simulated)'
  };

  // Get video streaming URL from bunnyVideoId
  // TODO: Use proper video streaming service to get the URL
  const getVideoStreamUrl = (bunnyVideoId: string) => {
    return `https://video.cdn.example.com/stream/${bunnyVideoId}/manifest.m3u8`;
  };

  // Handle video player errors
  const handleVideoError = () => {
    setPlayerError('Failed to load video. Please try again.');
  };

  // Loading state
  if (isLectureLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-50">
        <Spinner size="lg" label="Loading lecture..." />
      </div>
    );
  }

  // Error state
  if (isLectureError) {
    return (
      <div className="container mx-auto p-8 max-w-4xl">
        <StateDisplay
          type="error"
          title="Failed to load lecture"
          message={error instanceof Error ? error.message : "Failed to load lecture details. Please try again."}
          actionButton={
            <button 
              className="mt-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
              onClick={() => refetchLecture()}
            >
              Try again
            </button>
          }
        />
      </div>
    );
  }

  // Empty state
  if (!lecture) {
    return (
      <div className="container mx-auto p-8 max-w-4xl">
        <StateDisplay
          type="empty"
          title="Lecture not found"
          message="The requested lecture could not be found."
        />
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main content column */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl font-heading font-bold text-neutral-900 mb-4">{lecture.title}</h1>
              {lecture.description && (
                <p className="text-neutral-700 mb-6">{lecture.description}</p>
              )}
            </div>
            
            {/* Video player with loading overlay */}
            <div className="relative">
              <VideoPlayer 
                src={getVideoStreamUrl(lecture.bunnyVideoId)}
                onBuffering={setIsBuffering}
                onError={handleVideoError}
              />
              {isBuffering && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <Spinner size="lg" color="white" />
                </div>
              )}
              {playerError && (
                <div className="mt-4">
                  <StateDisplay 
                    type="error" 
                    title="Video Error"
                    message={playerError}
                    actionButton={
                      <button 
                        className="mt-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                        onClick={() => setPlayerError(null)}
                      >
                        Try again
                      </button>
                    }
                  />
                </div>
              )}
            </div>
            
            {/* Lecture navigation */}
            <div className="flex justify-between items-center mt-8">
              {previousLecture ? (
                <Link to={`/lecture/${previousLecture.id}`}>
                  <Button variant="outline">
                    &larr; Previous Lecture
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" disabled>
                  &larr; Previous Lecture
                </Button>
              )}
              {nextLecture ? (
                <Link to={`/lecture/${nextLecture.id}`}>
                  <Button>
                    Next Lecture &rarr;
                  </Button>
                </Link>
              ) : (
                <Button disabled>
                  Next Lecture &rarr;
                </Button>
              )}
            </div>
          </div>
          
          {/* Sidebar column */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <NotesSidebar lectureId={lectureId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturePage;