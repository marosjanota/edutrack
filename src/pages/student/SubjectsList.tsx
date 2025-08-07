import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { BookOpen, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

export const StudentSubjectsList: React.FC = () => {
  const { user } = useAuth();
  const { getSubjectsByStudent, assignments, getSubmissionByAssignmentAndStudent } = useData();
  
  if (!user || user.role !== 'student') return null;
  
  const studentSubjects = getSubjectsByStudent(user.id);

  const getSubjectProgress = (subjectId: string) => {
    const subjectAssignments = assignments.filter(a => a.subjectId === subjectId);
    let completed = 0;
    let inProgress = 0;
    let overdue = 0;
    const now = new Date();

    subjectAssignments.forEach(assignment => {
      const submission = getSubmissionByAssignmentAndStudent(assignment.id, user.id);
      
      if (submission?.status === 'reviewed') {
        completed++;
      } else if (submission?.status === 'submitted' || submission?.status === 'in_progress') {
        inProgress++;
      } else if (assignment.dueDate < now) {
        overdue++;
      }
    });

    return {
      total: subjectAssignments.length,
      completed,
      inProgress,
      overdue,
      upcoming: subjectAssignments.filter(a => 
        a.dueDate > now && !getSubmissionByAssignmentAndStudent(a.id, user.id)
      ).length
    };
  };

  const getNextDeadline = (subjectId: string) => {
    const subjectAssignments = assignments.filter(a => a.subjectId === subjectId);
    const now = new Date();
    
    const upcomingAssignments = subjectAssignments
      .filter(a => {
        const submission = getSubmissionByAssignmentAndStudent(a.id, user.id);
        return a.dueDate > now && (!submission || submission.status === 'not_started');
      })
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

    return upcomingAssignments[0] || null;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Moje predmety</h1>
      
      {studentSubjects.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Žiadne predmety</h3>
          <p className="text-gray-500">Momentálne nie ste prihlásený na žiadne predmety.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentSubjects.map((subject) => {
            const progress = getSubjectProgress(subject.id);
            const nextDeadline = getNextDeadline(subject.id);
            const progressPercentage = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
            
            return (
              <Link
                key={subject.id}
                to={`/student/subjects/${subject.id}`}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                        {subject.description && (
                          <p className="text-sm text-gray-500 mt-1">{subject.description}</p>
                        )}
                      </div>
                    </div>
                    {progress.overdue > 0 && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                        {progress.overdue} po termíne
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Pokrok</span>
                      <span>{progress.completed}/{progress.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Status Cards */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Dokončené</p>
                      <p className="text-lg font-bold text-green-600">{progress.completed}</p>
                    </div>
                    <div className="text-center">
                      <Clock className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">V procese</p>
                      <p className="text-lg font-bold text-yellow-600">{progress.inProgress}</p>
                    </div>
                    <div className="text-center">
                      <AlertCircle className="h-5 w-5 text-red-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Po termíne</p>
                      <p className="text-lg font-bold text-red-600">{progress.overdue}</p>
                    </div>
                  </div>

                  {/* Next Deadline */}
                  {nextDeadline && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">{nextDeadline.title}</p>
                          <p className="text-xs text-blue-600">
                            Termín: {nextDeadline.dueDate.toLocaleDateString('sk-SK')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t">
                    <span className="text-blue-600 font-medium text-sm">
                      Zobraziť úlohy →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};