//App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login, onLogin} from './Login';
import { Register, onRegister } from './Register';
import { LoginNav } from './LoginNav';
import { Dashboard } from './Dashboard';
import { AuthProvider } from './AuthContext'; // Import the AuthProvider
import CenteredLayout from './CenteredLayout'; // Import the layout component

function App() {
  return (
    <AuthProvider>
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
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
