import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

// Services
import * as enrollmentService from '../../../../services/enrollment';
import * as progressService from '../../../../services/progress';

// Components
import { Card } from '../../../common/Card';
import { ProgressBar } from '../../../common/ProgressBar';
import { Spinner } from '../../../common/Spinner';
import { StateDisplay } from '../../../common/StateDisplay';

// Types
import { IUserEnrollment } from '../../../../types/enrollment.types';
import { useAuth } from '../../../../contexts/AuthContext';

/**
 * Widget that displays a grid of enrolled courses with progress indicators
 */
const EnrolledCoursesWidget: React.FC = () => {
  const { user } = useAuth();
  
  // Fetch enrolled courses
  const {
    data: enrolledCourses,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['enrollments', user?.id],
    queryFn: () => enrollmentService.getUserEnrollments(user?.id || ''),
    enabled: !!user?.id,
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-heading font-semibold mb-2 text-neutral-800">Enrolled Courses</h2>
        <div className="flex justify-center items-center p-12">
          <Spinner size="lg" label="Loading courses..." />
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-heading font-semibold mb-2 text-neutral-800">Enrolled Courses</h2>
        <StateDisplay 
          type="error"
          title="Failed to load courses"
          message={error instanceof Error ? error.message : 'An error occurred while fetching courses'}
          actionButton={
            <button 
              className="mt-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          }
        />
      </div>
    );
  }

  // Handle empty state
  if (!enrolledCourses || enrolledCourses.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-heading font-semibold mb-2 text-neutral-800">Enrolled Courses</h2>
        <StateDisplay 
          type="empty"
          title="No courses yet"
          message="You haven't enrolled in any courses yet."
          actionButton={
            <Link 
              to="/courses" 
              className="mt-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              Browse Courses
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-heading font-semibold text-neutral-800">Enrolled Courses</h2>
        <Link 
          to="/courses" 
          className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map((enrollment: IUserEnrollment) => (
          <CourseCard 
            key={enrollment.enrollmentId} 
            enrollment={enrollment} 
            userId={user?.id || ''}
          />
        ))}
      </div>
    </div>
  );
};

interface CourseCardProps {
  enrollment: IUserEnrollment;
  userId: string;
}

/**
 * Card component for individual enrolled course
 */
const CourseCard: React.FC<CourseCardProps> = ({ enrollment, userId }) => {
  const { course, enrolledAt } = enrollment;
  
  // Get course progress
  const { data: progress } = useQuery({
    queryKey: ['courseProgress', userId, course.id],
    queryFn: () => progressService.getUserCourseProgress(userId, course.id),
    enabled: !!userId,
  });
  
  // Calculate completion percentage based on status
  const completionPercentage = progress?.completionStatus === 'completed' 
    ? 100 
    : Math.floor(Math.random() * 100); // Fallback for demo; replace with actual data when available
  
  // Format enrollment date
  const enrollmentDate = new Date(enrolledAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <Card hoverable className="flex flex-col h-full">
      <Link to={`/courses/${course.id}`} className="block h-full">
        {/* Thumbnail placeholder - replace with actual images when available */}
        <div className="h-40 bg-secondary-100 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-200">
            <span className="text-neutral-600">Course Image</span>
          </div>
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-medium text-lg text-neutral-900 mb-1">{course.title}</h3>
          <p className="text-neutral-600 text-sm mb-3 line-clamp-2">{course.description}</p>
          
          <div className="mt-auto">
            <ProgressBar 
              value={completionPercentage} 
              label="Progress"
              showPercentage
            />
            <p className="text-xs text-neutral-500 mt-2">Enrolled on {enrollmentDate}</p>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default EnrolledCoursesWidget;