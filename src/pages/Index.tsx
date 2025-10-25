import { useState, useEffect } from 'react';
import LandingPage from '@/components/LandingPage';
import JobSeekerDashboard from '@/components/JobSeekerDashboard';
import EmployerDashboard from '@/components/EmployerDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import RegistrationModal from '@/components/RegistrationModal';

type UserRole = 'guest' | 'jobseeker' | 'employer' | 'admin';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone?: string;
  bio?: string;
  resume_url?: string;
  profile_photo_url?: string;
  experience_years?: number;
  current_position?: string;
  city_id?: number;
  country_id?: number;
  company_id?: number;
  active?: boolean;
}

const Index = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('guest');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setCurrentRole(user.role);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('https://functions.poehali.dev/a380f7fd-d9c8-4fab-8463-efa282a9e0ed?email=' + email);
      if (!response.ok) {
        throw new Error('User not found');
      }
      const userData = await response.json();
      
      setCurrentUser(userData);
      setCurrentRole(userData.role);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const handleRegister = async (userData: any) => {
    try {
      const response = await fetch('https://functions.poehali.dev/a380f7fd-d9c8-4fab-8463-efa282a9e0ed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }
      
      const newUser = await response.json();
      setCurrentUser(newUser);
      setCurrentRole(newUser.role);
      setIsAuthenticated(true);
      setShowRegistration(false);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const handleLogout = () => {
    setCurrentRole('guest');
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  if (!isAuthenticated) {
    return (
      <>
        <LandingPage 
          onLogin={handleLogin}
          onShowRegistration={() => setShowRegistration(true)}
        />
        <RegistrationModal
          isOpen={showRegistration}
          onClose={() => setShowRegistration(false)}
          onRegister={handleRegister}
        />
      </>
    );
  }

  if (currentRole === 'jobseeker') {
    return <JobSeekerDashboard onLogout={handleLogout} user={currentUser} />;
  }

  if (currentRole === 'employer') {
    return <EmployerDashboard onLogout={handleLogout} user={currentUser} />;
  }

  if (currentRole === 'admin') {
    return <AdminDashboard onLogout={handleLogout} user={currentUser} />;
  }

  return <LandingPage onLogin={handleLogin} onShowRegistration={() => setShowRegistration(true)} />;
};

export default Index;
