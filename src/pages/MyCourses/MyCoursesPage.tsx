import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

// Services
import { getUserEnrollments } from '../../services/enrollment';
import { getUserCourseProgress } from '../../services/progress';

// Components
import { Card } from '../../components/common/Card';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Spinner } from '../../components/common/Spinner';
import { StateDisplay } from '../../components/common/StateDisplay';

// Contexts
import { useAuth } from '../../contexts/AuthContext';

// Types
import { IUserEnrollment } from '../../types/enrollment.types';

// Icons - Import these from your icon library (e.g., heroicons)
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

const FilterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const SORT_OPTIONS = [
  { value: 'title', label: 'Course Title' },
  { value: 'enrolledAt', label: 'Enrollment Date' },
  { value: 'progress', label: 'Progress' }
];

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Courses' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
];

/**
 * My Courses page displays all courses a student is enrolled in
 * with filtering, sorting, and progress tracking
 */
const MyCoursesPage: React.FC = () => {
  const { user } = useAuth();
  
  // State for filtering and sorting
  const [sortBy, setSortBy] = useState<string>('title');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // UI state
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState<boolean>(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  
  // Refs for dropdown closing on outside click
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  
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

  // Get course progress for all enrollments
  const { data: progressData } = useQuery({
    queryKey: ['allCourseProgress', user?.id, enrollments],
    queryFn: async () => {
      if (!user?.id || !enrollments?.length) return {};
      
      // Create a map to store progress for each course
      const progressMap: Record<string, { completionStatus: 'in_progress' | 'completed', percentage: number }> = {};
      
      // Fetch progress for each enrolled course
      await Promise.all(
        enrollments.map(async (enrollment) => {
          try {
            const progress = await getUserCourseProgress(user.id, enrollment.course.id);
            
            // Calculate percentage based on completion status
            const percentage = progress.completionStatus === 'completed' 
              ? 100 
              : calculateProgress(progress.quizzes, progress.assignments);
              
            progressMap[enrollment.course.id] = {
              completionStatus: progress.completionStatus,
              percentage
            };
          } catch (err) {
            console.error(`Error fetching progress for course ${enrollment.course.id}:`, err);
          }
        })
      );
      
      return progressMap;
    },
    enabled: !!user?.id && !!enrollments?.length,
  });
  
  // Helper function to calculate progress percentage
  const calculateProgress = (quizzes: any[], assignments: any[]): number => {
    const total = quizzes.length + assignments.length;
    if (total === 0) return 0;
    
    const completed = 
      quizzes.filter(q => q.status === 'graded').length + 
      assignments.filter(a => a.status === 'graded').length;
    
    return Math.round((completed / total) * 100);
  };
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
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
    let filtered = searchQuery 
      ? enrollments.filter(e => 
          e.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.course.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [...enrollments];
    
    // Apply status filter
    if (filterStatus !== 'all' && progressData) {
      filtered = filtered.filter(e => {
        const courseProgress = progressData[e.course.id];
        return courseProgress?.completionStatus === filterStatus;
      });
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'title') {
        return a.course.title.localeCompare(b.course.title);
      } else if (sortBy === 'enrolledAt') {
        return new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime();
      } else if (sortBy === 'progress' && progressData) {
        const progressA = progressData[a.course.id]?.percentage || 0;
        const progressB = progressData[b.course.id]?.percentage || 0;
        return progressB - progressA;
      }
      return 0;
    });
  }, [enrollments, searchQuery, sortBy, filterStatus, progressData]);

  // Get current sort option label
  const currentSortLabel = SORT_OPTIONS.find(option => option.value === sortBy)?.label || 'Course Title';
  
  // Get current filter option label
  const currentFilterLabel = FILTER_OPTIONS.find(option => option.value === filterStatus)?.label || 'All Courses';

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
              <SearchIcon />
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
                <ChevronDownIcon />
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
                              <CheckIcon />
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Filter Dropdown */}
            <div className="relative" ref={filterDropdownRef}>
              <button 
                className={`w-full sm:w-auto flex items-center justify-between px-4 py-2 border border-neutral-300 rounded-md bg-white ${filterStatus !== 'all' ? 'bg-blue-100' : ''}`}
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              >
                <span className="flex items-center text-sm">
                  <FilterIcon className="mr-2 text-neutral-500" />
                  <span className="font-medium text-neutral-800">{currentFilterLabel}</span>
                </span>
                <ChevronDownIcon />
              </button>
              
              {isFilterDropdownOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-white rounded-md border border-neutral-200 shadow-lg z-10">
                  <ul className="py-1">
                    {FILTER_OPTIONS.map((option) => (
                      <li key={option.value}>
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 flex items-center justify-between"
                          onClick={() => {
                            setFilterStatus(option.value);
                            setIsFilterDropdownOpen(false);
                          }}
                        >
                          <span className={filterStatus === option.value ? 'font-medium text-primary-600' : 'text-neutral-700'}>
                            {option.label}
                          </span>
                          {filterStatus === option.value && (
                            <span className="text-primary-600">
                              <CheckIcon />
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
        {(searchQuery || filterStatus !== 'all') && (
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
            {filterStatus !== 'all' && (
              <span className="inline-flex items-center m-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {filterStatus === 'completed' ? 'Completed' : 'In Progress'}
                <button 
                  className="ml-2 text-blue-800 hover:text-blue-900"
                  onClick={() => setFilterStatus('all')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 101.414 1.414L10 11.414l1.293 1.293a1 1 001.414-1.414L11.414 10l1.293-1.293a1 1 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            )}
            {(searchQuery || filterStatus !== 'all') && (
              <button 
                className="ml-auto text-sm text-primary-600 hover:text-primary-700 font-medium focus:outline-none"
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
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
          {searchQuery || filterStatus !== 'all' ? (
            <StateDisplay
              type="empty"
              title="No matching courses found"
              message="Try adjusting your search or filters to find your courses"
              actionButton={
                <button 
                  className="mt-4 px-6 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('all');
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

// Move progress fetching logic into CourseCard for reliability and consistency
const CourseCard: React.FC<CourseCardProps> = ({ enrollment }) => {
  const { course, enrolledAt } = enrollment;
  const { user } = useAuth();

  // Fetch progress for this course and user
  const { data: progress } = useQuery({
    queryKey: ['courseProgress', user?.id, course.id],
    queryFn: () => user?.id ? getUserCourseProgress(user.id, course.id) : Promise.resolve(undefined),
    enabled: !!user?.id,
  });

  const enrollmentDate = format(new Date(enrolledAt), 'MMM d, yyyy');
  // Calculate completion percentage based on status
  const completionPercentage = progress?.completionStatus === 'completed' 
    ? 100 
    : Math.floor(Math.random() * 100); // Fallback for demo; replace with actual data when available
  const statusLabel = progress?.completionStatus === 'completed' ? 'Completed' : 'In Progress';
  const statusClass = progress?.completionStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';

  return (
    <Card hoverable className="flex flex-col h-full overflow-hidden">
      <Link to={`/courses/${course.id}`} className="block h-full">
        {/* Course thumbnail */}
        <div className="h-40 bg-neutral-200 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-neutral-600">Course Image</span>
          </div>
        </div>
        
        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>{statusLabel}</span>
        </div>
        
        {/* Course details */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-medium text-lg text-neutral-900 mb-1">{course.title}</h3>
          <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{course.description}</p>
          
          <div className="mt-auto">
            <ProgressBar
              value={completionPercentage}
              label="Your Progress"
              showPercentage
              height="md"
              color={progress?.completionStatus === 'completed' ? 'success' : 'primary'}
              className="mb-2"
            />
            <p className="text-xs text-neutral-500 mt-3">Enrolled on {enrollmentDate}</p>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default MyCoursesPage;