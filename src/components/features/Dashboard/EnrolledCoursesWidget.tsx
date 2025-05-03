import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpenIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { StateDisplay } from '../../../components/common/StateDisplay';
import { Spinner } from '../../../components/common/Spinner';
import { getUserEnrollments } from '../../../services/enrollment.service';
import { IUserEnrollment } from '../../../types/enrollment.types';

/**
 * Widget displaying a list of courses the student is currently enrolled in
 * with progress indicators and quick navigation options.
 */
const EnrolledCoursesWidget: React.FC = () => {
  // In a real implementation, this would come from context or a hook
  const userId = 'current-user-id'; // Placeholder - should come from auth context
  
  // Fetch enrolled courses using React Query
  const { 
    data: enrollments,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<IUserEnrollment[], Error>({
    queryKey: ['enrollments', userId],
    queryFn: () => getUserEnrollments(userId),
  });
  
  // Calculate the number of active courses
  const activeCourseCount = enrollments?.length || 0;

  // Render loading state
  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <BookOpenIcon className="w-5 h-5 mr-2 text-primary-600" />
            Enrolled Courses
          </h2>
        </div>
        <div className="flex justify-center items-center h-48">
          <Spinner size={36} />
        </div>
      </Card>
    );
  }
  
  // Render error state
  if (isError) {
    return (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <BookOpenIcon className="w-5 h-5 mr-2 text-primary-600" />
            Enrolled Courses
          </h2>
        </div>
        <StateDisplay 
          variant="error"
          title="Failed to load enrolled courses"
          message={`${error?.message || 'An error occurred while fetching your courses'}`}
          action={{ 
            text: "Try Again", 
            onClick: () => refetch() 
          }}
          size="compact"
        />
      </Card>
    );
  }
  
  // Render empty state
  if (!enrollments?.length) {
    return (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <BookOpenIcon className="w-5 h-5 mr-2 text-primary-600" />
            Enrolled Courses
          </h2>
        </div>
        <StateDisplay
          title="No courses enrolled"
          message="Browse our course catalog and enroll in courses to begin your learning journey."
          action={{
            text: "Browse Courses",
            onClick: () => {
              // Navigate to course catalog
              window.location.href = '/courses';
            }
          }}
          size="compact"
        />
      </Card>
    );
  }
  
  // Render courses list
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <BookOpenIcon className="w-5 h-5 mr-2 text-primary-600" />
          Enrolled Courses
        </h2>
        <Badge variant="primary" size="sm">{activeCourseCount} Active</Badge>
      </div>
      <div className="space-y-4">
        {/* List of enrolled courses */}
        {enrollments.map((enrollment) => {
          // Mock progress value - in a real app this would come from a progress service
          const courseProgress = Math.floor(Math.random() * 100); // Replace with actual progress data
          
          return (
            <div 
              key={enrollment.enrollmentId} 
              className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              onClick={() => window.location.href = `/courses/${enrollment.course.id}`}
            >
              <div className="flex items-center">
                <div className="bg-primary-100 rounded-md p-2 mr-3">
                  <AcademicCapIcon className="w-5 h-5 text-primary-700" />
                </div>
                <div>
                  <h3 className="font-medium">{enrollment.course.title}</h3>
                  <p className="text-sm text-gray-500">
                    {enrollment.course.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{courseProgress}% Complete</div>
                <div className="w-24 h-2 bg-neutral-200 rounded-full mt-1">
                  <div 
                    className="h-2 bg-primary-500 rounded-full" 
                    style={{ width: `${courseProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* View all button */}
        <button 
          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
          onClick={() => window.location.href = '/courses/my-courses'}
        >
          View all courses
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </Card>
  );
};

export default EnrolledCoursesWidget;