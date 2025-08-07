import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { BookOpen, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getSubjectsByStudent, assignments, getSubmissionByAssignmentAndStudent } = useData();
  
  if (!user || user.role !== 'student') return null;
  
  const studentSubjects = getSubjectsByStudent(user.id);
  const studentAssignments = assignments.filter(a => 
    studentSubjects.some(s => s.assignmentIds.includes(a.id))
  );

  const getSubmissionStats = () => {
    let notStarted = 0;
    let inProgress = 0;
    let submitted = 0;
    let reviewed = 0;

    studentAssignments.forEach(assignment => {
      const submission = getSubmissionByAssignmentAndStudent(assignment.id, user.id);
      if (!submission || submission.status === 'not_started') notStarted++;
      else if (submission.status === 'in_progress') inProgress++;
      else if (submission.status === 'submitted') submitted++;
      else if (submission.status === 'reviewed') reviewed++;
    });

    return { notStarted, inProgress, submitted, reviewed };
  };

  const stats = getSubmissionStats();

  const statCards = [
    {
      title: 'Moje predmety',
      value: studentSubjects.length,
      icon: BookOpen,
      color: 'bg-blue-500'
    },
    {
      title: 'Nezačaté úlohy',
      value: stats.notStarted,
      icon: AlertCircle,
      color: 'bg-gray-500'
    },
    {
      title: 'Rozpracované',
      value: stats.inProgress,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Ohodnotené',
      value: stats.reviewed,
      icon: CheckCircle,
      color: 'bg-green-500'
    }
  ];

  const getStatusBadge = (assignment: any) => {
    const submission = getSubmissionByAssignmentAndStudent(assignment.id, user.id);
    
    if (!submission || submission.status === 'not_started') {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Nezačaté</span>;
    }
    if (submission.status === 'in_progress') {
      return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">Rozpracované</span>;
    }
    if (submission.status === 'submitted') {
      return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">Odovzdané</span>;
    }
    if (submission.status === 'reviewed') {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
          Ohodnotené ({submission.score}%)
        </span>
      );
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Môj prehľad
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Moje predmety</h2>
            <Link to="/student/subjects" className="text-blue-600 hover:text-blue-700 text-sm">
              Zobraziť všetky
            </Link>
          </div>
          <div className="space-y-3">
            {studentSubjects.length === 0 ? (
              <p className="text-gray-500">Nie ste prihlásený na žiadne predmety</p>
            ) : (
              studentSubjects.map((subject) => {
                const subjectAssignments = assignments.filter(a => a.subjectId === subject.id);
                const completedCount = subjectAssignments.filter(a => {
                  const sub = getSubmissionByAssignmentAndStudent(a.id, user.id);
                  return sub?.status === 'reviewed';
                }).length;

                return (
                  <Link
                    key={subject.id}
                    to={`/student/subjects/${subject.id}`}
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{subject.name}</p>
                        <p className="text-sm text-gray-500">{subject.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {completedCount}/{subjectAssignments.length} dokončených
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Aktuálne úlohy</h2>
          </div>
          <div className="space-y-3">
            {studentAssignments
              .filter(a => a.dueDate > new Date())
              .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
              .slice(0, 5)
              .map((assignment) => {
                const subject = studentSubjects.find(s => s.id === assignment.subjectId);
                return (
                  <div key={assignment.id} className="p-3 rounded-lg border">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-gray-900">{assignment.title}</p>
                      {getStatusBadge(assignment)}
                    </div>
                    <p className="text-sm text-gray-600">{subject?.name}</p>
                    <p className="text-xs text-gray-500">
                      Termín: {assignment.dueDate.toLocaleDateString('sk-SK')}
                    </p>
                  </div>
                );
              })}
            {studentAssignments.filter(a => a.dueDate > new Date()).length === 0 && (
              <p className="text-gray-500">Žiadne aktuálne úlohy</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Posledné hodnotenia</h2>
        <div className="space-y-2">
          {studentAssignments
            .filter(a => {
              const sub = getSubmissionByAssignmentAndStudent(a.id, user.id);
              return sub?.status === 'reviewed';
            })
            .slice(0, 5)
            .map((assignment) => {
              const submission = getSubmissionByAssignmentAndStudent(assignment.id, user.id);
              const subject = studentSubjects.find(s => s.id === assignment.subjectId);
              return (
                <div key={assignment.id} className="flex justify-between items-center py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{assignment.title}</p>
                    <p className="text-sm text-gray-500">{subject?.name}</p>
                    {submission?.teacherFeedback && (
                      <p className="text-sm text-gray-600 mt-1">"{submission.teacherFeedback}"</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{submission?.score}%</p>
                  </div>
                </div>
              );
            })}
          {stats.reviewed === 0 && (
            <p className="text-gray-500">Zatiaľ žiadne hodnotenia</p>
          )}
        </div>
      </div>
    </div>
  );
};