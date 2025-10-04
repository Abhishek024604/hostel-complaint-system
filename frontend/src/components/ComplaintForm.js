import React, { useState } from 'react';
import { uploadToCloudinaryUnsigned } from '../cloudinary';
import API from '../api';

export default function ComplaintForm({ onCreated }){
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electrical');
  const [description, setDescription] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
      const uploadedImages = [];
      for (const f of images) {
        const r = await uploadToCloudinaryUnsigned(f, cloudName, uploadPreset, 'hostel_complaints/images');
        uploadedImages.push({ url: r.secure_url, public_id: r.public_id });
      }
      const uploadedVideos = [];
      for (const f of videos) {
        const r = await uploadToCloudinaryUnsigned(f, cloudName, uploadPreset, 'hostel_complaints/videos');
        uploadedVideos.push({ url: r.secure_url, public_id: r.public_id });
      }

      await API.post('/complaints', { title, category, description, roomNo, images: uploadedImages, videos: uploadedVideos });
      setTitle(''); setDescription(''); setImages([]); setVideos([]);
      if (onCreated) onCreated();
      alert('Complaint created');
    } catch (err) {
      console.error(err);
      alert('Error: ' + (err.message || 'failed'));
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-2">
      <input required value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" />
      <select value={category} onChange={e=>setCategory(e.target.value)} className="p-2 border rounded">
        <option>Electrical</option><option>Plumbing</option><option>Mess</option><option>Cleanliness</option>
      </select>
      <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded" />
      <input value={roomNo} onChange={e=>setRoomNo(e.target.value)} placeholder="Room No" className="w-full p-2 border rounded" />
      <div>
        <label className="block text-sm">Images</label>
        <input type="file" accept="image/*" multiple onChange={e=>setImages(Array.from(e.target.files))} />
      </div>
      <div>
        <label className="block text-sm">Videos</label>
        <input type="file" accept="video/*" multiple onChange={e=>setVideos(Array.from(e.target.files))} />
      </div>
      <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Uploading...' : 'Submit Complaint'}</button>
    </form>
  );
}
