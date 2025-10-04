import React, { useState } from 'react';
import API from '../api';

export default function Login(){
  const [role, setRole] = useState('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { role, identifier, password });
      localStorage.setItem('token', res.data.token);
      alert('Logged in as ' + res.data.user.role);
      window.location.href = '/' + res.data.user.role;
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-2">
      <select value={role} onChange={e=>setRole(e.target.value)} className="p-2 border rounded">
        <option value="student">Student</option>
        <option value="clerk">Clerk</option>
        <option value="warden">Warden</option>
      </select>
      <input placeholder={role==='student' ? 'Roll No' : 'ID No'} value={identifier} onChange={e=>setIdentifier(e.target.value)} className="w-full p-2 border rounded" />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 border rounded" />
      <button className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>
    </form>
  );
}
