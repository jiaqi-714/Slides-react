// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login, onLogin, LoginNav } from './Login';
import { Register } from './Register';
import { Dashboard } from './Dashboard';
import { AuthProvider } from './AuthContext'; // Import the AuthProvider
import CenteredLayout from './CenteredLayout'; // Import the layout component
import { EditPresentation } from './EditPresentation'; // Import the edit component
import ProtectedRoute from './ProtectedRoute'; // Import ProtectedRoute
import { PresentationProvider } from './PresentationContext'; // Adjust the path as necessary
import MainLayout from './MainLayout'
import { NavBar } from './NavBar';
import PreviewPresentation from './PreviewPresentation'; // Adjust the path as necessary

function App () {
  return (
    <AuthProvider>
      <PresentationProvider>
        <Router>
          <Routes>
            <Route path="/" element={
              <CenteredLayout>
                <Login onLogin={onLogin}/>
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
                <Login onLogin={onLogin}/>
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
