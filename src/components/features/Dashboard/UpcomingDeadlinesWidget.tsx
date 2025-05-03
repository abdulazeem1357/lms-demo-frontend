import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, formatDistanceToNow, isBefore, addDays } from 'date-fns';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { StateDisplay } from '../../../components/common/StateDisplay';
import { Spinner } from '../../../components/common/Spinner';

/**
 * Represents a deadline item for display in the widget
 */
interface IDeadline {
  id: string;               // UUID
  title: string;
  courseName: string;
  dueDate: string;          // ISO 8601
  type: 'assignment' | 'quiz';
}

/**
 * Mock service function to get upcoming deadlines
 * In a real app, this would be in a service file and would call an API
 */
const getUpcomingDeadlines = async (limit: number = 5): Promise<IDeadline[]> => {
  // In a real app, we would call the API with the limit parameter
  // e.g., await apiClient.get(`/users/current/deadlines?limit=${limit}`);
  
  // For now, we'll return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return only the requested number of items
      const mockDeadlines: IDeadline[] = [
        {
          id: 'd1e2f3g4-h5i6-j7k8-l9m0-n1o2p3q4r5s6',
          title: 'React Hooks Essay',
          courseName: 'Advanced React Patterns',
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days from now
          type: 'assignment'
        },
        {
          id: 'd2e3f4g5-h6i7-j8k9-l0m1-n2o3p4q5r6s7',
          title: 'State Management Quiz',
          courseName: 'Advanced React Patterns',
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days from now
          type: 'quiz'
        },
        {
          id: 'd3e4f5g6-h7i8-j9k0-l1m2-n3o4p5q6r7s8',
          title: 'TypeScript Generics Exercise',
          courseName: 'Data Structures in TypeScript',
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days from now
          type: 'assignment'
        }
      ];
      
      resolve(mockDeadlines.slice(0, limit));
    }, 800); // Simulate network delay
  });
};

/**
 * Widget displaying upcoming assignment and quiz deadlines
 * for a student in the LMS dashboard
 */
const UpcomingDeadlinesWidget: React.FC = () => {
  // Fetch upcoming deadlines using React Query
  const { 
    data: deadlines,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<IDeadline[], Error>({
    queryKey: ['upcomingDeadlines'],
    queryFn: () => getUpcomingDeadlines(5),
  });
  
  // Calculate the number of soon-to-be-due items (due within next 3 days)
  const dueSoonCount = deadlines?.filter(
    deadline => isBefore(new Date(deadline.dueDate), addDays(new Date(), 3))
  ).length || 0;

  // Helper function to determine text color based on deadline proximity
  const getDeadlineColor = (dueDate: string): string => {
    const now = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) return 'text-red-600'; // Past due
    if (daysUntilDue <= 2) return 'text-red-600'; // Due very soon
    if (daysUntilDue <= 5) return 'text-yellow-600'; // Due soon
    return 'text-gray-600'; // Due later
  };

  // Render loading state
  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-primary-600" />
            Upcoming Deadlines
          </h2>
        </div>
        <div className="flex justify-center items-center h-32">
          <Spinner size={24} />
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
            <CalendarIcon className="w-5 h-5 mr-2 text-primary-600" />
            Upcoming Deadlines
          </h2>
        </div>
        <StateDisplay 
          variant="error"
          title="Failed to load deadlines"
          message={`${error?.message || 'An error occurred while fetching your deadlines'}`}
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
  if (!deadlines?.length) {
    return (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-primary-600" />
            Upcoming Deadlines
          </h2>
        </div>
        <StateDisplay
          title="No upcoming deadlines"
          message="You're all caught up! Check back later for new assignments and quizzes."
          size="compact"
        />
      </Card>
    );
  }
  
  // Render deadlines list
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2 text-primary-600" />
          Upcoming Deadlines
        </h2>
        {dueSoonCount > 0 && (
          <Badge variant="warning" size="sm">{dueSoonCount} Due Soon</Badge>
        )}
      </div>
      <div className="space-y-3">
        {deadlines.map((deadline) => {
          const dueColor = getDeadlineColor(deadline.dueDate);
          const relativeDate = formatDistanceToNow(new Date(deadline.dueDate), { addSuffix: true });
          const formattedDate = format(new Date(deadline.dueDate), 'MMM d, yyyy');
          
          return (
            <div 
              key={deadline.id} 
              className="flex items-center p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              onClick={() => window.location.href = `/courses/${deadline.id}`}
            >
              <div className={`mr-3 ${deadline.type === 'quiz' ? 'bg-info-100 text-info-800' : 'bg-warning-100 text-warning-800'} p-2 rounded-md`}>
                <ClockIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">{deadline.title}</h3>
                <p className="text-xs text-gray-500">{deadline.courseName}</p>
              </div>
              <div className="text-right">
                <span className={`text-xs font-medium ${dueColor}`}>{relativeDate}</span>
                <p className="text-xs text-gray-500">{formattedDate}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default UpcomingDeadlinesWidget;