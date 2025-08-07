import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { BookOpen, Users, FileText, Clock, Plus, TrendingUp, Calendar, Star, Eye, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Assignment } from '../../types';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getSubjectsByTeacher, assignments, submissions, students, addAssignment, subjects } = useData();
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: ''
  });
  
  if (!user || user.role !== 'teacher') return null;
  
  const teacherSubjects = getSubjectsByTeacher(user.id);
  const teacherAssignments = assignments.filter(a => 
    teacherSubjects.some(s => s.id === a.subjectId)
  );
  
  const pendingReviews = submissions.filter(s => 
    s.status === 'submitted' && 
    teacherAssignments.some(a => a.id === s.assignmentId)
  ).length;

  const handleQuickAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAssignment.title && selectedSubjectId && newAssignment.dueDate) {
      const assignment: Assignment = {
        id: `assignment${assignments.length + 1}`,
        subjectId: selectedSubjectId,
        title: newAssignment.title,
        description: newAssignment.description,
        dueDate: new Date(newAssignment.dueDate),
        createdAt: new Date()
      };
      addAssignment(assignment);
      setNewAssignment({ title: '', description: '', dueDate: '' });
      setSelectedSubjectId('');
      setShowQuickAddModal(false);
    }
  };

  const getRecentActivity = () => {
    return submissions
      .filter(s => teacherAssignments.some(a => a.id === s.assignmentId))
      .sort((a, b) => (b.submittedAt?.getTime() || 0) - (a.submittedAt?.getTime() || 0))
      .slice(0, 5);
  };

  const stats = [
    {
      title: 'Moje predmety',
      value: teacherSubjects.length,
      icon: BookOpen,
      color: 'bg-blue-500'
    },
    {
      title: 'Celkovo žiakov',
      value: teacherSubjects.reduce((acc, s) => acc + s.studentIds.length, 0),
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Aktívne úlohy',
      value: teacherAssignments.filter(a => a.dueDate > new Date()).length,
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      title: 'Čaká na hodnotenie',
      value: pendingReviews,
      icon: Clock,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Učiteľský prehľad
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Rýchle akcie</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowQuickAddModal(true)}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <Plus className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Pridať úlohu</span>
          </button>
          <Link
            to="/teacher/subjects"
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
          >
            <Eye className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Prehliadnuť predmety</span>
          </Link>
          <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <TrendingUp className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Štatistiky</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Subjects */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Moje predmety</h2>
            <Link to="/teacher/subjects" className="text-blue-600 hover:text-blue-700 text-sm">
              Zobraziť všetky
            </Link>
          </div>
          <div className="space-y-3">
            {teacherSubjects.length === 0 ? (
              <p className="text-gray-500">Nemáte priradené žiadne predmety</p>
            ) : (
              teacherSubjects.slice(0, 3).map((subject) => {
                const subjectAssignments = teacherAssignments.filter(a => a.subjectId === subject.id);
                const activeAssignments = subjectAssignments.filter(a => a.dueDate > new Date()).length;
                
                return (
                  <Link
                    key={subject.id}
                    to={`/teacher/subjects/${subject.id}`}
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{subject.name}</p>
                        <p className="text-sm text-gray-500">{subject.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{subject.studentIds.length} žiakov</p>
                        <p className="text-sm text-green-600">{activeAssignments} aktívnych úloh</p>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Na hodnotenie</h2>
            <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
              {pendingReviews}
            </span>
          </div>
          <div className="space-y-3">
            {submissions
              .filter(s => s.status === 'submitted' && teacherAssignments.some(a => a.id === s.assignmentId))
              .slice(0, 4)
              .map((submission) => {
                const assignment = assignments.find(a => a.id === submission.assignmentId);
                const student = students.find(s => s.id === submission.studentId);
                const subject = teacherSubjects.find(s => s.id === assignment?.subjectId);
                return (
                  <div key={submission.id} className="p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                    <p className="font-medium text-gray-900 text-sm">{assignment?.title}</p>
                    <p className="text-sm text-gray-600">{student?.name}</p>
                    <p className="text-xs text-blue-600">{subject?.name}</p>
                    <p className="text-xs text-gray-500">
                      {submission.submittedAt?.toLocaleDateString('sk-SK')}
                    </p>
                  </div>
                );
              })}
            {pendingReviews === 0 && (
              <div className="text-center py-4">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Všetko ohodnotené!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Najnovšia aktivita</h2>
          </div>
          <div className="space-y-3">
            {getRecentActivity().map((submission) => {
              const assignment = assignments.find(a => a.id === submission.assignmentId);
              const student = students.find(s => s.id === submission.studentId);
              return (
                <div key={`${submission.id}-activity`} className="flex items-start space-x-3">
                  <div className={`p-1 rounded-full ${
                    submission.status === 'reviewed' ? 'bg-green-100' : 
                    submission.status === 'submitted' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {submission.status === 'reviewed' ? (
                      <Star className="h-3 w-3 text-green-600" />
                    ) : (
                      <FileText className="h-3 w-3 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">
                      {student?.name} - {assignment?.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {submission.status === 'reviewed' ? 'Ohodnotené' : 'Odovzdané'} •{' '}
                      {submission.submittedAt?.toLocaleDateString('sk-SK')}
                    </p>
                  </div>
                </div>
              );
            })}
            {getRecentActivity().length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">Žiadna nedávna aktivita</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Nadchádzajúce termíny</h2>
        <div className="space-y-2">
          {teacherAssignments
            .filter(a => a.dueDate > new Date())
            .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
            .slice(0, 5)
            .map((assignment) => {
              const subject = teacherSubjects.find(s => s.id === assignment.subjectId);
              return (
                <div key={assignment.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{assignment.title}</p>
                    <p className="text-sm text-gray-500">{subject?.name}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {assignment.dueDate.toLocaleDateString('sk-SK')}
                  </p>
                </div>
              );
            })}
        </div>
      </div>

      {/* Quick Add Assignment Modal */}
      {showQuickAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Rýchle pridanie úlohy</h2>
            <form onSubmit={handleQuickAddAssignment}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Predmet
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Vyberte predmet</option>
                  {teacherSubjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Názov úlohy
                </label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Napr. Domáca úloha č. 5"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Popis (voliteľný)
                </label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Krátky popis úlohy..."
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Termín odovzdania
                </label>
                <input
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowQuickAddModal(false);
                    setNewAssignment({ title: '', description: '', dueDate: '' });
                    setSelectedSubjectId('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Zrušiť
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Pridať úlohu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};