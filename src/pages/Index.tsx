import { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import JobSeekerDashboard from '@/components/JobSeekerDashboard';
import EmployerDashboard from '@/components/EmployerDashboard';
import AdminDashboard from '@/components/AdminDashboard';

type UserRole = 'guest' | 'jobseeker' | 'employer' | 'admin';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  description?: string;
  avatar_url?: string;
}

const Index = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('guest');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = async (role: UserRole, email?: string) => {
    if (email) {
      try {
        const response = await fetch('https://functions.poehali.dev/f4961bee-b238-442a-9417-71b671fade9f', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'login', email })
        });
        const userData = await response.json();
        setCurrentUser(userData);
        setCurrentRole(userData.role);
      } catch (error) {
        console.error('Login error:', error);
      }
    } else {
      setCurrentRole(role);
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentRole('guest');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

  switch (currentRole) {
    case 'jobseeker':
      return <JobSeekerDashboard onLogout={handleLogout} user={currentUser} />;
    case 'employer':
      return <EmployerDashboard onLogout={handleLogout} user={currentUser} />;
    case 'admin':
      return <AdminDashboard onLogout={handleLogout} user={currentUser} />;
    default:
      return <LandingPage onLogin={handleLogin} />;
  }
};

export default Index;