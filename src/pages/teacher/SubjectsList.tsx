import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { BookOpen, Users, FileText, TrendingUp } from 'lucide-react';

export const TeacherSubjectsList: React.FC = () => {
  const { user } = useAuth();
  const { getSubjectsByTeacher, students, assignments, submissions } = useData();
  
  if (!user || user.role !== 'teacher') return null;
  
  const teacherSubjects = getSubjectsByTeacher(user.id);

  const getSubjectStats = (subjectId: string, studentIds: string[]) => {
    const subjectAssignments = assignments.filter(a => a.subjectId === subjectId);
    const totalSubmissions = submissions.filter(s => 
      subjectAssignments.some(a => a.id === s.assignmentId)
    );
    
    return {
      studentCount: studentIds.length,
      assignmentCount: subjectAssignments.length,
      submissionCount: totalSubmissions.length,
      pendingReviews: totalSubmissions.filter(s => s.status === 'submitted').length
    };
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Moje predmety</h1>
      
      {teacherSubjects.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Žiadne predmety</h3>
          <p className="text-gray-500">Momentálne nemáte priradené žiadne predmety.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teacherSubjects.map((subject) => {
            const stats = getSubjectStats(subject.id, subject.studentIds);
            
            return (
              <Link
                key={subject.id}
                to={`/teacher/subjects/${subject.id}`}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
              >
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
                  {stats.pendingReviews > 0 && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                      {stats.pendingReviews} na hodnotenie
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Žiaci</p>
                      <p className="text-xl font-bold text-gray-900">{stats.studentCount}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-purple-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Úlohy</p>
                      <p className="text-xl font-bold text-gray-900">{stats.assignmentCount}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {stats.submissionCount} odovzdaní celkom
                    </span>
                    <span className="text-blue-600 font-medium text-sm">
                      Zobraziť detail →
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