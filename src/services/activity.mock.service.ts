import { IActivityItem, IUserActivitiesResponse } from '../types/activity.types';

// Mock activity data
const mockActivities: IActivityItem[] = [
  {
    activityId: 'act-1',
    userId: 'user-1',
    type: 'assignment_submission',
    title: 'Assignment Submitted',
    description: 'You submitted the "React Hooks Essay" assignment.',
    resourceId: 'assignment-123',
    resourceType: 'assignment',
    courseId: 'course-1',
    courseName: 'Advanced React Patterns',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    metadata: {
      score: null,
      submissionStatus: 'pending'
    }
  },
  {
    activityId: 'act-2',
    userId: 'user-1',
    type: 'quiz_completion',
    title: 'Quiz Completed',
    description: 'You scored 85% on "TypeScript Fundamentals" quiz.',
    resourceId: 'quiz-456',
    resourceType: 'quiz',
    courseId: 'course-2',
    courseName: 'TypeScript Mastery',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    metadata: {
      score: 85,
      maxScore: 100,
      timeTaken: '00:18:45'
    }
  },
  {
    activityId: 'act-3',
    userId: 'user-1',
    type: 'course_enrollment',
    title: 'New Course Enrollment',
    description: 'You enrolled in "UI/UX Design Principles".',
    resourceId: 'course-3',
    resourceType: 'course',
    courseId: 'course-3',
    courseName: 'UI/UX Design Principles',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    activityId: 'act-4',
    userId: 'user-1',
    type: 'lecture_watched',
    title: 'Lecture Completed',
    description: 'You watched "Building Custom Hooks".',
    resourceId: 'lecture-789',
    resourceType: 'lecture',
    courseId: 'course-1',
    courseName: 'Advanced React Patterns',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    metadata: {
      duration: '45:12',
      progress: 100
    }
  },
  {
    activityId: 'act-5',
    userId: 'user-1',
    type: 'grade_received',
    title: 'Assignment Graded',
    description: 'You received a grade of 92% on "State Management Implementation".',
    resourceId: 'assignment-567',
    resourceType: 'assignment',
    courseId: 'course-1',
    courseName: 'Advanced React Patterns',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    metadata: {
      score: 92,
      feedback: 'Excellent work on implementing the reducer pattern.'
    }
  }
];

/**
 * Mock implementation of getUserActivity
 */
export async function getUserActivity(
  _userId: string,
  params?: { 
    limit?: number; 
    page?: number;
    types?: string[];
    startDate?: string;
    endDate?: string;
  }
): Promise<IUserActivitiesResponse> {
  // Apply filters if provided
  let filteredActivities = [...mockActivities];
  
  if (params?.types && params.types.length > 0) {
    filteredActivities = filteredActivities.filter(a => params.types!.includes(a.type));
  }

  // Apply date filters if provided
  if (params?.startDate) {
    const startDate = new Date(params.startDate);
    filteredActivities = filteredActivities.filter(a => new Date(a.timestamp) >= startDate);
  }

  if (params?.endDate) {
    const endDate = new Date(params.endDate);
    filteredActivities = filteredActivities.filter(a => new Date(a.timestamp) <= endDate);
  }
  
  // Sort by timestamp (newest first)
  filteredActivities.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Apply pagination
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedActivities = filteredActivities.slice(start, end);
  
  return {
    data: paginatedActivities,
    meta: {
      page,
      limit,
      totalItems: filteredActivities.length,
      totalPages: Math.ceil(filteredActivities.length / limit)
    }
  };
}

/**
 * Mock implementation of getActivityById
 */
export async function getActivityById(activityId: string): Promise<IActivityItem> {
  const activity = mockActivities.find(a => a.activityId === activityId);
  if (!activity) {
    throw new Error(`Activity with ID ${activityId} not found`);
  }
  return activity;
}