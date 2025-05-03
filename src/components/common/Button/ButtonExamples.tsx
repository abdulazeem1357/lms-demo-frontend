import React from 'react';
import { Button } from './';
import { ArrowRightIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

/**
 * Example component showing different configurations of the Button component
 * Not for production use - for demonstration purposes only
 */
export const ButtonExamples: React.FC = () => {
  return (
    <div className="space-y-8 p-6 bg-white">
      <div>
        <h2 className="text-xl font-semibold mb-4">Button Variants</h2>
        
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="error">Error</Button>
          <Button variant="info">Info</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link Button</Button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Button Sizes</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Button with Icons</h2>
        
        <div className="flex flex-wrap gap-3">
          <Button startIcon={<PlusIcon className="w-4 h-4" />}>Add Item</Button>
          <Button endIcon={<ArrowRightIcon className="w-4 h-4" />}>Next Step</Button>
          <Button 
            variant="error" 
            startIcon={<TrashIcon className="w-4 h-4" />}
          >
            Delete
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Button States</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Loading State</h3>
            <div className="flex gap-3">
              <Button isLoading>Loading</Button>
              <Button variant="secondary" isLoading>Processing</Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Disabled State</h3>
            <div className="flex gap-3">
              <Button disabled>Disabled</Button>
              <Button variant="secondary" disabled>Inactive</Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Full Width & Rounded</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Full Width Button</h3>
            <Button fullWidth>Submit Form</Button>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Rounded Button</h3>
            <div className="flex gap-3">
              <Button rounded>Rounded</Button>
              <Button variant="secondary" rounded>Pill</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonExamples;