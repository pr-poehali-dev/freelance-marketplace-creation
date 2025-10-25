import { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import JobSeekerDashboard from '@/components/JobSeekerDashboard';
import EmployerDashboard from '@/components/EmployerDashboard';
import AdminDashboard from '@/components/AdminDashboard';

type UserRole = 'guest' | 'jobseeker' | 'employer' | 'admin';

const Index = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('guest');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (role: UserRole) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentRole('guest');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

  switch (currentRole) {
    case 'jobseeker':
      return <JobSeekerDashboard onLogout={handleLogout} />;
    case 'employer':
      return <EmployerDashboard onLogout={handleLogout} />;
    case 'admin':
      return <AdminDashboard onLogout={handleLogout} />;
    default:
      return <LandingPage onLogin={handleLogin} />;
  }
};

export default Index;