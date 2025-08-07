import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { SchoolsManagement } from './pages/admin/SchoolsManagement';
import { UsersManagement } from './pages/admin/UsersManagement';
import { SubjectsManagement } from './pages/admin/SubjectsManagement';
import { AdminSubjectDetail } from './pages/admin/SubjectDetail';
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { TeacherSubjectDetail } from './pages/teacher/SubjectDetail';
import { TeacherSubjectsList } from './pages/teacher/SubjectsList';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentSubjectDetail } from './pages/student/SubjectDetail';
import { StudentSubjectsList } from './pages/student/SubjectsList';

const HomeRedirect: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" />;
    case 'teacher':
      return <Navigate to="/teacher" />;
    case 'student':
      return <Navigate to="/student" />;
    default:
      return <Navigate to="/login" />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<Layout />}>
              <Route path="/" element={<HomeRedirect />} />
              
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/schools" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SchoolsManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UsersManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/subjects" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SubjectsManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/subjects/:subjectId" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSubjectDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/teacher" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherDashboard />
                </ProtectedRoute>
              } />
              <Route path="/teacher/subjects" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherSubjectsList />
                </ProtectedRoute>
              } />
              <Route path="/teacher/subjects/:subjectId" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherSubjectDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/student" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/student/subjects" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentSubjectsList />
                </ProtectedRoute>
              } />
              <Route path="/student/subjects/:subjectId" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentSubjectDetail />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;