import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLectureById } from '../../services/lecture';
import { SecureVideoPlayer } from '../../components/common/SecureVideoPlayer';
import { Spinner } from '../../components/common/Spinner';
import { StateDisplay } from '../../components/common/StateDisplay';

const SecureVideoPlayerPage: React.FC = () => {
  const { courseId, lectureId } = useParams<{ courseId: string; lectureId: string }>();

  // Apply overflow hidden to body when component mounts
  useEffect(() => {
    // Save original styles
    const originalOverflow = document.body.style.overflow;
    
    // Apply new styles to prevent scrolling
    document.body.style.overflow = 'hidden';
    
    // Cleanup function to restore original styles
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Fetch lecture details
  const { data: lecture, isLoading, isError } = useQuery({
    queryKey: ['lecture', lectureId],
    queryFn: () => (lectureId ? getLectureById(lectureId) : Promise.reject('No lecture ID provided')),
    enabled: !!lectureId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-100 overflow-hidden">
        <Spinner size="lg" label="Loading secure player..." />
      </div>
    );
  }

  if (isError || !lecture) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-100 overflow-hidden">
        <StateDisplay
          type="error"
          title="Error Loading Video"
          message="Unable to load the secure video player. Please try again later."
        />
      </div>
    );
  }

  // Construct secure video URL
  const videoUrl = `https://iframe.mediadelivery.net/play/152947/6b1332f7-adde-44e3-8ed7-2b654e3832bd`;

  // Render without additional wrappers
  return (
    <SecureVideoPlayer
      videoUrl={videoUrl}
      lectureId={lectureId}
      courseId={courseId}
      title={lecture.title}
    />
  );
};

export default SecureVideoPlayerPage;