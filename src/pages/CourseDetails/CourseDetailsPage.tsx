import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

// Components
import { Card } from '../../components/common/Card';
import { StateDisplay } from '../../components/common/StateDisplay';
import { Spinner } from '../../components/common/Spinner';
import { PageTransition } from '../../components/common/PageTransition';

// Services
import { getCourseById, getCourseModules, getCourseMaterials } from '../../services/course';
import { getCourseLiveLectures } from '../../services/lecture';
import { getUserEnrollments, enrollUserInCourse } from '../../services/enrollment';

// Context
import { useAuth } from '../../contexts/AuthContext';

// Icons
import {
  DocumentTextIcon,
  LinkIcon,
  VideoCameraIcon,
  CalendarIcon,
  ClockIcon,
  CheckBadgeIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

/**
 * CourseDetailsPage displays comprehensive information about a specific course
 * including structure, materials, and live lectures
 */
const CourseDetailsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [expandedModules, setExpandedModules] = React.useState<Record<string, boolean>>({});
  
  // Handle module expansion toggle
  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Fetch course details
  const { 
    data: course, 
    isLoading: isLoadingCourse, 
    isError: isErrorCourse,
    error: courseError 
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourseById(courseId as string),
    enabled: !!courseId,
  });

  // Fetch course structure (modules and chapters)
  const {
    data: modules,
    isLoading: isLoadingModules,
    isError: isErrorModules,
    error: modulesError
  } = useQuery({
    queryKey: ['courseModules', courseId],
    queryFn: () => getCourseModules(courseId as string),
    enabled: !!courseId,
  });

  // Fetch course materials
  const {
    data: materials,
    isLoading: isLoadingMaterials,
    isError: isErrorMaterials,
    error: materialsError
  } = useQuery({
    queryKey: ['courseMaterials', courseId],
    queryFn: () => getCourseMaterials(courseId as string),
    enabled: !!courseId,
  });

  // Fetch live lectures
  const {
    data: liveLectures,
    isLoading: isLoadingLectures,
    isError: isErrorLectures,
    error: lecturesError
  } = useQuery({
    queryKey: ['courseLiveLectures', courseId],
    queryFn: () => getCourseLiveLectures(courseId as string),
    enabled: !!courseId,
  });

  // Fetch user enrollments to check if enrolled
  const {
    data: enrollments,
    isLoading: isLoadingEnrollments,
    isError: isErrorEnrollments,
  } = useQuery({
    queryKey: ['userEnrollments', user?.id],
    queryFn: () => getUserEnrollments(user?.id as string),
    enabled: !!user?.id,
  });

  // Check if user is enrolled in this course
  const isEnrolled = React.useMemo(() => {
    if (!enrollments || !courseId) return false;
    return enrollments.some(enrollment => enrollment.course.id === courseId);
  }, [enrollments, courseId]);

  // Enrollment mutation
  const { mutate: enroll, isPending: isEnrolling } = useMutation({
    mutationFn: () => enrollUserInCourse(user?.id as string, courseId as string),
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['userEnrollments', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses', user?.id] });
    },
  });

  // Handle enrollment button click
  const handleEnroll = () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = `/login?redirect=/courses/${courseId}`;
      return;
    }
    
    enroll();
  };

  // Combined loading state
  const isLoading = isLoadingCourse || isLoadingModules || isLoadingMaterials || isLoadingLectures || isLoadingEnrollments;

  // Combined error state
  const isError = isErrorCourse || isErrorModules || isErrorMaterials || isErrorLectures || isErrorEnrollments;
  const error = courseError || modulesError || materialsError || lecturesError;

  // If loading, show spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen p-8">
        <Spinner size="lg" label="Loading course details..." />
      </div>
    );
  }

  // If error, show error state
  if (isError) {
    return (
      <div className="p-8">
        <StateDisplay 
          type="error"
          title="Failed to load course details"
          message={error instanceof Error ? error.message : 'An error occurred while fetching course data'}
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

  // If course not found
  if (!course) {
    return (
      <div className="p-8">
        <StateDisplay 
          type="error"
          title="Course not found"
          message="The requested course does not exist or has been removed"
          actionButton={
            <Link 
              to="/courses"
              className="mt-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors inline-block"
            >
              Browse Courses
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="container mx-auto px-4">
          {/* Course header */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-3">
              {course.title}
            </h1>
            
            <div className="flex flex-wrap items-center text-sm text-neutral-500 gap-4 mb-4">
              <span className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" />
                {format(new Date(course.createdAt), 'MMM dd, yyyy')}
              </span>
              
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-primary-100 text-primary-800">
                {course.category}
              </span>
              
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-secondary-100 text-secondary-800">
                {course.difficulty}
              </span>
            </div>
          </div>
          
          {/* Main content - Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content column */}
            <div className="lg:col-span-2">
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-heading font-semibold mb-4 text-neutral-800">Course Overview</h2>
                <p className="text-neutral-700">{course.description}</p>
                
                {/* Enrollment button - conditionally rendered based on enrollment status */}
                <div className="mt-6">
                  {isEnrolled ? (
                    <Link 
                      to={`/courses/${courseId}/lectures`}
                      className="inline-flex items-center justify-center px-6 py-3 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 transition-colors"
                    >
                      Go to Course Content
                      <ChevronRightIcon className="w-5 h-5 ml-2" />
                    </Link>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={isEnrolling}
                      className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:bg-primary-300"
                    >
                      {isEnrolling ? (
                        <>
                          <Spinner size="sm" color="white" className="mr-2" />
                          Enrolling...
                        </>
                      ) : (
                        <>
                          Enroll Now
                          <CheckBadgeIcon className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </Card>
              
              {/* Course structure */}
              <Card className="mb-6 overflow-visible">
                <div className="p-6 border-b border-neutral-200">
                  <h2 className="text-xl font-heading font-semibold text-neutral-800">
                    Course Structure
                  </h2>
                </div>
                
                <div className="p-2">
                  {modules && modules.length > 0 ? (
                    <ul>
                      {modules.map((module) => (
                        <li key={module.id} className="border-b border-neutral-100 last:border-b-0">
                          <button 
                            className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
                            onClick={() => toggleModule(module.id)}
                          >
                            <span className="font-medium text-neutral-800">
                              {module.title}
                            </span>
                            <ChevronDownIcon 
                              className={`w-5 h-5 text-neutral-500 transition-transform ${
                                expandedModules[module.id] ? 'transform rotate-180' : ''
                              }`} 
                            />
                          </button>
                          
                          {expandedModules[module.id] && module.chapters && (
                            <ul className="pl-8 pr-4 pb-3 border-t border-neutral-100">
                              {module.chapters.map((chapter) => (
                                <li key={chapter.id} className="py-2 border-b border-neutral-50 last:border-b-0">
                                  <div className="text-neutral-700">
                                    {chapter.title}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-neutral-500">
                      No modules available for this course yet.
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar column */}
            <div className="space-y-6">
              {/* Live lectures card */}
              <Card>
                <div className="p-6 border-b border-neutral-200">
                  <h2 className="text-lg font-heading font-semibold text-neutral-800 flex items-center">
                    <VideoCameraIcon className="w-5 h-5 mr-2 text-primary-500" />
                    Upcoming Live Lectures
                  </h2>
                </div>
                
                <div className="p-4">
                  {liveLectures && liveLectures.length > 0 ? (
                    <ul className="divide-y divide-neutral-100">
                      {liveLectures.map((lecture) => (
                        <li key={lecture.id} className="py-3">
                          <h3 className="font-medium text-neutral-800 mb-1">
                            {lecture.topic}
                          </h3>
                          <div className="flex items-center text-sm text-neutral-600 mb-2">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            <span>{format(new Date(lecture.startTime), 'MMM dd, yyyy')}</span>
                            <span className="mx-2">•</span>
                            <ClockIcon className="w-4 h-4 mr-1" />
                            <span>{format(new Date(lecture.startTime), 'h:mm a')}</span>
                          </div>
                          <a 
                            href={lecture.meetingUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                          >
                            Join lecture
                            <ChevronRightIcon className="w-4 h-4 ml-1" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center text-neutral-500 py-4">
                      No upcoming live lectures scheduled.
                    </div>
                  )}
                </div>
              </Card>
              
              {/* Course materials card */}
              <Card>
                <div className="p-6 border-b border-neutral-200">
                  <h2 className="text-lg font-heading font-semibold text-neutral-800 flex items-center">
                    <DocumentTextIcon className="w-5 h-5 mr-2 text-primary-500" />
                    Course Materials
                  </h2>
                </div>
                
                <div className="p-4">
                  {materials && materials.length > 0 ? (
                    <ul className="divide-y divide-neutral-100">
                      {materials.map((material) => (
                        <li key={material.id} className="py-3">
                          <a 
                            href={material.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-start hover:bg-neutral-50 p-2 rounded-md transition-colors"
                          >
                            <span className="mr-3 mt-1">
                              {material.type === 'file' ? (
                                <DocumentTextIcon className="w-5 h-5 text-neutral-500" />
                              ) : (
                                <LinkIcon className="w-5 h-5 text-neutral-500" />
                              )}
                            </span>
                            <div>
                              <h3 className="font-medium text-neutral-800 mb-1">
                                {material.title}
                              </h3>
                              {material.description && (
                                <p className="text-sm text-neutral-600">
                                  {material.description}
                                </p>
                              )}
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center text-neutral-500 py-4">
                      No supplementary materials available.
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CourseDetailsPage;