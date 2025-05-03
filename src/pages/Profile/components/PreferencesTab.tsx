import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';

// Styles
import styles from '../ProfileSettingsPage.module.css';

// Icons
import { BellIcon, EnvelopeIcon, CheckIcon } from '@heroicons/react/24/outline';

// Mock preference update function - would be replaced with actual API service
const updatePreferences = async (preferences: any): Promise<void> => {
  // Simulating API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Updating preferences:', preferences);
      resolve();
    }, 800);
  });
};

/**
 * Preferences tab for notification and application settings
 */
const PreferencesTab: React.FC = () => {
  // State for notification settings
  const [emailNotifications, setEmailNotifications] = useState({
    courseUpdates: true,
    deadlineReminders: true,
    newAssignments: true,
    gradingUpdates: true,
    announcements: true,
    marketingEmails: false,
  });

  // State for application settings
  const [appSettings, setAppSettings] = useState({
    darkMode: false,
    autoPlay: true,
    highContrastMode: false,
    showProgressInSidebar: true,
  });

  // State for success message
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle preference saving
  const { mutate: savePreferences, isPending } = useMutation({
    mutationFn: updatePreferences,
    onSuccess: () => {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  });

  // Toggle notification setting
  const handleNotificationChange = (key: keyof typeof emailNotifications) => {
    setEmailNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Toggle app setting
  const handleAppSettingChange = (key: keyof typeof appSettings) => {
    setAppSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Save all preferences
  const handleSave = () => {
    savePreferences({
      notifications: emailNotifications,
      appSettings
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.fadeIn}
    >
      <h2 className="text-2xl font-heading font-semibold text-neutral-800 mb-2">Preferences</h2>
      <p className="text-neutral-600 mb-6">Manage your notification settings and application preferences</p>

      {/* Success message */}
      {showSuccess && (
        <div className="mb-6 p-4 flex items-center bg-green-50 border border-green-200 rounded-lg text-green-700">
          <CheckIcon className="w-5 h-5 mr-2" />
          Preferences saved successfully
        </div>
      )}

      {/* Email Notifications Section */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <EnvelopeIcon className="w-5 h-5 text-primary-500 mr-2" />
          <h3 className="text-lg font-medium text-neutral-800">Email Notifications</h3>
        </div>
        
        <div className="bg-neutral-50 rounded-lg border border-neutral-100 p-4 mb-6">
          <div className="space-y-3">
            {Object.entries(emailNotifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label htmlFor={`email-${key}`} className="text-neutral-700">
                  {key === 'courseUpdates' && 'Course updates and content changes'}
                  {key === 'deadlineReminders' && 'Deadline reminders (24h in advance)'}
                  {key === 'newAssignments' && 'New assignments and quizzes'}
                  {key === 'gradingUpdates' && 'Grade updates and feedback'}
                  {key === 'announcements' && 'Course announcements'}
                  {key === 'marketingEmails' && 'Marketing and promotional emails'}
                </label>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                  <input
                    type="checkbox"
                    id={`email-${key}`}
                    className="opacity-0 w-0 h-0"
                    checked={value}
                    onChange={() => handleNotificationChange(key as keyof typeof emailNotifications)}
                  />
                  <label
                    htmlFor={`email-${key}`}
                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ${
                      value ? 'bg-primary-500' : 'bg-neutral-300'
                    }`}
                  >
                    <span 
                      className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                        value ? 'transform translate-x-6' : ''
                      }`}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application Settings Section */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <BellIcon className="w-5 h-5 text-primary-500 mr-2" />
          <h3 className="text-lg font-medium text-neutral-800">Application Settings</h3>
        </div>
        
        <div className="bg-neutral-50 rounded-lg border border-neutral-100 p-4 mb-6">
          <div className="space-y-3">
            {Object.entries(appSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label htmlFor={`app-${key}`} className="text-neutral-700">
                  {key === 'darkMode' && 'Enable dark mode'}
                  {key === 'autoPlay' && 'Auto-play videos when available'}
                  {key === 'highContrastMode' && 'High contrast mode'}
                  {key === 'showProgressInSidebar' && 'Show course progress in sidebar'}
                </label>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                  <input
                    type="checkbox"
                    id={`app-${key}`}
                    className="opacity-0 w-0 h-0"
                    checked={value}
                    onChange={() => handleAppSettingChange(key as keyof typeof appSettings)}
                  />
                  <label
                    htmlFor={`app-${key}`}
                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ${
                      value ? 'bg-primary-500' : 'bg-neutral-300'
                    }`}
                  >
                    <span 
                      className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                        value ? 'transform translate-x-6' : ''
                      }`}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-8">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:bg-primary-300"
        >
          {isPending ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </motion.div>
  );
};

export default PreferencesTab;