import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../../common/Card';
import { Spinner } from '../../common/Spinner';
import { StateDisplay } from '../../common/StateDisplay';
import { useAuth } from '../../../contexts/AuthContext';

// Activity item type definition
export interface IActivityItem {
  id: string;
  type: 'quiz_completed' | 'assignment_submitted' | 'lecture_watched';
  title: string;
  relatedCourse: string;
  detail?: string;
  timestamp: string;
}

/**
 * Widget displaying a chronological list of user activities like completed quizzes,
 * submitted assignments, and watched lectures.
 */
const RecentActivityWidget: React.FC = () => {
  // In a real implementation, we would get this from the auth context
  // For now using the same placeholder as in EnrolledCoursesWidget
  const userId = 'current-user-id'; // Placeholder - should come from auth context
  
  // Mock service function - this would be replaced with a real API call
  const fetchRecentActivity = async (userId: string): Promise<IActivityItem[]> => {
    // This is a placeholder that would be replaced with a real API call
    // In a real implementation, this would call something like:
    // return await api.users.getRecentActivity({ userId, limit: 5 });
    
    // Simulating an API response delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    return [
      {
        id: '1',
        type: 'quiz_completed',
        title: 'React Hooks Fundamentals',
        relatedCourse: 'Advanced React Patterns',
        detail: 'Score: 92/100',
        timestamp: now.toISOString()
      },
      {
        id: '2',
        type: 'assignment_submitted',
        title: 'Component Architecture',
        relatedCourse: 'Advanced React Patterns',
        detail: 'Pending grading',
        timestamp: yesterday.toISOString()
      },
      {
        id: '3',
        type: 'lecture_watched',
        title: 'State Management',
        relatedCourse: 'Advanced React Patterns',
        detail: '45 minutes watched',
        timestamp: yesterday.toISOString()
      }
    ];
  };
  
  // Fetch recent activity using React Query
  const {
    data: activities,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<IActivityItem[], Error>({
    queryKey: ['recentActivity', userId],
    queryFn: () => fetchRecentActivity(userId),
  });
  
  // Format timestamp for display
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise show date and time
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
      ` ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <h2 className="text-lg font-semibold">Recent Activity</h2>
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
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        <StateDisplay 
          variant="error"
          title="Failed to load recent activities"
          message={`${error?.message || 'An error occurred while fetching your recent activities'}`}
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
  if (!activities?.length) {
    return (
      <Card>
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        <StateDisplay
          title="No recent activity"
          message="Start exploring courses and your activity will appear here."
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
  
  // Get icon for each activity type
  const getActivityIcon = (type: IActivityItem['type']) => {
    switch (type) {
      case 'quiz_completed':
        return (
          <div className="absolute -left-2 mt-1 w-4 h-4 rounded-full bg-success"></div>
        );
      case 'assignment_submitted':
        return (
          <div className="absolute -left-2 mt-1 w-4 h-4 rounded-full bg-info"></div>
        );
      case 'lecture_watched':
        return (
          <div className="absolute -left-2 mt-1 w-4 h-4 rounded-full bg-primary-500"></div>
        );
      default:
        return (
          <div className="absolute -left-2 mt-1 w-4 h-4 rounded-full bg-neutral-500"></div>
        );
    }
  };
  
  // Get title for each activity type
  const getActivityTitle = (activity: IActivityItem) => {
    switch (activity.type) {
      case 'quiz_completed':
        return `Completed Quiz: ${activity.title}`;
      case 'assignment_submitted':
        return `Submitted Assignment: ${activity.title}`;
      case 'lecture_watched':
        return `Watched Lecture: ${activity.title}`;
      default:
        return activity.title;
    }
  };
  
  // Render activities list
  return (
    <Card>
      <div className="flex items-center mb-4">
        <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <h2 className="text-lg font-semibold">Recent Activity</h2>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const isLast = index === activities.length - 1;
          return (
            <div 
              key={activity.id} 
              className={`relative pl-8 ${!isLast ? 'pb-6 border-l-2 border-gray-200' : ''}`}
            >
              {getActivityIcon(activity.type)}
              <div>
                <p className="font-medium">{getActivityTitle(activity)}</p>
                {activity.detail && (
                  <p className="text-sm text-gray-600 mt-1">{activity.detail}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">{formatTimestamp(activity.timestamp)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default RecentActivityWidget;