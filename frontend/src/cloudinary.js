export async function uploadToCloudinaryUnsigned(file, cloudName, uploadPreset, folder='hostel_complaints') {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', uploadPreset);
  fd.append('folder', folder);
  const res = await fetch(url, { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Upload failed');
  return res.json(); // contains secure_url and public_id
}
