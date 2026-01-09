import React from 'react';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';

function App() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  if (user?.role === 'student') {
    return <StudentDashboard />;
  }

  return <div>Unknown Role</div>;
}

export default App;
