import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import styles from './LoginPage.module.css';

// Icons
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

// Form data type must match schema exactly
type LoginFormData = {
  username: string;
  password: string;
  rememberMe: boolean; // Changed to required boolean to match schema
};

// Form validation schema
const loginSchema: yup.ObjectSchema<LoginFormData> = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
  rememberMe: yup.boolean().required().default(false)
}).required();

/**
 * Login page component with form validation and authentication
 */
export const LoginPage: React.FC = () => {
  const { login, devLogin, error: authError, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  // Initialize form with react-hook-form
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false
    }
  });

  // Handle form submission
  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    await login({
      username: data.username,
      password: data.password
    });
    
    // Remember me functionality
    if (data.rememberMe) {
      localStorage.setItem('rememberedUsername', data.username);
    } else {
      localStorage.removeItem('rememberedUsername');
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logoContainer}>
          <h1 className={styles.title}>LMS Portal</h1>
          <p className={styles.subtitle}>Log in to your account</p>
        </div>

        {/* Error alert */}
        {authError && (
          <div className={styles.errorAlert} role="alert">
            <ExclamationCircleIcon className="h-5 w-5" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* Username field */}
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Username or Email
            </label>
            <input
              id="username"
              type="text"
              {...register('username')}
              className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
              placeholder="Enter your username or email"
              disabled={isLoading}
            />
            {errors.username && (
              <p className={styles.errorText}>{errors.username.message}</p>
            )}
          </div>

          {/* Password field */}
          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <Link to="/forgot-password" className={styles.forgotPassword}>
                Forgot password?
              </Link>
            </div>
            <div className={styles.passwordContainer}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className={styles.errorText}>{errors.password.message}</p>
            )}
          </div>

          {/* Remember me checkbox */}
          <div className={styles.rememberMeContainer}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                {...register('rememberMe')}
                className={styles.checkbox}
                disabled={isLoading}
              />
              <span>Remember me</span>
            </label>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          
          {/* Development login button (for testing) */}
          {import.meta.env.DEV && (
            <button
              type="button"
              className={styles.devLoginButton}
              onClick={devLogin}
              disabled={isLoading}
            >
              Dev Login (Skip Auth)
            </button>
          )}
        </form>

        <div className={styles.registerContainer}>
          <span>Don't have an account?</span>
          <Link to="/register" className={styles.registerLink}>
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;