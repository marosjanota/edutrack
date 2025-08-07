import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { BookOpen, Plus, Edit2, Trash2, Users, GraduationCap, School } from 'lucide-react';
import type { Subject } from '../../types';

export const SubjectsManagement: React.FC = () => {
  const { subjects, schools, teachers, students, addSubject } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    description: '',
    schoolId: schools[0]?.id || '',
    teacherId: '',
    studentIds: [] as string[]
  });

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubject.name && newSubject.schoolId && newSubject.teacherId) {
      const subject: Subject = {
        id: `subject${subjects.length + 1}`,
        name: newSubject.name,
        description: newSubject.description,
        schoolId: newSubject.schoolId,
        teacherId: newSubject.teacherId,
        studentIds: newSubject.studentIds,
        assignmentIds: []
      };
      addSubject(subject);
      setNewSubject({
        name: '',
        description: '',
        schoolId: schools[0]?.id || '',
        teacherId: '',
        studentIds: []
      });
      setShowAddForm(false);
    }
  };

  const getAvailableTeachers = (schoolId: string) => {
    return teachers.filter(t => t.schoolId === schoolId);
  };

  const getAvailableStudents = (schoolId: string) => {
    return students.filter(s => s.schoolId === schoolId);
  };

  const handleStudentSelection = (studentId: string, isSelected: boolean) => {
    if (isSelected) {
      setNewSubject({
        ...newSubject,
        studentIds: [...newSubject.studentIds, studentId]
      });
    } else {
      setNewSubject({
        ...newSubject,
        studentIds: newSubject.studentIds.filter(id => id !== studentId)
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Správa predmetov</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Pridať predmet
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Pridať nový predmet</h2>
            <form onSubmit={handleAddSubject}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Názov predmetu
                  </label>
                  <input
                    type="text"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Škola
                  </label>
                  <select
                    value={newSubject.schoolId}
                    onChange={(e) => setNewSubject({ 
                      ...newSubject, 
                      schoolId: e.target.value,
                      teacherId: '',
                      studentIds: []
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {schools.map(school => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Popis
                </label>
                <textarea
                  value={newSubject.description}
                  onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Učiteľ
                </label>
                <select
                  value={newSubject.teacherId}
                  onChange={(e) => setNewSubject({ ...newSubject, teacherId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Vyberte učiteľa</option>
                  {getAvailableTeachers(newSubject.schoolId).map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Žiaci ({newSubject.studentIds.length} vybraných)
                </label>
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {getAvailableStudents(newSubject.schoolId).map(student => (
                    <label key={student.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={newSubject.studentIds.includes(student.id)}
                        onChange={(e) => handleStudentSelection(student.id, e.target.checked)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                    </label>
                  ))}
                  {getAvailableStudents(newSubject.schoolId).length === 0 && (
                    <p className="text-gray-500 text-sm p-2">Žiadni dostupní žiaci v tejto škole</p>
                  )}
                </div>
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
                  Pridať predmet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {subjects.map((subject) => {
          const school = schools.find(s => s.id === subject.schoolId);
          const teacher = teachers.find(t => t.id === subject.teacherId);
          const subjectStudents = students.filter(s => subject.studentIds.includes(s.id));

          return (
            <div key={subject.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start">
                    <BookOpen className="h-8 w-8 text-blue-600 mr-4 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{subject.name}</h3>
                      {subject.description && (
                        <p className="text-gray-600 mb-2">{subject.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <School className="h-4 w-4 mr-1" />
                          <span>{school?.name}</span>
                        </div>
                        <div className="flex items-center">
                          <GraduationCap className="h-4 w-4 mr-1" />
                          <span>{teacher?.name || 'Nepriradený učiteľ'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Prihlásení žiaci ({subjectStudents.length})
                    </h4>
                  </div>
                  
                  {subjectStudents.length === 0 ? (
                    <p className="text-gray-500 text-sm">Žiadni prihlásení žiaci</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {subjectStudents.map(student => (
                        <div key={student.id} className="flex items-center p-2 bg-gray-50 rounded-md">
                          <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                            <Users className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                            <p className="text-xs text-gray-500 truncate">{student.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex space-x-4">
                      <span className="text-gray-600">
                        ID predmetu: <span className="font-mono text-gray-400">{subject.id}</span>
                      </span>
                      <span className="text-gray-600">
                        Úlohy: <span className="font-medium">{subject.assignmentIds.length}</span>
                      </span>
                    </div>
                    <Link to={`/admin/subjects/${subject.id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                      Zobraziť detaily →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {subjects.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Žiadne predmety</h3>
          <p className="text-gray-500">Zatiaľ neboli vytvorené žiadne predmety.</p>
        </div>
      )}
    </div>
  );
};