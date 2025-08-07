import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Upload, Eye, FileText, Calendar, CheckCircle, Clock, AlertCircle, Star } from 'lucide-react';
import type { Assignment, Submission } from '../../types';

export const StudentSubjectDetail: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { user } = useAuth();
  const { subjects, assignments, getSubmissionByAssignmentAndStudent, updateSubmission } = useData();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const subject = subjects.find(s => s.id === subjectId);
  if (!subject || !user) return null;

  const subjectAssignments = assignments.filter(a => a.subjectId === subjectId);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmitAssignment = () => {
    if (selectedAssignment && uploadedFile) {
      const existingSubmission = getSubmissionByAssignmentAndStudent(selectedAssignment.id, user.id);
      
      const submission: Submission = {
        id: existingSubmission?.id || `submission${Date.now()}`,
        assignmentId: selectedAssignment.id,
        studentId: user.id,
        uploadedImage: `mock_${uploadedFile.name}`, // Mock upload
        submittedAt: new Date(),
        status: 'submitted'
      };

      updateSubmission(submission);
      setShowUploadModal(false);
      setSelectedAssignment(null);
      setUploadedFile(null);
    }
  };

  const getAssignmentStatus = (assignment: Assignment) => {
    const submission = getSubmissionByAssignmentAndStudent(assignment.id, user.id);
    
    if (!submission || submission.status === 'not_started') {
      return {
        status: 'not_started' as const,
        label: 'Nezačaté',
        color: 'bg-gray-100 text-gray-600',
        icon: AlertCircle
      };
    }
    
    if (submission.status === 'in_progress') {
      return {
        status: 'in_progress' as const,
        label: 'Rozpracované',
        color: 'bg-yellow-100 text-yellow-600',
        icon: Clock
      };
    }
    
    if (submission.status === 'submitted') {
      return {
        status: 'submitted' as const,
        label: 'Odovzdané',
        color: 'bg-blue-100 text-blue-600',
        icon: CheckCircle
      };
    }
    
    if (submission.status === 'reviewed') {
      return {
        status: 'reviewed' as const,
        label: `Ohodnotené (${submission.score}%)`,
        color: submission.score && submission.score >= 70 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600',
        icon: Star
      };
    }

    return {
      status: 'not_started' as const,
      label: 'Nezačaté',
      color: 'bg-gray-100 text-gray-600',
      icon: AlertCircle
    };
  };

  const sortedAssignments = subjectAssignments.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  return (
    <div>
      <Link to="/student/subjects" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Späť na predmety
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{subject.name}</h1>
        <p className="text-gray-600 mt-2">{subject.description}</p>
      </div>

      <div className="space-y-6">
        {sortedAssignments.map(assignment => {
          const statusInfo = getAssignmentStatus(assignment);
          const submission = getSubmissionByAssignmentAndStudent(assignment.id, user.id);
          const StatusIcon = statusInfo.icon;
          const isOverdue = assignment.dueDate < new Date() && statusInfo.status === 'not_started';

          return (
            <div key={assignment.id} className={`bg-white rounded-lg shadow-md overflow-hidden ${
              isOverdue ? 'border-l-4 border-red-500' : ''
            }`}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                    <p className="text-gray-600 mb-3">{assignment.description}</p>
                    
                    {assignment.imagePrompt && (
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                        <p className="text-sm text-blue-800">
                          <strong>Vzorová úloha:</strong> {assignment.imagePrompt}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Termín: {assignment.dueDate.toLocaleDateString('sk-SK')}</span>
                      {isOverdue && (
                        <span className="ml-2 text-red-600 font-medium">
                          (Po termíne)
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <span className={`px-3 py-1 text-sm rounded-full flex items-center ${statusInfo.color}`}>
                      <StatusIcon className="h-4 w-4 mr-1" />
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {submission?.status === 'reviewed' && submission.teacherFeedback && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                    <h4 className="font-medium text-green-800 mb-2">Spätná väzba od učiteľa:</h4>
                    <p className="text-green-700">{submission.teacherFeedback}</p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    {(statusInfo.status === 'not_started' || statusInfo.status === 'in_progress') && !isOverdue && (
                      <button
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setShowUploadModal(true);
                        }}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {statusInfo.status === 'not_started' ? 'Začať úlohu' : 'Odovzdať riešenie'}
                      </button>
                    )}
                    
                    {submission?.uploadedImage && (
                      <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Eye className="h-4 w-4 mr-2" />
                        Zobraziť riešenie
                      </button>
                    )}
                  </div>
                  
                  {submission?.submittedAt && (
                    <p className="text-sm text-gray-500">
                      Odovzdané: {submission.submittedAt.toLocaleDateString('sk-SK')} o {submission.submittedAt.toLocaleTimeString('sk-SK')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {sortedAssignments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Žiadne úlohy</h3>
            <p className="text-gray-500">V tomto predmete zatiaľ nie sú žiadne úlohy.</p>
          </div>
        )}
      </div>

      {showUploadModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Odovzdať riešenie: {selectedAssignment.title}
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nahrať súbor s riešením
              </label>
              <input
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Podporované formáty: obrázky (JPG, PNG), PDF, Word dokumenty
              </p>
            </div>
            
            {uploadedFile && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">
                  <strong>Vybraný súbor:</strong> {uploadedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  Veľkosť: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedAssignment(null);
                  setUploadedFile(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Zrušiť
              </button>
              <button
                onClick={handleSubmitAssignment}
                disabled={!uploadedFile}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Odovzdať
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};