import React, { useState } from 'react';
import API from '../api';

export default function Signup(){
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({});

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return alert('Password mismatch');
    try {
      await API.post('/auth/register', { role, ...form });
      alert('Registered - login now');
      window.location.href = '/login';
    } catch (err) {
      alert(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-2">
      <select value={role} onChange={e=>setRole(e.target.value)} className="p-2 border rounded">
        <option value="student">Student</option>
        <option value="clerk">Clerk</option>
        <option value="warden">Warden</option>
      </select>

      <input placeholder="Name" onChange={e=>setForm({...form, name:e.target.value})} className="w-full p-2 border rounded" />
      <input placeholder="Hostel Name" onChange={e=>setForm({...form, hostelName:e.target.value})} className="w-full p-2 border rounded" />
      {role==='student' && <>
        <input placeholder="Course" onChange={e=>setForm({...form, course:e.target.value})} className="w-full p-2 border rounded" />
        <input placeholder="Branch" onChange={e=>setForm({...form, branch:e.target.value})} className="w-full p-2 border rounded" />
        <input placeholder="Roll No" onChange={e=>setForm({...form, rollNo:e.target.value})} className="w-full p-2 border rounded" />
        <input placeholder="Room No" onChange={e=>setForm({...form, roomNo:e.target.value})} className="w-full p-2 border rounded" />
      </>}
      {role!=='student' && <input placeholder="ID No" onChange={e=>setForm({...form, idNo:e.target.value})} className="w-full p-2 border rounded" />}

      <input placeholder="Password" type="password" onChange={e=>setForm({...form, password:e.target.value})} className="w-full p-2 border rounded" />
      <input placeholder="Confirm Password" type="password" onChange={e=>setForm({...form, confirmPassword:e.target.value})} className="w-full p-2 border rounded" />
      <button className="px-4 py-2 bg-green-600 text-white rounded">Sign up</button>
    </form>
  );
}
