export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}

export interface School {
  id: string;
  name: string;
  address?: string;
  teacherIds: string[];
  studentIds: string[];
}

export interface Teacher extends User {
  role: 'teacher';
  schoolId: string;
  subjectIds: string[];
}

export interface Student extends User {
  role: 'student';
  schoolId: string;
  enrolledSubjectIds: string[];
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  schoolId: string;
  teacherId: string;
  studentIds: string[];
  assignmentIds: string[];
}

export interface Assignment {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  imagePrompt?: string;
  dueDate: Date;
  createdAt: Date;
}

export type SubmissionStatus = 'not_started' | 'in_progress' | 'submitted' | 'reviewed';

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  uploadedImage?: string;
  submittedAt?: Date;
  status: SubmissionStatus;
  teacherFeedback?: string;
  score?: number;
}