import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import ClerkDashboard from './pages/ClerkDashboard';
import WardenDashboard from './pages/WardenDashboard';
import { io } from 'socket.io-client';

export default function App(){
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const s = io(process.env.REACT_APP_API_URL?.replace('/api','') || 'http://localhost:5000', { auth: { token } });
    s.on('new_complaint', (p) => setToasts(t => [{ id: Date.now(), text: 'New complaint: ' + p.complaint.title }, ...t]));
    s.on('status_update', (p) => setToasts(t => [{ id: Date.now(), text: 'Status updated: ' + p.complaint.title }, ...t]));
    return () => s.disconnect();
  }, []);

  return (
    <BrowserRouter>
      <div className="container">
        <nav className="flex gap-4 mb-4">
          <Link to="/" className="text-lg font-medium">HostelComplaints</Link>
          <Link to="/login" className="text-sm">Login</Link>
          <Link to="/signup" className="text-sm">Signup</Link>
        </nav>
        <div className="space-y-4">
          {toasts.map(t => (
            <div key={t.id} className="card">{t.text}</div>
          ))}
        </div>
        <Routes>
          <Route path="/" element={<div className="card">Open login or signup</div>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/student" element={<StudentDashboard/>} />
          <Route path="/clerk" element={<ClerkDashboard/>} />
          <Route path="/warden" element={<WardenDashboard/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
