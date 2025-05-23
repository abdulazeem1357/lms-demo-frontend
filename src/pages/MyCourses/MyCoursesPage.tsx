import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MagnifyingGlassIcon, ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

// Services
import { getUserEnrollments } from '../../services/enrollment';
import { useCourseProgress } from '../../hooks/useCourseProgress';

// Components
import { Card } from '../../components/common/Card';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Spinner } from '../../components/common/Spinner';
import { StateDisplay } from '../../components/common/StateDisplay';

// Contexts
import { useAuth } from '../../contexts/AuthContext';

// Types
import { IUserEnrollment } from '../../types/enrollment.types';

const SORT_OPTIONS = [
  { value: 'title', label: 'Course Title' },
  { value: 'enrolledAt', label: 'Enrollment Date' }
];

/**
 * My Courses page displays all courses a student is enrolled in
 * with filtering, sorting, and progress tracking
 */
const MyCoursesPage: React.FC = () => {
  const { user } = useAuth();
  
  // State for filtering and sorting
  const [sortBy, setSortBy] = useState<string>('title');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // UI state
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState<boolean>(false);
  
  // Refs for dropdown closing on outside click
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  
  // Fetch enrolled courses
  const {
    data: enrollments,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['userEnrollments', user?.id],
    queryFn: () => user?.id ? getUserEnrollments(user.id) : Promise.resolve([]),
    enabled: !!user?.id,
  });
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    if (!enrollments) return [];
    // Apply search filter
    const filtered = searchQuery
      ? enrollments.filter(e =>
          e.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.course.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [...enrollments];
    // Sort
    return filtered.sort((a, b) => {
      if (sortBy === 'title') {
        return a.course.title.localeCompare(b.course.title);
      }
      // enrolledAt
      return new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime();
    });
  }, [enrollments, searchQuery, sortBy]);

  // Get current sort option label
  const currentSortLabel = SORT_OPTIONS.find(option => option.value === sortBy)?.label || 'Course Title';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-neutral-900">My Courses</h1>
          <p className="text-neutral-600 mt-2">
            View and manage all your enrolled courses
          </p>
        </div>
        
        {!isLoading && !isError && filteredCourses.length > 0 && (
          <p className="text-neutral-700 mt-2 md:mt-0">
            Showing <span className="font-medium">{filteredCourses.length}</span> {filteredCourses.length === 1 ? 'course' : 'courses'}
          </p>
        )}
      </div>
      
      {/* Enhanced Search and Filters Bar */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row items-center p-4">
          {/* Search input with icon */}
          <div className="relative w-full md:w-1/2 lg:w-2/3 mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Search by title or description..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md bg-neutral-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row w-full md:w-1/2 lg:w-1/3 space-y-3 sm:space-y-0 sm:space-x-3 md:justify-end">
            {/* Sort Dropdown */}
            <div className="relative" ref={sortDropdownRef}>
              <button 
                className="w-full sm:w-auto flex items-center justify-between px-4 py-2 border border-neutral-300 rounded-md bg-white"
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              >
                <span className="flex items-center text-sm">
                  <span className="text-neutral-500 mr-2">Sort By:</span>
                  <span className="font-medium text-neutral-800">{currentSortLabel}</span>
                </span>
                <ChevronDownIcon className="h-5 w-5" />
              </button>
              
              {isSortDropdownOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-white rounded-md border border-neutral-200 shadow-lg z-10">
                  <ul className="py-1">
                    {SORT_OPTIONS.map((option) => (
                      <li key={option.value}>
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 flex items-center justify-between"
                          onClick={() => {
                            setSortBy(option.value);
                            setIsSortDropdownOpen(false);
                          }}
                        >
                          <span className={sortBy === option.value ? 'font-medium text-primary-600' : 'text-neutral-700'}>
                            {option.label}
                          </span>
                          {sortBy === option.value && (
                            <span className="text-primary-600">
                              <CheckIcon className="h-5 w-5" />
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Active filters display */}
        {searchQuery && (
          <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-200 rounded-b-lg flex flex-wrap items-center">
            <span className="text-sm text-neutral-600 mr-2">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center m-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                "{searchQuery}"
                <button 
                  className="ml-2 text-blue-800 hover:text-blue-900"
                  onClick={() => setSearchQuery('')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 101.414 1.414L10 11.414l1.293 1.293a1 1 001.414-1.414L11.414 10l1.293-1.293a1 1 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            )}
            {searchQuery && (
              <button 
                className="ml-auto text-sm text-primary-600 hover:text-primary-700 font-medium focus:outline-none"
                onClick={() => {
                  setSearchQuery('');
                }}
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <Spinner size="lg" label="Loading your courses..." />
        </div>
      )}
      
      {/* Error state */}
      {isError && (
        <div className="bg-white rounded-lg shadow p-6">
          <StateDisplay
            type="error"
            title="Failed to load courses"
            message={error instanceof Error ? error.message : "An error occurred while fetching your courses"}
            actionButton={
              <button 
                className="mt-4 px-6 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
                onClick={() => refetch()}
              >
                Try Again
              </button>
            }
          />
        </div>
      )}
      
      {/* Empty state */}
      {!isLoading && !isError && filteredCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          {searchQuery ? (
            <StateDisplay
              type="empty"
              title="No matching courses found"
              message="Try adjusting your search or filters to find your courses"
              actionButton={
                <button 
                  className="mt-4 px-6 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
                  onClick={() => {
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </button>
              }
            />
          ) : (
            <StateDisplay
              type="empty"
              title="No courses yet"
              message="You haven't enrolled in any courses yet"
              actionButton={
                <Link 
                  to="/courses" 
                  className="mt-4 px-6 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
                >
                  Browse Courses
                </Link>
              }
            />
          )}
        </div>
      )}
      
      {/* Course grid - no change needed here */}
      {!isLoading && !isError && filteredCourses.length > 0 && (          
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((enrollment) => (
            <CourseCard 
              key={enrollment.enrollmentId}
              enrollment={enrollment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CourseCardProps {
  enrollment: IUserEnrollment;
}

// Component for individual course card, using useCourseProgress hook
const CourseCard: React.FC<CourseCardProps> = ({ enrollment }) => {
  const { course, enrolledAt } = enrollment;
  const { user } = useAuth();

  // Use custom hook for progress
  const { completionPercentage, isLoading } = useCourseProgress(user?.id || '', course.id);
  const enrollmentDate = format(new Date(enrolledAt), 'MMM d, yyyy');

  return (
    <Card hoverable className="flex flex-col h-full overflow-hidden">
      <Link to={`/courses/${course.id}`} className="block h-full">
        {/* Course thumbnail */}
        <div className="h-40 bg-neutral-200 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-neutral-600">Course Image</span>
          </div>
        </div>
        
        {/* Course details */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-medium text-lg text-neutral-900 mb-1">{course.title}</h3>
          <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{course.description}</p>
          
          <div className="mt-auto">
            {isLoading ? (
              <div className="h-4 bg-neutral-200 rounded animate-pulse mb-2 w-full"></div>
            ) : (
              <ProgressBar
                value={completionPercentage}
                label="Your Progress"
                showPercentage
                height="md"
                color={completionPercentage === 100 ? 'success' : 'primary'}
                className="mb-2"
              />
            )}
            <p className="text-xs text-neutral-500 mt-3">Enrolled on {enrollmentDate}</p>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default MyCoursesPage;