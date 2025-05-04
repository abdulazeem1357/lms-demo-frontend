import { Navigate } from 'react-router-dom';
import { PageTransition } from '../components/common/PageTransition';
import { LoginPage } from '../pages/Login';
import { DashboardPage } from '../pages/Dashboard';
import { ProfileSettingsPage } from '../pages/Profile';
import { MyCoursesPage } from '../pages/MyCourses';
import { CourseDetailsPage } from '../pages/CourseDetails';

// Temporarily using placeholder components for the demo
const RegisterPage = () => <div className="p-8">Register Page</div>;

export const publicRoutes = [
  {
    path: '/login',
    element: (
      <PageTransition>
        <LoginPage />
      </PageTransition>
    ),
  },
  {
    path: '/register',
    element: (
      <PageTransition>
        <RegisterPage />
      </PageTransition>
    ),
  },
];

export const protectedRoutes = [
  {
    path: '/dashboard',
    element: (
      <PageTransition>
        <DashboardPage />
      </PageTransition>
    ),
  },
  {
    path: '/courses',
    element: (
      <PageTransition>
        <MyCoursesPage />
      </PageTransition>
    ),
  },
  {
    path: '/courses/:courseId',
    element: (
      <PageTransition>
        <CourseDetailsPage />
      </PageTransition>
    ),
  },
  {
    path: '/profile',
    element: (
      <PageTransition>
        <ProfileSettingsPage />
      </PageTransition>
    ),
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" />,
  },
];