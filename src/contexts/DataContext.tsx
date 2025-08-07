import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { School, Teacher, Student, Subject, Assignment, Submission } from '../types';
import { mockData } from '../data/mockData';

interface DataContextType {
  schools: School[];
  teachers: Teacher[];
  students: Student[];
  subjects: Subject[];
  assignments: Assignment[];
  submissions: Submission[];
  addSchool: (school: School) => void;
  addTeacher: (teacher: Teacher) => void;
  addStudent: (student: Student) => void;
  addSubject: (subject: Subject) => void;
  addAssignment: (assignment: Assignment) => void;
  updateSubmission: (submission: Submission) => void;
  getSchoolById: (id: string) => School | undefined;
  getSubjectsByTeacher: (teacherId: string) => Subject[];
  getSubjectsByStudent: (studentId: string) => Subject[];
  getAssignmentsBySubject: (subjectId: string) => Assignment[];
  getSubmissionByAssignmentAndStudent: (assignmentId: string, studentId: string) => Submission | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [schools, setSchools] = useState<School[]>(mockData.schools);
  const [teachers, setTeachers] = useState<Teacher[]>(mockData.teachers);
  const [students, setStudents] = useState<Student[]>(mockData.students);
  const [subjects, setSubjects] = useState<Subject[]>(mockData.subjects);
  const [assignments, setAssignments] = useState<Assignment[]>(mockData.assignments);
  const [submissions, setSubmissions] = useState<Submission[]>(mockData.submissions);

  const addSchool = (school: School) => {
    setSchools([...schools, school]);
  };

  const addTeacher = (teacher: Teacher) => {
    setTeachers([...teachers, teacher]);
  };

  const addStudent = (student: Student) => {
    setStudents([...students, student]);
  };

  const addSubject = (subject: Subject) => {
    setSubjects([...subjects, subject]);
  };

  const addAssignment = (assignment: Assignment) => {
    setAssignments([...assignments, assignment]);
  };

  const updateSubmission = (submission: Submission) => {
    setSubmissions(prev => {
      const existing = prev.find(s => s.id === submission.id);
      if (existing) {
        return prev.map(s => s.id === submission.id ? submission : s);
      }
      return [...prev, submission];
    });
  };

  const getSchoolById = (id: string) => schools.find(s => s.id === id);

  const getSubjectsByTeacher = (teacherId: string) => {
    return subjects.filter(s => s.teacherId === teacherId);
  };

  const getSubjectsByStudent = (studentId: string) => {
    return subjects.filter(s => s.studentIds.includes(studentId));
  };

  const getAssignmentsBySubject = (subjectId: string) => {
    return assignments.filter(a => a.subjectId === subjectId);
  };

  const getSubmissionByAssignmentAndStudent = (assignmentId: string, studentId: string) => {
    return submissions.find(s => s.assignmentId === assignmentId && s.studentId === studentId);
  };

  return (
    <DataContext.Provider value={{
      schools,
      teachers,
      students,
      subjects,
      assignments,
      submissions,
      addSchool,
      addTeacher,
      addStudent,
      addSubject,
      addAssignment,
      updateSubmission,
      getSchoolById,
      getSubjectsByTeacher,
      getSubjectsByStudent,
      getAssignmentsBySubject,
      getSubmissionByAssignmentAndStudent
    }}>
      {children}
    </DataContext.Provider>
  );
};