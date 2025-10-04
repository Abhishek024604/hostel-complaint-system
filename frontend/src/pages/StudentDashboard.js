import React, { useEffect, useState } from 'react';
import ComplaintForm from '../components/ComplaintForm';
import ComplaintList from '../components/ComplaintList';
import API from '../api';

export default function StudentDashboard(){
  const [complaints, setComplaints] = useState([]);
  const fetch = async () => {
    const res = await API.get('/complaints/me');
    setComplaints(res.data);
  };
  useEffect(()=>{ fetch(); }, []);
  return (
    <div className="space-y-4">
      <h2 className="text-xl">Student Dashboard</h2>
      <ComplaintForm onCreated={fetch} />
      <h3>My complaints</h3>
      <ComplaintList complaints={complaints} />
    </div>
  );
}
