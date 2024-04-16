// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login, LoginNav } from './Login';
import { Register } from './Register';
import { Dashboard } from './Dashboard';
import { AuthProvider } from './AuthContext';
import CenteredLayout from './CenteredLayout';
import { EditPresentation } from './EditPresentation';
import ProtectedRoute from './ProtectedRoute';
import { PresentationProvider } from './PresentationContext';
import MainLayout from './MainLayout'
import { NavBar } from './NavBar';
import PreviewPresentation from './PreviewPresentation';

function App () {
  return (
    <AuthProvider>
      <PresentationProvider>
        <Router>
          <Routes>
            <Route path="/" element={
              <CenteredLayout>
                <Login/>
                <LoginNav />
              </CenteredLayout>
            } />
            <Route path="/register" element={
              <CenteredLayout>
                <Register />
                <LoginNav />
              </CenteredLayout>
            } />
            <Route path="/login" element={
              <CenteredLayout>
                <Login />
                <LoginNav />
              </CenteredLayout>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <MainLayout NavBarComponent={NavBar}>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/presentation/:presentationId/edit/" element={
              <ProtectedRoute>
                <EditPresentation />
              </ProtectedRoute>
            } />
            <Route path="/presentation/:presentationId/edit/:slideNumber" element={
              <ProtectedRoute>
                <EditPresentation />
              </ProtectedRoute>
            } />
            <Route path="/presentation/:presentationId/preview/" element={
              <ProtectedRoute>
                <PreviewPresentation />
              </ProtectedRoute>
            } />
            <Route path="/presentation/:presentationId/preview/:slideNumber" element={
              <ProtectedRoute>
                <PreviewPresentation />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </PresentationProvider>
    </AuthProvider>
  );
}

export default App;
