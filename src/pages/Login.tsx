import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { School, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Nesprávne prihlasovacie údaje');
    }
  };

  const handleQuickLogin = (email: string) => {
    setEmail(email);
    setPassword('demo');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <School className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            EduTrack
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Prihláste sa do systému
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="meno@edutrack.sk"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Heslo
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Prihlásiť sa
          </button>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo účty</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@edutrack.sk')}
                className="w-full text-left px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50 text-sm"
              >
                <span className="font-medium">Admin:</span> admin@edutrack.sk
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('teacher@edutrack.sk')}
                className="w-full text-left px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50 text-sm"
              >
                <span className="font-medium">Učiteľ:</span> teacher@edutrack.sk
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('student@edutrack.sk')}
                className="w-full text-left px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50 text-sm"
              >
                <span className="font-medium">Žiak:</span> student@edutrack.sk
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500 text-center">
              Heslo pre všetky demo účty: demo
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};