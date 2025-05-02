import React from 'react';
import { SkeletonLoader } from './';

/**
 * Example component showing different uses of the SkeletonLoader
 * Not for production use - for demonstration purposes only
 */
export const SkeletonLoaderExamples: React.FC = () => {
  return (
    <div className="space-y-8 p-6 bg-white">
      <div>
        <h2 className="text-xl font-semibold mb-4">Basic Skeletons</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Pulse Animation (Default)</h3>
            <div className="space-y-2">
              <SkeletonLoader width="70%" />
              <SkeletonLoader width="100%" />
              <SkeletonLoader width="85%" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Shimmer Animation</h3>
            <div className="space-y-2">
              <SkeletonLoader width="70%" animation="shimmer" />
              <SkeletonLoader width="100%" animation="shimmer" />
              <SkeletonLoader width="85%" animation="shimmer" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Color Themes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-2">Light Theme (Default)</h3>
            <SkeletonLoader count={3} gap="0.75rem" theme="light" />
          </div>
          
          <div className="p-4 border rounded-lg bg-gray-800">
            <h3 className="text-lg font-medium mb-2 text-white">Dark Theme</h3>
            <SkeletonLoader count={3} gap="0.75rem" theme="dark" />
          </div>
          
          <div className="p-4 border rounded-lg bg-avocado-50">
            <h3 className="text-lg font-medium mb-2">Avocado Theme</h3>
            <SkeletonLoader count={3} gap="0.75rem" theme="avocado" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Common UI Patterns</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Profile Card</h3>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-4">
                <SkeletonLoader variant="circle" width={48} height={48} animation="shimmer" theme="avocado" />
                <div className="ml-3 flex-1">
                  <SkeletonLoader width="50%" className="mb-1" animation="shimmer" />
                  <SkeletonLoader width="30%" height={10} animation="shimmer" />
                </div>
              </div>
              <SkeletonLoader count={3} gap="0.75rem" animation="shimmer" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Content Card</h3>
            <div className="border rounded-lg overflow-hidden">
              <SkeletonLoader variant="rectangle" height={200} borderRadius="0" animation="shimmer" theme="dark" />
              <div className="p-4">
                <SkeletonLoader width="80%" className="mb-3" />
                <SkeletonLoader count={4} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Shape Variations</h2>
        
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <span className="block text-sm mb-1">Line (Default)</span>
            <SkeletonLoader width={100} />
          </div>
          <div>
            <span className="block text-sm mb-1">Rectangle</span>
            <SkeletonLoader variant="rectangle" width={100} height={60} />
          </div>
          <div>
            <span className="block text-sm mb-1">Circle</span>
            <SkeletonLoader variant="circle" width={60} height={60} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoaderExamples;