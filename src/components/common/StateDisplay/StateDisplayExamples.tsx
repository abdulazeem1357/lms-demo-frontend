import React from 'react';
import { StateDisplay } from './';
import { DocumentTextIcon, ExclamationTriangleIcon, WifiIcon } from '@heroicons/react/24/outline';

/**
 * Example component showing different configurations of the StateDisplay component
 * Not for production use - for demonstration purposes only
 */
export const StateDisplayExamples: React.FC = () => {
  return (
    <div className="space-y-8 p-6 bg-white">
      <div>
        <h2 className="text-xl font-semibold mb-4">Basic Empty States</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Default Empty State</h3>
            <StateDisplay
              title="No assignments found"
              message="There are no assignments for this module yet."
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Empty State with Action</h3>
            <StateDisplay
              title="Your course list is empty"
              message="Explore our catalog to find courses that interest you."
              action={{
                text: "Browse Courses",
                onClick: () => alert("Navigate to courses catalog")
              }}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Error States</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Basic Error State</h3>
            <StateDisplay
              variant="error"
              title="Failed to load data"
              message="There was an error retrieving your information. Please try again later."
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Error with Retry Action</h3>
            <StateDisplay
              variant="error"
              title="Connection error"
              message="We're having trouble connecting to the server. Check your connection and try again."
              action={{
                text: "Retry",
                onClick: () => alert("Retrying connection")
              }}
              icon={<WifiIcon className="w-full h-full" />}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Custom Icons</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Custom Document Icon</h3>
            <StateDisplay
              title="No submissions yet"
              message="Students haven't submitted any assignments for this course."
              icon={<DocumentTextIcon className="w-full h-full" />}
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Custom Warning Icon</h3>
            <StateDisplay
              variant="error"
              title="Access restricted"
              message="You don't have permission to view this content. Contact your administrator."
              icon={<ExclamationTriangleIcon className="w-full h-full" />}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Size Variations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Compact</h3>
            <StateDisplay
              size="compact"
              title="No results"
              message="Try adjusting your search terms."
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Default</h3>
            <StateDisplay
              title="No notifications"
              message="You're all caught up!"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Large</h3>
            <StateDisplay
              size="large"
              title="Empty dashboard"
              message="Welcome to your new dashboard. Enroll in courses to get started."
              action={{
                text: "Find Courses",
                onClick: () => alert("Navigate to course catalog")
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateDisplayExamples;