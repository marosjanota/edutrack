import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { School, Plus, Edit2, Trash2, Users, BookOpen } from 'lucide-react';
import type { School as SchoolType } from '../../types';

export const SchoolsManagement: React.FC = () => {
  const { schools, teachers, students, addSchool } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSchool, setNewSchool] = useState({ name: '', address: '' });

  const handleAddSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSchool.name) {
      const school: SchoolType = {
        id: `school${schools.length + 1}`,
        name: newSchool.name,
        address: newSchool.address,
        teacherIds: [],
        studentIds: []
      };
      addSchool(school);
      setNewSchool({ name: '', address: '' });
      setShowAddForm(false);
    }
  };

  const getSchoolStats = (school: SchoolType) => {
    const teacherCount = teachers.filter(t => school.teacherIds.includes(t.id)).length;
    const studentCount = students.filter(s => school.studentIds.includes(s.id)).length;
    return { teacherCount, studentCount };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Správa škôl</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Pridať školu
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Pridať novú školu</h2>
            <form onSubmit={handleAddSchool}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Názov školy
                </label>
                <input
                  type="text"
                  value={newSchool.name}
                  onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresa
                </label>
                <input
                  type="text"
                  value={newSchool.address}
                  onChange={(e) => setNewSchool({ ...newSchool, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Zrušiť
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Pridať
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.map((school) => {
          const stats = getSchoolStats(school);
          return (
            <div key={school.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <School className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
                      {school.address && (
                        <p className="text-sm text-gray-500">{school.address}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Učitelia</p>
                      <p className="text-xl font-bold text-gray-900">{stats.teacherCount}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-purple-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Žiaci</p>
                      <p className="text-xl font-bold text-gray-900">{stats.studentCount}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Zobraziť detaily →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};