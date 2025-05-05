import React from 'react'; // Removed useState
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLectureById } from '../../services/lecture';
// Import existing common components
import { Spinner } from '../../components/common/Spinner';
import { StateDisplay } from '../../components/common/StateDisplay';
import Button from '../../components/common/Button/Button';
import { PlayCircleIcon } from '@heroicons/react/24/solid'; // Import Play icon

// Removed placeholder VideoPlayer component

/**
 * Simple notes sidebar component
 * TODO: Replace with actual NotesSidebar component when available
 */
const NotesSidebar = ({ lectureId }: { lectureId: string }) => (
  // ... (NotesSidebar implementation remains the same)
  <div className="bg-white rounded-lg p-4 border border-neutral-200 shadow-sm"> {/* Added shadow-sm */}
    <h3 className="font-medium text-lg mb-4 text-neutral-800">Lecture Notes</h3> {/* Adjusted text color */}
    <div className="text-sm text-neutral-600">
      Notes for lecture: {lectureId}
    </div>
    <textarea
      className="w-full mt-4 p-3 border border-neutral-300 rounded-md resize-none h-64 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm" // Added text-sm
      placeholder="Take notes here..."
    />
    <div className="mt-2 text-xs text-neutral-500 text-right">
      Notes are automatically saved
    </div>
  </div>
);

/**
 * LecturePage component for displaying lecture details and providing access to the secure video player.
 */
const LecturePage: React.FC = () => {
  // Assuming courseId is available in the route, e.g., /courses/:courseId/lectures/:lectureId
  const { courseId = 'c1d2e3f4-g5h6-i7j8-k9l0-m1n2o3p4q5r6', lectureId = 'l1py1' } = useParams<{ courseId: string; lectureId: string }>();
  // Removed player-specific state (isBuffering, playerError)

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

  // TODO: Implement actual previous/next lecture logic based on course structure/API
  const previousLecture = {
    id: 'l1js1', // Example previous lecture ID from mock data
    title: 'Previous Lecture (Simulated)'
  }; // Example: No previous lecture
  const nextLecture = { // Example: Next lecture exists
    id: 'l2js1', // Example next lecture ID from mock data
    title: 'Next Lecture (Simulated)'
  };

  // Loading state
  if (isLectureLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-50">
        <Spinner size="lg" label="Loading lecture..." />
      </div>
    );
  }

  // Error state - Combined error and not found logic
  if (isLectureError || !lecture) {
    const title = isLectureError ? "Failed to load lecture" : "Lecture not found";
    const message = isLectureError
      ? (error instanceof Error ? error.message : "Failed to load lecture details. Please try again.")
      : "The requested lecture could not be found.";
    const showTryAgain = isLectureError; // Only show Try Again if it was a fetch error

    return (
      <div className="container mx-auto p-8 max-w-4xl">
        <StateDisplay
          type="error" // Use error type for both scenarios
          title={title}
          message={message}
          actionButton={
            showTryAgain ? (
              <Button
                onClick={() => refetchLecture()}
                variant="primary" // Use common Button component
              >
                Try again
              </Button>
            ) : (
              <Link to={courseId ? `/courses/${courseId}` : '/courses'}> {/* Link back to course or courses list */}
                <Button variant="primary">
                  {courseId ? 'Back to Course' : 'Back to Courses'}
                </Button>
              </Link>
            )
          }
        />
      </div>
    );
  }

  // Construct the path to the secure video player page
  const secureVideoPath = `/courses/${courseId}/lectures/${lectureId}/secure-video`;

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main content column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lecture Title and Description */}
            <div>
              <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-2">{lecture.title}</h1> {/* Increased title size */}
              {lecture.description && (
                <p className="text-neutral-700 text-base mb-6">{lecture.description}</p>
              )}
            </div>

            {/* Secure Video Player Launch Section */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm"> {/* Added container styling */}
              <h2 className="text-xl font-semibold text-neutral-800 mb-4">Watch Lecture Video</h2>
              <div className="relative group cursor-pointer rounded-lg overflow-hidden border border-neutral-300 hover:border-primary-500 transition-colors">
                <Link to={secureVideoPath} aria-label={`Play secure video for ${lecture.title}`}>
                  {/* Placeholder Thumbnail - Replace with actual thumbnail if available */}
                  <div className="aspect-video bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                     <PlayCircleIcon className="w-16 h-16 text-neutral-500 group-hover:text-primary-600 transition-colors" />
                  </div>
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                    <PlayCircleIcon className="w-20 h-20 text-white opacity-0 group-hover:opacity-90 transition-opacity duration-300" />
                  </div>
                </Link>
              </div>
              <p className="mt-3 text-sm text-neutral-600">
                Click the video above to watch the lecture in our secure player. This content is DRM protected.
              </p>
               <Link to={secureVideoPath} className="mt-4 inline-block">
                 <Button variant="primary" size="lg"> {/* Larger primary button */}
                   <PlayCircleIcon className="w-5 h-5 mr-2" />
                   Watch Lecture Now
                 </Button>
               </Link>
            </div>

            {/* Lecture navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-neutral-200">
              {previousLecture ? (
                // Use courseId in the link if available
                <Link to={`/courses/${courseId}/lectures/${previousLecture.id}`}>
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
                 // Use courseId in the link if available
                <Link to={`/courses/${courseId}/lectures/${nextLecture.id}`}>
                  <Button variant="primary"> {/* Use primary for next */}
                    Next Lecture &rarr;
                  </Button>
                </Link>
              ) : (
                <Button variant="primary" disabled>
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