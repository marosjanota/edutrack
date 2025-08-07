import React from 'react';
import { useData } from '../../contexts/DataContext';
import { School, Users, BookOpen, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { schools, teachers, students, subjects } = useData();

  const stats = [
    {
      title: 'Školy',
      value: schools.length,
      icon: School,
      color: 'bg-blue-500',
      link: '/admin/schools'
    },
    {
      title: 'Učitelia',
      value: teachers.length,
      icon: Users,
      color: 'bg-green-500',
      link: '/admin/users'
    },
    {
      title: 'Žiaci',
      value: students.length,
      icon: Users,
      color: 'bg-purple-500',
      link: '/admin/users'
    },
    {
      title: 'Predmety',
      value: subjects.length,
      icon: BookOpen,
      color: 'bg-orange-500',
      link: '/admin/subjects'
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Administrátorský prehľad
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              to={stat.link}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Najnovšie školy</h2>
            <Link to="/admin/schools" className="text-blue-600 hover:text-blue-700 text-sm">
              Zobraziť všetky
            </Link>
          </div>
          <div className="space-y-3">
            {schools.slice(0, 3).map((school) => (
              <div key={school.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{school.name}</p>
                  <p className="text-sm text-gray-500">{school.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{school.teacherIds.length} učiteľov</p>
                  <p className="text-sm text-gray-600">{school.studentIds.length} žiakov</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Rýchle akcie</h2>
          </div>
          <div className="space-y-2">
            <Link
              to="/admin/schools/new"
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <School className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-gray-700">Pridať novú školu</span>
            </Link>
            <Link
              to="/admin/users/new?role=teacher"
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-5 w-5 text-green-600 mr-3" />
              <span className="text-gray-700">Pridať nového učiteľa</span>
            </Link>
            <Link
              to="/admin/users/new?role=student"
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-5 w-5 text-purple-600 mr-3" />
              <span className="text-gray-700">Pridať nového žiaka</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Systémová aktivita</h2>
        <div className="flex items-center justify-center py-8 text-gray-500">
          <TrendingUp className="h-8 w-8 mr-2" />
          <span>Štatistiky aktivity budú dostupné v ďalšej verzii</span>
        </div>
      </div>
    </div>
  );
};