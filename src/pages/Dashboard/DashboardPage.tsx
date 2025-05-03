import React, { useState } from 'react';
import { PageTransition } from '../../components/common/PageTransition';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { StateDisplay } from '../../components/common/StateDisplay';
import { Button } from '../../components/common/Button';
import { 
  CalendarIcon, 
  BookOpenIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  ClockIcon,
  BellIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import styles from './DashboardPage.module.css';

/**
 * Student Dashboard Page displaying various widgets with course information,
 * progress metrics, upcoming deadlines, and notifications
 */
const DashboardPage: React.FC = () => {
  // Loading state for initial data fetching
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Test state for button loading
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  // Handle test button click
  const handleTestButtonClick = () => {
    setButtonLoading(true);
    setTimeout(() => {
      setButtonLoading(false);
    }, 2000);
  };

  return (
    <PageTransition>
      <div className={`px-4 py-6 md:px-6 lg:px-8 ${styles.dashboardContainer}`}>
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Here's an overview of your learning journey.
          </p>
        </header>

        {/* Main Dashboard Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Enrolled Courses Widget - Prominent placement */}
            <div className="lg:col-span-2">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center">
                    <BookOpenIcon className="w-5 h-5 mr-2 text-primary-600" />
                    Enrolled Courses
                  </h2>
                  <Badge variant="primary" size="sm">5 Active</Badge>
                </div>
                <div className="space-y-4">
                  {/* Course items would be mapped here */}
                  {[1, 2, 3].map((item) => (
                    <div 
                      key={item} 
                      className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${styles.courseCard}`}
                    >
                      <div className="flex items-center">
                        <div className="bg-primary-100 rounded-md p-2 mr-3">
                          <AcademicCapIcon className="w-5 h-5 text-primary-700" />
                        </div>
                        <div>
                          <h3 className="font-medium">Advanced React Patterns</h3>
                          <p className="text-sm text-gray-500">12 modules • 4 assignments</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">75% Complete</div>
                        <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                          <div className={`h-2 bg-primary-500 rounded-full ${styles.progressBar}`} style={{ width: '75%' }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                    View all courses
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </Card>
            </div>

            {/* Progress Summary Widget */}
            <div>
              <Card>
                <div className="flex items-center mb-4">
                  <ChartBarIcon className="w-5 h-5 mr-2 text-primary-600" />
                  <h2 className="text-lg font-semibold">Progress Summary</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Courses Completed</span>
                    <span className="font-medium">3 of 8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Overall Completion</span>
                    <span className="font-medium">62.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Score</span>
                    <span className="font-medium">87.3%</span>
                  </div>
                  <div className="pt-2">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className={`h-2 bg-primary-500 rounded-full ${styles.progressBar}`} style={{ width: '62.5%' }}></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Upcoming Deadlines Widget */}
            <div>
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 text-primary-600" />
                    Upcoming Deadlines
                  </h2>
                  <Badge variant="warning" size="sm" className={styles.urgentBadge}>3 Due Soon</Badge>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className={`flex items-center p-3 bg-gray-50 rounded-lg ${styles.courseCard}`}>
                      <div className="mr-3 bg-warning-100 text-warning-800 p-2 rounded-md">
                        <ClockIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">React Hooks Essay</h3>
                        <p className="text-xs text-gray-500">Advanced React Patterns</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium text-warning-600">Due in 2 days</span>
                        <p className="text-xs text-gray-500">May 15, 2025</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Recent Notifications Widget */}
            <div>
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center">
                    <BellIcon className="w-5 h-5 mr-2 text-primary-600" />
                    Recent Notifications
                  </h2>
                  <Badge variant="info" size="sm">4 New</Badge>
                </div>
                <div className={`space-y-3 ${styles.notificationsList}`}>
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className={`w-2 h-2 mt-2 rounded-full bg-info-500 mr-2 ${styles.notificationDot}`}></div>
                      <div>
                        <p className="text-sm">Your assignment "State Management Essay" has been graded.</p>
                        <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
                      </div>
                    </div>
                  ))}
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                    View all notifications
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </Card>
            </div>

            {/* Recent Activity Widget */}
            <div className="lg:col-span-2">
              <Card>
                <div className="flex items-center mb-4">
                  <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <h2 className="text-lg font-semibold">Recent Activity</h2>
                </div>
                <div className="space-y-4">
                  <div className={`relative pl-8 pb-6 ${styles.timelineItem}`}>
                    <div className="absolute -left-2 mt-1 w-4 h-4 rounded-full bg-primary-500"></div>
                    <div>
                      <p className="font-medium">Completed Quiz: React Hooks Fundamentals</p>
                      <p className="text-sm text-gray-600 mt-1">Score: 92/100</p>
                      <p className="text-xs text-gray-500 mt-1">Today, 10:30 AM</p>
                    </div>
                  </div>
                  
                  <div className={`relative pl-8 pb-6 ${styles.timelineItem}`}>
                    <div className="absolute -left-2 mt-1 w-4 h-4 rounded-full bg-primary-500"></div>
                    <div>
                      <p className="font-medium">Submitted Assignment: Component Architecture</p>
                      <p className="text-sm text-gray-600 mt-1">Pending grading</p>
                      <p className="text-xs text-gray-500 mt-1">Yesterday, 4:15 PM</p>
                    </div>
                  </div>
                  
                  <div className={`relative pl-8 ${styles.timelineItem}`}>
                    <div className="absolute -left-2 mt-1 w-4 h-4 rounded-full bg-primary-500"></div>
                    <div>
                      <p className="font-medium">Watched Lecture: State Management</p>
                      <p className="text-sm text-gray-600 mt-1">45 minutes watched</p>
                      <p className="text-xs text-gray-500 mt-1">Yesterday, 1:20 PM</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default DashboardPage;