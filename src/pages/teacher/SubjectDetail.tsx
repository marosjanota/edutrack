import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Plus, Users, FileText, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import type { Assignment, Submission } from '../../types';

export const TeacherSubjectDetail: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { user } = useAuth();
  const { subjects, students, assignments, submissions, addAssignment, updateSubmission } = useData();
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    imagePrompt: '',
    dueDate: ''
  });
  const [gradeData, setGradeData] = useState({
    score: 0,
    feedback: ''
  });

  const subject = subjects.find(s => s.id === subjectId);
  if (!subject || !user) return null;

  const subjectAssignments = assignments.filter(a => a.subjectId === subjectId);
  const subjectStudents = students.filter(s => subject.studentIds.includes(s.id));

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAssignment.title && newAssignment.description && newAssignment.dueDate) {
      const assignment: Assignment = {
        id: `assignment${assignments.length + 1}`,
        subjectId: subjectId!,
        title: newAssignment.title,
        description: newAssignment.description,
        imagePrompt: newAssignment.imagePrompt,
        dueDate: new Date(newAssignment.dueDate),
        createdAt: new Date()
      };
      addAssignment(assignment);
      setNewAssignment({ title: '', description: '', imagePrompt: '', dueDate: '' });
      setShowAddAssignment(false);
    }
  };

  const handleGradeSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubmission) {
      updateSubmission({
        ...selectedSubmission,
        status: 'reviewed',
        score: gradeData.score,
        teacherFeedback: gradeData.feedback
      });
      setShowGradeModal(false);
      setSelectedSubmission(null);
      setGradeData({ score: 0, feedback: '' });
    }
  };

  const getSubmissionStats = (assignmentId: string) => {
    const assignmentSubmissions = submissions.filter(s => s.assignmentId === assignmentId);
    const stats = {
      total: subjectStudents.length,
      submitted: assignmentSubmissions.filter(s => s.status === 'submitted' || s.status === 'reviewed').length,
      reviewed: assignmentSubmissions.filter(s => s.status === 'reviewed').length,
      pending: assignmentSubmissions.filter(s => s.status === 'submitted').length
    };
    return stats;
  };

  return (
    <div>
      <Link to="/teacher/subjects" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Späť na predmety
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{subject.name}</h1>
        <p className="text-gray-600 mt-2">{subject.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Úlohy</h2>
                <button
                  onClick={() => setShowAddAssignment(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Pridať úlohu
                </button>
              </div>
            </div>
            <div className="p-6">
              {subjectAssignments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Zatiaľ žiadne úlohy</p>
              ) : (
                <div className="space-y-4">
                  {subjectAssignments.map(assignment => {
                    const stats = getSubmissionStats(assignment.id);
                    return (
                      <div key={assignment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {assignment.dueDate.toLocaleDateString('sk-SK')}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-400" />
                            <span>{stats.submitted}/{stats.total} odovzdaných</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                            <span>{stats.reviewed} ohodnotených</span>
                          </div>
                          {stats.pending > 0 && (
                            <div className="flex items-center text-orange-600">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{stats.pending} čaká na hodnotenie</span>
                            </div>
                          )}
                        </div>

                        {stats.pending > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <button 
                              onClick={() => {
                                const pendingSubmission = submissions.find(s => 
                                  s.assignmentId === assignment.id && s.status === 'submitted'
                                );
                                if (pendingSubmission) {
                                  setSelectedSubmission(pendingSubmission);
                                  setShowGradeModal(true);
                                }
                              }}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Ohodnotiť úlohy →
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Žiaci</h2>
            <div className="space-y-3">
              {subjectStudents.map(student => (
                <div key={student.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                </div>
              ))}
              {subjectStudents.length === 0 && (
                <p className="text-gray-500 text-center py-4">Žiadni prihlásení žiaci</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAddAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Pridať novú úlohu</h2>
            <form onSubmit={handleAddAssignment}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Názov úlohy
                </label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Popis
                </label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vzorová úloha (voliteľné)
                </label>
                <input
                  type="text"
                  value={newAssignment.imagePrompt}
                  onChange={(e) => setNewAssignment({ ...newAssignment, imagePrompt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Napr. 'Napíšte písmeno A'"
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
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddAssignment(false)}
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

      {showGradeModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Ohodnotiť úlohu</h2>
            <form onSubmit={handleGradeSubmission}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hodnotenie (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gradeData.score}
                  onChange={(e) => setGradeData({ ...gradeData, score: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spätná väzba
                </label>
                <textarea
                  value={gradeData.feedback}
                  onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Napíšte spätnú väzbu pre žiaka..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowGradeModal(false);
                    setSelectedSubmission(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Zrušiť
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Ohodnotiť
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};