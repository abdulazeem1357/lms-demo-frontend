import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

// Services
import { getUpcomingDeadlines } from '../../../../services/deadline';

// Components
import { Card } from '../../../common/Card';
import { Spinner } from '../../../common/Spinner';
import { StateDisplay } from '../../../common/StateDisplay';

// Types
import { IDeadline } from '../../../../types/deadline.types';

/**
 * Widget that displays upcoming deadlines for assignments and quizzes
 */
const UpcomingDeadlinesWidget: React.FC = () => {
  // Fetch upcoming deadlines
  const {
    data: deadlines,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['upcomingDeadlines'],
    queryFn: () => getUpcomingDeadlines({ limit: 5 }),
  });

  // Handle loading state
  if (isLoading) {
    return (
      <Card className="h-full">
        <div className="p-6">
          <h2 className="text-xl font-heading font-semibold mb-4 text-neutral-800">Upcoming Deadlines</h2>
          <div className="flex justify-center items-center p-8">
            <Spinner size="lg" label="Loading deadlines..." />
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
          <h2 className="text-xl font-heading font-semibold mb-4 text-neutral-800">Upcoming Deadlines</h2>
          <StateDisplay 
            type="error"
            title="Failed to load deadlines"
            message={error instanceof Error ? error.message : 'An error occurred while fetching deadlines'}
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
  if (!deadlines || deadlines.length === 0) {
    return (
      <Card className="h-full">
        <div className="p-6">
          <h2 className="text-xl font-heading font-semibold mb-4 text-neutral-800">Upcoming Deadlines</h2>
          <StateDisplay 
            type="empty"
            title="No upcoming deadlines"
            message="You have no assignments or quizzes due soon."
          />
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <div className="p-6">
        <h2 className="text-xl font-heading font-semibold mb-4 text-neutral-800">Upcoming Deadlines</h2>
        <ul className="divide-y divide-neutral-100">
          {deadlines.map((deadline) => (
            <DeadlineItem key={deadline.id} deadline={deadline} />
          ))}
        </ul>
        <div className="mt-4 pt-3 border-t border-neutral-100">
          <Link 
            to="/deadlines" 
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            View All Deadlines
          </Link>
        </div>
      </div>
    </Card>
  );
};

interface DeadlineItemProps {
  deadline: IDeadline;
}

/**
 * Individual deadline item component
 */
const DeadlineItem: React.FC<DeadlineItemProps> = ({ deadline }) => {
  const isOverdue = isPast(new Date(deadline.dueDate));
  const formattedDate = format(new Date(deadline.dueDate), 'MMM d, yyyy');
  const relativeTime = formatDistanceToNow(new Date(deadline.dueDate), { addSuffix: true });
  
  // Determine icon and color based on deadline type and status
  const getTypeStyles = () => {
    switch (deadline.type) {
      case 'assignment':
        return {
          icon: <DocumentIcon className="w-5 h-5" />,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-600'
        };
      case 'quiz':
        return {
          icon: <QuestionMarkCircleIcon className="w-5 h-5" />,
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-600'
        };
      case 'live-lecture':
        return {
          icon: <VideoCameraIcon className="w-5 h-5" />,
          bgColor: 'bg-green-100',
          textColor: 'text-green-600'
        };
      default:
        return {
          icon: <CalendarIcon className="w-5 h-5" />,
          bgColor: 'bg-neutral-100',
          textColor: 'text-neutral-600'
        };
    }
  };

  const { icon, bgColor, textColor } = getTypeStyles();

  return (
    <li className="py-3">
      <Link 
        to={deadline.url || '#'} 
        className="flex items-start hover:bg-neutral-50 rounded-md transition-colors p-2 -mx-2"
      >
        <div className={`${bgColor} ${textColor} p-2 rounded-md mr-3`}>
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-neutral-900 truncate">{deadline.title}</h4>
          <p className="text-sm text-neutral-600 truncate">{deadline.courseName}</p>
          
          <div className="flex items-center mt-1 text-xs">
            <span className={`flex items-center ${isOverdue ? 'text-error' : 'text-neutral-500'}`}>
              <CalendarIcon className="w-3.5 h-3.5 mr-1" />
              {formattedDate}
            </span>
            <span className="mx-2 text-neutral-300">•</span>
            <span className={`flex items-center ${isOverdue ? 'text-error' : 'text-neutral-500'}`}>
              <ClockIcon className="w-3.5 h-3.5 mr-1" />
              {relativeTime}
            </span>
          </div>
        </div>
        
        <div className="ml-3">
          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
            isOverdue 
              ? 'bg-red-100 text-red-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isOverdue ? 'Overdue' : 'Upcoming'}
          </span>
        </div>
      </Link>
    </li>
  );
};

// Import these icons here to avoid duplication
import { DocumentIcon, QuestionMarkCircleIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

export default UpcomingDeadlinesWidget;