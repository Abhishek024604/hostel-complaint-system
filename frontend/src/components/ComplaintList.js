import React from 'react';

export default function ComplaintList({ complaints }){
  return (
    <div className="space-y-3">
      {complaints.map(c => (
        <div key={c._id} className="card">
          <div className="flex justify-between items-center">
            <div><strong>{c.title}</strong> <div className="text-sm text-slate-500">{c.category}</div></div>
            <div className="text-sm">{c.status}</div>
          </div>
          <p className="mt-2 text-sm">{c.description}</p>
          <div className="mt-2 flex gap-2">
            {c.images?.map((u,i)=> <img key={i} src={u} alt="" className="w-24 h-24 object-cover rounded" />)}
          </div>
        </div>
      ))}
    </div>
  );
}
