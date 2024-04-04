//App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login, onLogin, LoginNav} from './Login';
import { Register, onRegister } from './Register';
import { Dashboard } from './Dashboard';
import { AuthProvider } from './AuthContext'; // Import the AuthProvider
import CenteredLayout from './CenteredLayout'; // Import the layout component
import { EditPresentation } from './EditPresentation'; // Import the edit component
import ProtectedRoute from './ProtectedRoute'; // Import ProtectedRoute
import { PresentationProvider } from './PresentationContext'; // Adjust the path as necessary
import MainLayout from './MainLayout'
import { NavBar } from './NavBar';
import ExampleComponent from './test';

function App() {
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
                <Register onRegister={onRegister}/>
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
            <Route path="/presentation/:presentationId" element={
              <ProtectedRoute>
                <EditPresentation />
              </ProtectedRoute>
            } />
            <Route path="/test" element={
              <ExampleComponent />
            } />
          </Routes>
        </Router>
      </PresentationProvider>
    </AuthProvider>
  );
}

export default App;
