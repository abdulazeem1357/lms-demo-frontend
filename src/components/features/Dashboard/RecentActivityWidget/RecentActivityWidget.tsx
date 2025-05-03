import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';

// Services
import { getUserActivity } from '../../../../services/activity';

// Components
import Card from '../../../common/Card/Card';
import Spinner from '../../../common/Spinner/Spinner';
import StateDisplay from '../../../common/StateDisplay/StateDisplay';

// Types
import { IActivityItem } from '../../../../types/activity.types';

// Contexts
import { useAuth } from '../../../../contexts/AuthContext';

// Icons
import { 
  DocumentTextIcon,
  AcademicCapIcon, 
  DocumentCheckIcon, 
  PlayIcon, 
  ChatBubbleLeftRightIcon, 
  ArchiveBoxIcon,
  ChevronRightIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

/**
 * Widget that displays recent user activity in the LMS
 */
const RecentActivityWidget: React.FC = () => {
  const { user } = useAuth();
  
  // Fetch recent activities for the current user
  const {
    data: activitiesResponse,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['userActivities', user?.id],
    queryFn: () => getUserActivity(user?.id || '', { limit: 5 }),
    enabled: !!user?.id,
  });

  const activities = activitiesResponse?.data || [];
  
  // Handle loading state
  if (isLoading) {
    return (
      <Card className="h-full">
        <div className="p-6">
          <h2 className="text-xl font-heading font-semibold mb-4 text-neutral-800">Recent Activity</h2>
          <div className="flex justify-center items-center p-8">
            <Spinner size="lg" label="Loading activities..." />
          </div>
        </div>
      </Card>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <Card className="h-full">
        <div className="p-6">
          <h2 className="text-xl font-heading font-semibold mb-4 text-neutral-800">Recent Activity</h2>
          <StateDisplay 
            type="error"
            title="Failed to load activities"
            message={error instanceof Error ? error.message : 'An error occurred while fetching activities'}
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
      </Card>
    );
  }

  // Handle empty state
  if (!activities || activities.length === 0) {
    return (
      <Card className="h-full">
        <div className="p-6">
          <h2 className="text-xl font-heading font-semibold mb-4 text-neutral-800">Recent Activity</h2>
          <StateDisplay 
            type="empty"
            title="No recent activity"
            message="You haven't had any activity in the platform yet."
          />
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <div className="p-6">
        <h2 className="text-xl font-heading font-semibold mb-4 text-neutral-800">Recent Activity</h2>
        <ul className="divide-y divide-neutral-100">
          {activities.map((activity) => (
            <ActivityItem key={activity.activityId} activity={activity} />
          ))}
        </ul>
        <div className="mt-4 pt-3 border-t border-neutral-100">
          <Link 
            to="/activity" 
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors flex items-center"
          >
            View All Activity
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </Card>
  );
};

interface ActivityItemProps {
  activity: IActivityItem;
}

/**
 * Individual activity item component
 */
const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const formattedDate = format(new Date(activity.timestamp), 'MMM d, yyyy');
  const relativeTime = formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true });
  
  // Determine icon and styling based on activity type
  const getTypeStyles = () => {
    switch (activity.type) {
      case 'assignment_submission':
        return {
          icon: <DocumentTextIcon className="w-5 h-5" />,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-600'
        };
      case 'quiz_completion':
        return {
          icon: <DocumentCheckIcon className="w-5 h-5" />,
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-600'
        };
      case 'course_enrollment':
        return {
          icon: <AcademicCapIcon className="w-5 h-5" />,
          bgColor: 'bg-green-100',
          textColor: 'text-green-600'
        };
      case 'lecture_watched':
        return {
          icon: <PlayIcon className="w-5 h-5" />,
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-600'
        };
      case 'discussion_post':
        return {
          icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />,
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-600'
        };
      case 'grade_received':
        return {
          icon: <ArchiveBoxIcon className="w-5 h-5" />,
          bgColor: 'bg-teal-100',
          textColor: 'text-teal-600'
        };
      default:
        return {
          icon: <ArchiveBoxIcon className="w-5 h-5" />,
          bgColor: 'bg-neutral-100',
          textColor: 'text-neutral-600'
        };
    }
  };

  const { icon, bgColor, textColor } = getTypeStyles();
  
  // Determine the URL to navigate to based on the resource type
  const getActivityUrl = () => {
    switch (activity.resourceType) {
      case 'assignment':
        return `/courses/${activity.courseId}/assignments/${activity.resourceId}`;
      case 'quiz':
        return `/courses/${activity.courseId}/quizzes/${activity.resourceId}`;
      case 'course':
        return `/courses/${activity.resourceId}`;
      case 'lecture':
        return `/courses/${activity.courseId}/lectures/${activity.resourceId}`;
      default:
        return '#';
    }
  };

  return (
    <li className="py-3">
      <Link 
        to={getActivityUrl()} 
        className="flex items-start hover:bg-neutral-50 rounded-md transition-colors p-2 -mx-2"
      >
        <div className={`${bgColor} ${textColor} p-2 rounded-md mr-3`}>
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-neutral-900">{activity.title}</h4>
          <p className="text-sm text-neutral-600">{activity.description}</p>
          
          {activity.courseName && (
            <p className="text-sm text-neutral-500 mt-1">
              {activity.courseName}
            </p>
          )}
          
          <div className="flex items-center mt-1 text-xs text-neutral-500">
            <ClockIcon className="w-3.5 h-3.5 mr-1" />
            <span>{relativeTime}</span>
            <span className="mx-2 text-neutral-300">•</span>
            <span>{formattedDate}</span>
          </div>
        </div>
        
        <ChevronRightIcon className="w-5 h-5 text-neutral-400 mt-1 ml-2" />
      </Link>
    </li>
  );
};

export default RecentActivityWidget;