import React, { useEffect, useState } from 'react';
import API from '../api';
import ComplaintList from '../components/ComplaintList';

export default function WardenDashboard(){
  const [complaints, setComplaints] = useState([]);
  const fetch = async () => {
    const res = await API.get('/complaints/all');
    setComplaints(res.data.items);
  };
  useEffect(()=>{ fetch(); }, []);
  return (
    <div className="space-y-4">
      <h2 className="text-xl">Warden Dashboard</h2>
      <ComplaintList complaints={complaints} />
    </div>
  );
}
