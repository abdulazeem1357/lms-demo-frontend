import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';

// Services - using unified service module
import { updateUserProfile } from '../../../services/user';

// Components
import { Spinner } from '../../../components/common/Spinner';

// Types
import { IUser } from '../../../types/user.types';

// Styles
import styles from '../ProfileSettingsPage.module.css';

interface ProfileTabProps {
  profileData?: IUser;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

// Form validation schema
const profileSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  username: yup.string().required('Username is required'),
  email: yup.string().email('Email must be valid').required('Email is required'),
}).required();

/**
 * Profile information tab for viewing and editing user details
 */
const ProfileTab: React.FC<ProfileTabProps> = ({ profileData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  
  // Initialize form with react-hook-form
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset 
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: profileData?.firstName || '',
      lastName: profileData?.lastName || '',
      username: profileData?.username || '',
      email: profileData?.email || '',
    }
  });

  // Update profile mutation
  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setIsEditing(false);
    },
  });

  // Handle form submission
  const onSubmit: SubmitHandler<ProfileFormData> = (data) => {
    updateProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
    });
  };

  // Cancel editing and reset form
  const handleCancel = () => {
    reset({
      firstName: profileData?.firstName || '',
      lastName: profileData?.lastName || '',
      username: profileData?.username || '',
      email: profileData?.email || '',
    });
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.fadeIn}
    >
      <h2 className="text-2xl font-heading font-semibold text-neutral-800 mb-6">Profile Information</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name field */}
          <div className={styles.formGroup}>
            <label htmlFor="firstName" className={styles.formLabel}>
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              disabled={!isEditing}
              className={`${styles.formInput} ${
                errors.firstName ? 'border-error' : ''
              } ${!isEditing ? 'bg-neutral-50' : ''}`}
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-error">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name field */}
          <div className={styles.formGroup}>
            <label htmlFor="lastName" className={styles.formLabel}>
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              disabled={!isEditing}
              className={`${styles.formInput} ${
                errors.lastName ? 'border-error' : ''
              } ${!isEditing ? 'bg-neutral-50' : ''}`}
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-error">{errors.lastName.message}</p>
            )}
          </div>

          {/* Username field */}
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.formLabel}>
              Username
            </label>
            <input
              id="username"
              type="text"
              disabled={!isEditing}
              className={`${styles.formInput} ${
                errors.username ? 'border-error' : ''
              } ${!isEditing ? 'bg-neutral-50' : ''}`}
              {...register('username')}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-error">{errors.username.message}</p>
            )}
          </div>

          {/* Email field (read-only) */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              Email
            </label>
            <input
              id="email"
              type="email"
              disabled={true}
              className={`${styles.formInput} bg-neutral-50`}
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error">{errors.email.message}</p>
            )}
            <p className="mt-1 text-xs text-neutral-500">
              Email address cannot be changed. Please contact support if needed.
            </p>
          </div>
        </div>

        {/* Role & Registration info */}
        <div className="mt-4 p-4 bg-neutral-50 rounded-lg border border-neutral-100">
          <div className="flex flex-wrap gap-y-4 gap-x-8">
            <div>
              <h4 className="text-sm font-medium text-neutral-500">Role</h4>
              <p className="text-neutral-800">{profileData?.role || 'Student'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-neutral-500">Account Created</h4>
              <p className="text-neutral-800">
                {profileData?.createdAt
                  ? new Date(profileData.createdAt).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-neutral-500">Last Updated</h4>
              <p className="text-neutral-800">
                {profileData?.updatedAt
                  ? new Date(profileData.updatedAt).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          {isEditing ? (
            <>
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:bg-primary-300"
              >
                {isPending ? (
                  <span className="flex items-center">
                    <Spinner size="sm" color="white" className="mr-2" />
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default ProfileTab;