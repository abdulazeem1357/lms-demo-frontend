import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageTransition } from '../../components/common/PageTransition';
import { Card } from '../../components/common/Card';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { useAuth } from '../../contexts/AuthContext';
import { getUserOverallProgress } from '../../services/progress';
import EnrolledCoursesWidget from '../../components/features/Dashboard/EnrolledCoursesWidget';
import UpcomingDeadlinesWidget from '../../components/features/Dashboard/UpcomingDeadlinesWidget';
import RecentActivityWidget from '../../components/features/Dashboard/RecentActivityWidget';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import styles from './DashboardPage.module.css';

/**
 * Student Dashboard Page displaying various widgets with course information,
 * progress metrics, upcoming deadlines, and notifications
 */
const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Fetch overall progress data
  const { 
    data: progressData,
    isLoading: isProgressLoading,
  } = useQuery({
    queryKey: ['userProgress', user?.id],
    queryFn: () => getUserOverallProgress(user?.id || ''),
    enabled: !!user?.id
  });

  // Progress summary widget with loading state
  const renderProgressSummary = () => {
    if (isProgressLoading) {
      return (
        <Card>
          <div className="flex items-center mb-4">
            <ChartBarIcon className="w-5 h-5 mr-2 text-primary-600" />
            <h2 className="text-lg font-semibold">Progress Summary</h2>
          </div>
          <div className="space-y-4">
            <SkeletonLoader count={3} />
            <div className="pt-2">
              <SkeletonLoader height={8} />
            </div>
          </div>
        </Card>
      );
    }

    if (!progressData) return null;

    return (
      <Card>
        <div className="flex items-center mb-4">
          <ChartBarIcon className="w-5 h-5 mr-2 text-primary-600" />
          <h2 className="text-lg font-semibold">Progress Summary</h2>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Courses Completed</span>
            <span className="font-medium">{progressData.coursesCompleted} of {progressData.coursesEnrolled}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Overall Completion</span>
            <span className="font-medium">{progressData.overallCompletionRate}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Average Score</span>
            <span className="font-medium">{progressData.averageScore}%</span>
          </div>
          <div className="pt-2">
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className={`h-2 bg-primary-500 rounded-full ${styles.progressBar}`} 
                style={{ width: `${progressData.overallCompletionRate}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <PageTransition>
      <div className={`px-4 py-6 md:px-6 lg:px-8 ${styles.dashboardContainer}`}>
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}! Here's an overview of your learning journey.
          </p>
        </header>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Enrolled Courses Widget */}
          <div className="lg:col-span-2">
            <EnrolledCoursesWidget />
          </div>

          {/* Progress Summary Widget */}
          <div>
            {renderProgressSummary()}
          </div>

          {/* Upcoming Deadlines Widget */}
          <div>
            <UpcomingDeadlinesWidget />
          </div>

          {/* Recent Activity Widget */}
          <div className="lg:col-span-2">
            <RecentActivityWidget />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default DashboardPage;