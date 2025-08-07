import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { 
  ArrowLeft, 
  Edit2, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Users, 
  FileText, 
  Calendar,
  School,
  GraduationCap,
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import type { Subject } from '../../types';

export const AdminSubjectDetail: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { 
    subjects, 
    schools, 
    teachers, 
    students, 
    assignments, 
    submissions,
    getAssignmentsBySubject 
  } = useData();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [editedSubject, setEditedSubject] = useState<Partial<Subject>>({});

  const subject = subjects.find(s => s.id === subjectId);
  if (!subject) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Predmet nenájdený</h3>
        <Link to="/admin/subjects" className="text-blue-600 hover:text-blue-700">
          ← Späť na zoznam predmetov
        </Link>
      </div>
    );
  }

  const school = schools.find(s => s.id === subject.schoolId);
  const teacher = teachers.find(t => t.id === subject.teacherId);
  const subjectStudents = students.filter(s => subject.studentIds.includes(s.id));
  const subjectAssignments = getAssignmentsBySubject(subject.id);
  const availableStudents = students.filter(s => 
    s.schoolId === subject.schoolId && !subject.studentIds.includes(s.id)
  );

  const handleEditStart = () => {
    setEditedSubject({
      name: subject.name,
      description: subject.description
    });
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setEditedSubject({});
    setIsEditing(false);
  };

  const handleEditSave = () => {
    // Tu by sa volalo API na uloženie zmien
    console.log('Saving changes:', editedSubject);
    setIsEditing(false);
    // V reálnej aplikácii by sa tu aktualizoval kontext
  };

  const getAssignmentStats = () => {
    const now = new Date();
    let active = 0;
    let completed = 0;
    let overdue = 0;
    let totalSubmissions = 0;
    let pendingReviews = 0;

    subjectAssignments.forEach(assignment => {
      const assignmentSubmissions = submissions.filter(s => s.assignmentId === assignment.id);
      totalSubmissions += assignmentSubmissions.length;
      pendingReviews += assignmentSubmissions.filter(s => s.status === 'submitted').length;

      if (assignment.dueDate > now) {
        active++;
      } else if (assignmentSubmissions.some(s => s.status === 'reviewed')) {
        completed++;
      } else {
        overdue++;
      }
    });

    return { active, completed, overdue, totalSubmissions, pendingReviews };
  };

  const assignmentStats = getAssignmentStats();

  const getSubmissionStatusForAssignment = (assignmentId: string) => {
    const assignmentSubmissions = submissions.filter(s => s.assignmentId === assignmentId);
    const total = subjectStudents.length;
    const submitted = assignmentSubmissions.filter(s => s.status === 'submitted' || s.status === 'reviewed').length;
    const reviewed = assignmentSubmissions.filter(s => s.status === 'reviewed').length;
    
    return { total, submitted, reviewed, pending: submitted - reviewed };
  };

  return (
    <div>
      <Link to="/admin/subjects" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Späť na predmety
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <BookOpen className="h-10 w-10 text-blue-600 mr-4 mt-1" />
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editedSubject.name || ''}
                    onChange={(e) => setEditedSubject({ ...editedSubject, name: e.target.value })}
                    className="text-2xl font-bold bg-white border border-gray-300 rounded px-3 py-2 w-full"
                  />
                  <textarea
                    value={editedSubject.description || ''}
                    onChange={(e) => setEditedSubject({ ...editedSubject, description: e.target.value })}
                    className="text-gray-600 bg-white border border-gray-300 rounded px-3 py-2 w-full"
                    rows={2}
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{subject.name}</h1>
                  <p className="text-gray-600 mb-3">{subject.description}</p>
                </div>
              )}
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <School className="h-4 w-4 mr-1" />
                  <span>{school?.name}</span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  <span>{teacher?.name || 'Nepriradený učiteľ'}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{subjectStudents.length} žiakov</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleEditSave}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Uložiť
                </button>
                <button
                  onClick={handleEditCancel}
                  className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X className="h-4 w-4 mr-1" />
                  Zrušiť
                </button>
              </>
            ) : (
              <button
                onClick={handleEditStart}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit2 className="h-4 w-4 mr-1" />
                Editovať
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Aktívne úlohy</p>
              <p className="text-2xl font-bold text-blue-600">{assignmentStats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Dokončené</p>
              <p className="text-2xl font-bold text-green-600">{assignmentStats.completed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Na hodnotenie</p>
              <p className="text-2xl font-bold text-orange-600">{assignmentStats.pendingReviews}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Po termíne</p>
              <p className="text-2xl font-bold text-red-600">{assignmentStats.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Úlohy ({subjectAssignments.length})</h2>
            </div>
            <div className="p-6">
              {subjectAssignments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Zatiaľ žiadne úlohy</p>
              ) : (
                <div className="space-y-4">
                  {subjectAssignments.map(assignment => {
                    const submissionStatus = getSubmissionStatusForAssignment(assignment.id);
                    const isOverdue = assignment.dueDate < new Date();
                    
                    return (
                      <div key={assignment.id} className={`border rounded-lg p-4 ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-sm text-gray-500 mb-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              {assignment.dueDate.toLocaleDateString('sk-SK')}
                              {isOverdue && <span className="ml-2 text-red-600 font-medium">(Po termíne)</span>}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Odovzdané: </span>
                            <span className="font-medium">{submissionStatus.submitted}/{submissionStatus.total}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Ohodnotené: </span>
                            <span className="font-medium text-green-600">{submissionStatus.reviewed}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Čaká: </span>
                            <span className="font-medium text-orange-600">{submissionStatus.pending}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Students */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Žiaci ({subjectStudents.length})</h2>
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Pridať
                </button>
              </div>
            </div>
            <div className="p-6">
              {subjectStudents.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Žiadni prihlásení žiaci</p>
              ) : (
                <div className="space-y-3">
                  {subjectStudents.map(student => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <Users className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                      <button className="text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Pridať žiakov do predmetu</h2>
            <div className="max-h-64 overflow-y-auto">
              {availableStudents.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Žiadni dostupní žiaci</p>
              ) : (
                availableStudents.map(student => (
                  <label key={student.id} className="flex items-center p-3 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Zrušiť
              </button>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Pridať vybraných
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};