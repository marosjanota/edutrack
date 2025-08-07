import type { School, Teacher, Student, Subject, Assignment, Submission } from '../types';

export const mockData = {
  schools: [
    {
      id: 'school1',
      name: 'Základná škola Bratislava',
      address: 'Hlavná 123, Bratislava',
      teacherIds: ['teacher1', 'teacher2'],
      studentIds: ['student1', 'student2', 'student3']
    },
    {
      id: 'school2',
      name: 'Gymnázium Košice',
      address: 'Školská 45, Košice',
      teacherIds: ['teacher3'],
      studentIds: ['student4', 'student5']
    }
  ] as School[],

  teachers: [
    {
      id: 'teacher1',
      name: 'Peter Novák',
      email: 'teacher@edutrack.sk',
      role: 'teacher',
      schoolId: 'school1',
      subjectIds: ['subject1', 'subject2']
    },
    {
      id: 'teacher2',
      name: 'Jana Horváthová',
      email: 'jana.horvath@edutrack.sk',
      role: 'teacher',
      schoolId: 'school1',
      subjectIds: ['subject3']
    },
    {
      id: 'teacher3',
      name: 'Martin Kováč',
      email: 'martin.kovac@edutrack.sk',
      role: 'teacher',
      schoolId: 'school2',
      subjectIds: ['subject4']
    }
  ] as Teacher[],

  students: [
    {
      id: 'student1',
      name: 'Mária Kováčová',
      email: 'student@edutrack.sk',
      role: 'student',
      schoolId: 'school1',
      enrolledSubjectIds: ['subject1', 'subject2', 'subject3']
    },
    {
      id: 'student2',
      name: 'Tomáš Szabó',
      email: 'tomas.szabo@edutrack.sk',
      role: 'student',
      schoolId: 'school1',
      enrolledSubjectIds: ['subject1', 'subject3']
    },
    {
      id: 'student3',
      name: 'Lucia Tóthová',
      email: 'lucia.toth@edutrack.sk',
      role: 'student',
      schoolId: 'school1',
      enrolledSubjectIds: ['subject2', 'subject3']
    },
    {
      id: 'student4',
      name: 'Adam Varga',
      email: 'adam.varga@edutrack.sk',
      role: 'student',
      schoolId: 'school2',
      enrolledSubjectIds: ['subject4']
    },
    {
      id: 'student5',
      name: 'Eva Nagyová',
      email: 'eva.nagy@edutrack.sk',
      role: 'student',
      schoolId: 'school2',
      enrolledSubjectIds: ['subject4']
    }
  ] as Student[],

  subjects: [
    {
      id: 'subject1',
      name: 'Matematika 1.A',
      description: 'Základy matematiky pre 1. ročník',
      schoolId: 'school1',
      teacherId: 'teacher1',
      studentIds: ['student1', 'student2'],
      assignmentIds: ['assignment1', 'assignment2']
    },
    {
      id: 'subject2',
      name: 'Slovenský jazyk 1.A',
      description: 'Písanie písmen a čítanie',
      schoolId: 'school1',
      teacherId: 'teacher1',
      studentIds: ['student1', 'student3'],
      assignmentIds: ['assignment3', 'assignment4']
    },
    {
      id: 'subject3',
      name: 'Prírodoveda',
      description: 'Spoznávanie prírody',
      schoolId: 'school1',
      teacherId: 'teacher2',
      studentIds: ['student1', 'student2', 'student3'],
      assignmentIds: ['assignment5']
    },
    {
      id: 'subject4',
      name: 'Fyzika',
      description: 'Základy fyziky',
      schoolId: 'school2',
      teacherId: 'teacher3',
      studentIds: ['student4', 'student5'],
      assignmentIds: ['assignment6']
    }
  ] as Subject[],

  assignments: [
    {
      id: 'assignment1',
      subjectId: 'subject1',
      title: 'Sčítanie čísel do 10',
      description: 'Vyriešte príklady na sčítanie',
      imagePrompt: '3 + 4 = ?',
      dueDate: new Date('2025-08-14'),
      createdAt: new Date('2025-08-01')
    },
    {
      id: 'assignment2',
      subjectId: 'subject1',
      title: 'Odčítanie čísel do 10',
      description: 'Vyriešte príklady na odčítanie',
      imagePrompt: '8 - 3 = ?',
      dueDate: new Date('2025-08-21'),
      createdAt: new Date('2025-08-05')
    },
    {
      id: 'assignment3',
      subjectId: 'subject2',
      title: 'Napíšte písmeno A',
      description: 'Precvičte si písanie veľkého písmena A',
      imagePrompt: 'A',
      dueDate: new Date('2025-08-10'),
      createdAt: new Date('2025-08-01')
    },
    {
      id: 'assignment4',
      subjectId: 'subject2',
      title: 'Napíšte písmeno B',
      description: 'Precvičte si písanie veľkého písmena B',
      imagePrompt: 'B',
      dueDate: new Date('2025-08-12'),
      createdAt: new Date('2025-08-03')
    },
    {
      id: 'assignment5',
      subjectId: 'subject3',
      title: 'Nakresli strom',
      description: 'Nakreslite strom s listami',
      dueDate: new Date('2025-08-15'),
      createdAt: new Date('2025-08-02')
    },
    {
      id: 'assignment6',
      subjectId: 'subject4',
      title: 'Newtonove zákony',
      description: 'Vypracujte úlohy o pohybe',
      dueDate: new Date('2025-08-20'),
      createdAt: new Date('2025-08-01')
    }
  ] as Assignment[],

  submissions: [
    {
      id: 'submission1',
      assignmentId: 'assignment1',
      studentId: 'student1',
      status: 'reviewed',
      submittedAt: new Date('2025-08-08'),
      teacherFeedback: 'Výborne! Všetky príklady správne.',
      score: 100
    },
    {
      id: 'submission2',
      assignmentId: 'assignment1',
      studentId: 'student2',
      status: 'submitted',
      submittedAt: new Date('2025-08-09')
    },
    {
      id: 'submission3',
      assignmentId: 'assignment3',
      studentId: 'student1',
      status: 'in_progress'
    },
    {
      id: 'submission4',
      assignmentId: 'assignment4',
      studentId: 'student1',
      status: 'not_started'
    },
    {
      id: 'submission5',
      assignmentId: 'assignment3',
      studentId: 'student3',
      status: 'reviewed',
      submittedAt: new Date('2025-08-07'),
      teacherFeedback: 'Pekne napísané, len daj pozor na zaoblenie.',
      score: 85
    }
  ] as Submission[]
};