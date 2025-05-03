import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './DashboardPage.module.css';

// Import widget implementations
import { EnrolledCoursesWidget } from '../../components/features/Dashboard/EnrolledCoursesWidget';
import { UpcomingDeadlinesWidget } from '../../components/features/Dashboard/UpcomingDeadlinesWidget';
import { RecentActivityWidget } from '../../components/features/Dashboard/RecentActivityWidget';
import { EngagementChart } from '../../components/features/Dashboard/EngagementChart';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const DashboardPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days'>('30days');
  
  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-6">Student Dashboard</h1>
          
          {/* Welcome banner with custom gradient and pattern */}
          <div className={`${styles.welcomeBannerGradient} rounded-xl shadow-md p-6 mb-8`}>
            <div className={styles.welcomeBannerContent}>
              <h2 className="text-2xl font-heading font-semibold mb-2 text-white">Welcome back, Student!</h2>
              <p className="opacity-90 text-white">Continue where you left off and track your learning progress.</p>
            </div>
          </div>

          {/* Main dashboard grid with staggered animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Main widgets - larger size */}
            <div className={`lg:col-span-2 ${styles.fadeInUp}`}>
              <EnrolledCoursesWidget />
            </div>
            <div className={`${styles.fadeInUp} ${styles.delayOne}`}>
              <UpcomingDeadlinesWidget />
            </div>
            
            {/* Engagement Analytics Chart with time range filter */}
            <div className={`lg:col-span-3 ${styles.fadeInUp} ${styles.delayTwo}`}>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-wrap items-center justify-between mb-4">
                  <h2 className="text-xl font-heading font-semibold text-neutral-800">Engagement Analytics</h2>
                  <div className="flex space-x-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => setTimeRange('7days')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        timeRange === '7days' 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      7 Days
                    </button>
                    <button
                      onClick={() => setTimeRange('30days')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        timeRange === '30days' 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      30 Days
                    </button>
                    <button
                      onClick={() => setTimeRange('90days')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        timeRange === '90days' 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      90 Days
                    </button>
                  </div>
                </div>
                <EngagementChart 
                  period={timeRange === '7days' ? 'daily' : timeRange === '30days' ? 'daily' : 'weekly'} 
                  dateRange={timeRange}
                />
              </div>
            </div>
            
            <div className={`lg:col-span-3 ${styles.fadeInUp} ${styles.delayThree}`}>
              <RecentActivityWidget />
            </div>
          </div>

          {/* Quick actions section */}
          <div className="mt-8">
            <h2 className="text-xl font-heading font-semibold text-neutral-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Browse Courses', 'View Calendar', 'Check Grades', 'Support'].map((action, idx) => (
                <button 
                  key={idx}
                  className={`p-4 bg-white border border-neutral-200 rounded-lg shadow-sm flex flex-col items-center justify-center ${styles.quickActionButton}`}
                >
                  <span className="mt-2 text-neutral-700">{action}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;