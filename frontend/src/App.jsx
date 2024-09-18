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
import config from './config.json';

const drawerWidth = config.drawerWidth;

function App () {
  return (
    <AuthProvider>
      <PresentationProvider>
        <Router>
          <Routes>
            {/* <Route path="/" element={
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
            } /> */}
            <Route path="/Slides-react" element={
              <MainLayout NavBarComponent={NavBar} drawerWidth={drawerWidth} >
                <Dashboard />
              </MainLayout>
            } />
            <Route path="/" element={
              <MainLayout NavBarComponent={NavBar} drawerWidth={drawerWidth} >
                <Dashboard />
              </MainLayout>
            } />
            <Route path="/dashboard" element={
                <MainLayout NavBarComponent={NavBar} drawerWidth={drawerWidth} >
                  <Dashboard />
                </MainLayout>
            } />
            <Route path="/presentation/:presentationId/edit/" element={
                <EditPresentation />
            } />
            <Route path="/presentation/:presentationId/edit/:slideNumber" element={
                <EditPresentation />
            } />
            <Route path="/presentation/:presentationId/preview/" element={
                <PreviewPresentation />
            } />
            <Route path="/presentation/:presentationId/preview/:slideNumber" element={
                <PreviewPresentation />
            } />
          </Routes>
        </Router>
      </PresentationProvider>
    </AuthProvider>
  );
}

export default App;
