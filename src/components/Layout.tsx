import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, School, User, BookOpen, Home } from 'lucide-react';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        return [
          { to: '/admin', label: 'Dashboard', icon: Home },
          { to: '/admin/schools', label: 'Školy', icon: School },
          { to: '/admin/users', label: 'Používatelia', icon: User },
          { to: '/admin/subjects', label: 'Predmety', icon: BookOpen }
        ];
      case 'teacher':
        return [
          { to: '/teacher', label: 'Dashboard', icon: Home },
          { to: '/teacher/subjects', label: 'Predmety', icon: BookOpen }
        ];
      case 'student':
        return [
          { to: '/student', label: 'Dashboard', icon: Home },
          { to: '/student/subjects', label: 'Predmety', icon: BookOpen }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <School className="h-8 w-8 text-blue-600 mr-2" />
                <span className="text-xl font-bold text-gray-900">EduTrack</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                {getNavItems().map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">{user.name}</p>
                  <p className="text-gray-500 text-xs">
                    {user.role === 'admin' ? 'Administrátor' : 
                     user.role === 'teacher' ? 'Učiteľ' : 'Žiak'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};