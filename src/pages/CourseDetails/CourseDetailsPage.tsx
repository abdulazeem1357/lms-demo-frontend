import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

// Components
import { Card } from '../../components/common/Card';
import { StateDisplay } from '../../components/common/StateDisplay';
import { Spinner } from '../../components/common/Spinner';
import { PageTransition } from '../../components/common/PageTransition';

// Services
import { getCourseById, getCourseModules, getCourseMaterials } from '../../services/course';
import { getCourseLiveLectures, getModuleLectures } from '../../services/lecture';
import { getUserEnrollments, enrollUserInCourse } from '../../services/enrollment';
// Use mock quizzes for local development and UI testing
import { getModuleQuizzes } from '../../services/assessment.mock.service';
import { getModuleAssignments } from '../../services/assessment';

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
  PlayCircleIcon,
  AcademicCapIcon,
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
  const [moduleLectures, setModuleLectures] = React.useState<Record<string, any[]>>({});
  
  // Handle module expansion toggle with lecture fetching
  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const isExpanding = !prev[moduleId];
      
      // If we're expanding and don't have lectures yet, fetch them
      if (isExpanding && !moduleLectures[moduleId]) {
        getModuleLectures(moduleId)
          .then(lectures => {
            setModuleLectures(prev => ({
              ...prev,
              [moduleId]: lectures
            }));
          })
          .catch(error => {
            console.error(`Failed to fetch lectures for module ${moduleId}:`, error);
          });
      }
      
      return {
        ...prev,
        [moduleId]: isExpanding
      };
    });
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

  // Fetch quizzes for each module using useQueries (ensures queries are triggered)
  const quizzesQueries = useQueries({
    queries: (modules || []).map((module) => ({
      queryKey: ['moduleQuizzes', module.id],
      queryFn: () => getModuleQuizzes(module.id),
      enabled: !!module.id,
    })),
  });

  // Fetch assignments for each module using useQueries
  const assignmentsQueries = useQueries({
    queries: (modules || []).map((module) => ({
      queryKey: ['moduleAssignments', module.id],
      queryFn: () => getModuleAssignments(module.id),
      enabled: !!module.id,
    })),
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
                          
                          {expandedModules[module.id] && (
                            <div className="pl-8 pr-4 pb-3 border-t border-neutral-100">
                              {/* Show module lectures */}
                              {moduleLectures[module.id] ? (
                                <ul className="divide-y divide-neutral-50">
                                  {moduleLectures[module.id].map((lecture) => (
                                    <li key={lecture.id} className="py-3">
                                      <Link 
                                        to={`/lecture/${lecture.id}`}
                                        className="flex items-center text-neutral-700 hover:text-primary-600 group"
                                      >
                                        <PlayCircleIcon className="w-5 h-5 mr-2 text-neutral-400 group-hover:text-primary-500" />
                                        <span>{lecture.title}</span>
                                        <span className="ml-auto text-xs text-neutral-500">
                                          {Math.floor(lecture.duration / 60)}:{String(lecture.duration % 60).padStart(2, '0')} min
                                        </span>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                // Show chapters if lectures aren't available yet
                                <ul className="divide-y divide-neutral-50">
                                  {module.chapters?.map((chapter) => (
                                    <li key={chapter.id} className="py-3">
                                      <Link 
                                        to={`/lecture/${chapter.id}`}
                                        className="flex items-center text-neutral-700 hover:text-primary-600 group"
                                      >
                                        <AcademicCapIcon className="w-5 h-5 mr-2 text-neutral-400 group-hover:text-primary-500" />
                                        <span>{chapter.title}</span>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                              
                              {expandedModules[module.id] && !moduleLectures[module.id] && (
                                <div className="py-2 flex justify-center">
                                  <Spinner size="sm" label="Loading lectures..." />
                                </div>
                              )}
                            </div>
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
              {/* Quizzes card (moved below Course Structure) */}
              <Card className="mb-6">
                <div className="p-6 border-b border-neutral-200">
                  <h2 className="text-xl font-heading font-semibold text-neutral-800 flex items-center">
                    <AcademicCapIcon className="w-5 h-5 mr-2 text-primary-500" />
                    Quizzes
                  </h2>
                </div>
                <div className="p-4">
                  {modules && modules.length > 0 ? (
                    modules.map((module, idx) => {
                      const quizzesData = quizzesQueries[idx]?.data;
                      const isLoading = quizzesQueries[idx]?.isLoading;
                      return (
                        <div key={module.id} className="mb-4">
                          <h3 className="font-medium text-neutral-700 mb-2 text-sm">
                            {module.title}
                          </h3>
                          {isLoading ? (
                            <div className="py-2 flex justify-center">
                              <Spinner size="sm" label="Loading quizzes..." />
                            </div>
                          ) : quizzesData && quizzesData.length > 0 ? (
                            <ul className="space-y-3">
                              {quizzesData.map((quiz: any) => (
                                <li key={quiz.id} className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 flex flex-col gap-2">
                                  <div>
                                    <span className="font-semibold text-neutral-900">{quiz.title}</span>
                                    {quiz.description && (
                                      <p className="text-neutral-600 text-xs mt-1">{quiz.description}</p>
                                    )}
                                  </div>
                                  <Link
                                    to={`/quiz/${quiz.id}`}
                                    className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm font-medium w-max"
                                  >
                                    Take Quiz
                                    <ChevronRightIcon className="w-4 h-4 ml-2" />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-neutral-400 text-xs italic">No quizzes for this module.</div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-neutral-500 py-4">
                      No quizzes available for this course yet.
                    </div>
                  )}
                </div>
              </Card>

              {/* Assignments card (below Quizzes) */}
              <Card className="mb-6">
                <div className="p-6 border-b border-neutral-200">
                  <h2 className="text-xl font-heading font-semibold text-neutral-800 flex items-center">
                    <DocumentTextIcon className="w-5 h-5 mr-2 text-primary-500" />
                    Assignments
                  </h2>
                </div>
                <div className="p-4">
                  {modules && modules.length > 0 ? (
                    modules.map((module, idx) => {
                      const assignmentsData = assignmentsQueries[idx]?.data;
                      const isLoading = assignmentsQueries[idx]?.isLoading;
                      return (
                        <div key={module.id} className="mb-4">
                          <h3 className="font-medium text-neutral-700 mb-2 text-sm">
                            {module.title}
                          </h3>
                          {isLoading ? (
                            <div className="py-2 flex justify-center">
                              <Spinner size="sm" label="Loading assignments..." />
                            </div>
                          ) : assignmentsData && assignmentsData.length > 0 ? (
                            <ul className="space-y-3">
                              {assignmentsData.map((assignment: any) => (
                                <li key={assignment.id} className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 flex flex-col gap-2">
                                  <div>
                                    <span className="font-semibold text-neutral-900">{assignment.title}</span>
                                    {assignment.description && (
                                      <p className="text-neutral-600 text-xs mt-1 line-clamp-2">{assignment.description}</p>
                                    )}
                                  </div>
                                  <Link
                                    to={`/assignment/${assignment.id}`}
                                    className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm font-medium w-max"
                                  >
                                    View / Submit Assignment
                                    <ChevronRightIcon className="w-4 h-4 ml-2" />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-neutral-400 text-xs italic">No assignments for this module.</div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-neutral-500 py-4">
                      No assignments available for this course yet.
                    </div>
                  )}
                </div>
              </Card>
            </div>
            {/* Sidebar column for live lectures and materials */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {/* Live lectures card */}
              <Card className="mb-6">
                <div className="p-6 border-b border-neutral-200">
                  <h2 className="text-lg font-heading font-semibold text-neutral-800 flex items-center">
                    <VideoCameraIcon className="w-5 h-5 mr-2 text-primary-500" />
                    Live Lectures
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