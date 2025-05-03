import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';

// Services - using unified service module
import { changePassword } from '../../../services/user';

// Components
import { Spinner } from '../../../components/common/Spinner';

// Styles
import styles from '../ProfileSettingsPage.module.css';

// Icons
import { ShieldCheckIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface SecurityFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Form validation schema with password requirements
const securitySchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: yup.string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
}).required();

/**
 * Security tab for password management
 */
const SecurityTab: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize form with react-hook-form
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset,
    watch
  } = useForm<SecurityFormData>({
    resolver: yupResolver(securitySchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  // Password change mutation
  const { mutate: updatePassword, isPending } = useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => 
      changePassword(currentPassword, newPassword),
    onSuccess: () => {
      // Show success message and reset form
      setSuccessMessage('Password successfully changed');
      setErrorMessage(null);
      reset();
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    },
    onError: (error) => {
      // Show error message
      setErrorMessage(error instanceof Error ? error.message : 'Failed to change password');
      setSuccessMessage(null);
    }
  });

  // Handle form submission
  const onSubmit: SubmitHandler<SecurityFormData> = (data) => {
    updatePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  // Password requirements list with validation
  const passwordRequirements = [
    { text: 'At least 8 characters', test: (pw: string) => pw.length >= 8 },
    { text: 'At least one uppercase letter', test: (pw: string) => /[A-Z]/.test(pw) },
    { text: 'At least one lowercase letter', test: (pw: string) => /[a-z]/.test(pw) },
    { text: 'At least one number', test: (pw: string) => /[0-9]/.test(pw) },
    { text: 'At least one special character', test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.fadeIn}
    >
      <h2 className="text-2xl font-heading font-semibold text-neutral-800 mb-2">Security</h2>
      <p className="text-neutral-600 mb-6">Manage your password and account security</p>

      {/* Success message */}
      {successMessage && (
        <div className="mb-6 p-4 flex items-center bg-green-50 border border-green-200 rounded-lg text-green-700">
          <CheckCircleIcon className="w-5 h-5 mr-2" />
          {successMessage}
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="mb-6 p-4 flex items-center bg-red-50 border border-red-200 rounded-lg text-red-700">
          <ShieldCheckIcon className="w-5 h-5 mr-2" />
          {errorMessage}
        </div>
      )}

      {/* Password change form */}
      <div className="max-w-lg">
        <h3 className="text-lg font-medium text-neutral-800 mb-4">Change Password</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Current Password field */}
          <div className={styles.formGroup}>
            <label htmlFor="currentPassword" className={styles.formLabel}>
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              className={`${styles.formInput} ${errors.currentPassword ? 'border-error' : ''}`}
              {...register('currentPassword')}
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-error">{errors.currentPassword.message}</p>
            )}
          </div>

          {/* New Password field */}
          <div className={styles.formGroup}>
            <label htmlFor="newPassword" className={styles.formLabel}>
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              className={`${styles.formInput} ${errors.newPassword ? 'border-error' : ''}`}
              {...register('newPassword')}
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-error">{errors.newPassword.message}</p>
            )}

            {/* Password requirements list */}
            <div className="mt-3">
              <p className="text-xs font-medium text-neutral-600 mb-2">Password must include:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {passwordRequirements.map((req, index) => (
                  <li 
                    key={index}
                    className={`text-xs flex items-center ${
                      req.test(watch('newPassword') || '')
                        ? 'text-green-600'
                        : 'text-neutral-500'
                    }`}
                  >
                    <CheckCircleIcon className={`w-4 h-4 mr-1 ${
                      req.test(watch('newPassword') || '') ? 'opacity-100' : 'opacity-50'
                    }`} />
                    {req.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Confirm Password field */}
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.formLabel}>
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`${styles.formInput} ${errors.confirmPassword ? 'border-error' : ''}`}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-error">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isPending}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:bg-primary-300"
          >
            {isPending ? (
              <span className="flex items-center">
                <Spinner size="sm" color="white" className="mr-2" />
                Updating...
              </span>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>

      {/* Account security section */}
      <div className="mt-12 border-t border-neutral-200 pt-8">
        <h3 className="text-lg font-medium text-neutral-800 mb-4">Account Security</h3>
        
        <div className="bg-neutral-50 rounded-lg border border-neutral-100 p-4">
          <div className="flex items-start">
            <ShieldCheckIcon className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-neutral-800">Last login</h4>
              <p className="text-sm text-neutral-600">
                Today at {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SecurityTab;