import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';

// User service for profile operations - using unified service module
import { getCurrentUserProfile } from '../../services/user';

// Components
import { Spinner } from '../../components/common/Spinner';
import { StateDisplay } from '../../components/common/StateDisplay';
import ProfileTab from './components/ProfileTab';
import SecurityTab from './components/SecurityTab';
import PreferencesTab from './components/PreferencesTab';

// Auth context for user data
import { useAuth } from '../../contexts/AuthContext';

// Icons
import { UserIcon, ShieldCheckIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

type TabType = 'profile' | 'security' | 'preferences';

/**
 * Profile and Settings page with tabbed interface
 */
const ProfileSettingsPage: React.FC = () => {
  // Current active tab
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const { user } = useAuth();
  
  // Redirect if no user
  if (!user?.id) {
    return <Navigate to="/login" />;
  }

  // Fetch user profile data
  const {
    data: profileData,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['userProfile', user.id],
    queryFn: async () => {
      const data = await getCurrentUserProfile();
      if (!data) {
        throw new Error('Failed to fetch profile data');
      }
      return data;
    },
    enabled: !!user.id,
  });
  
  // Tab configuration for easy mapping
  const tabs = [
    { id: 'profile', label: 'Profile', icon: <UserIcon className="w-5 h-5" />, component: <ProfileTab profileData={profileData} /> },
    { id: 'security', label: 'Security', icon: <ShieldCheckIcon className="w-5 h-5" />, component: <SecurityTab /> },
    { id: 'preferences', label: 'Preferences', icon: <Cog6ToothIcon className="w-5 h-5" />, component: <PreferencesTab /> },
  ];

  // Handle tab change
  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
  };
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center p-12">
          <Spinner size="lg" label="Loading profile data..." />
        </div>
      </div>
    );
  }
  
  // Handle error state
  if (isError) {
    return (
      <div className="p-8">
        <StateDisplay 
          type="error"
          title="Failed to load profile"
          message={error instanceof Error ? error.message : 'An error occurred while fetching profile data'}
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
    );
  }
  
  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-6">Profile & Settings</h1>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Sidebar tabs for larger screens, horizontal tabs for mobile */}
              <div className="md:w-64 bg-neutral-50 p-4 md:border-r border-neutral-100">
                <div className="md:hidden mb-4">
                  <select 
                    className="w-full p-2 border border-neutral-200 rounded-md bg-white"
                    value={activeTab}
                    onChange={(e) => handleTabChange(e.target.value as TabType)}
                  >
                    {tabs.map(tab => (
                      <option key={tab.id} value={tab.id}>{tab.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="hidden md:flex flex-col space-y-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id as TabType)}
                      className={`flex items-center p-3 rounded-md transition-colors ${
                        activeTab === tab.id 
                          ? 'bg-primary-50 text-primary-700 font-medium' 
                          : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      <span className={`mr-3 ${activeTab === tab.id ? 'text-primary-500' : 'text-neutral-400'}`}>
                        {tab.icon}
                      </span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Tab content */}
              <div className="flex-1 p-6">
                {tabs.find(tab => tab.id === activeTab)?.component}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;