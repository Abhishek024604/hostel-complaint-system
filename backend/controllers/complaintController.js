const Complaint = require('../models/Complaint');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// helper to verify a public_id exists on Cloudinary
async function verifyPublicId(public_id) {
  try {
    const res = await cloudinary.api.resource(public_id);
    return !!res;
  } catch (err) {
    return false;
  }
}

exports.createComplaint = async (req, res) => {
  try {
    const { title, category, description, roomNo, images = [], videos = [] } = req.body;

    // images and videos expected as arrays of { url, public_id }
    // verify the public_ids exist on Cloudinary (server-side verification)
    for (const img of images) {
      if (!img.public_id) return res.status(400).json({ msg: 'Image public_id missing' });
      const ok = await verifyPublicId(img.public_id);
      if (!ok) return res.status(400).json({ msg: 'Image verification failed for ' + img.public_id });
    }
    for (const vid of videos) {
      if (!vid.public_id) return res.status(400).json({ msg: 'Video public_id missing' });
      const ok = await verifyPublicId(vid.public_id);
      if (!ok) return res.status(400).json({ msg: 'Video verification failed for ' + vid.public_id });
    }

    const createdByModel = req.user.model || (req.user.role === 'student' ? 'Student' : req.user.role === 'clerk' ? 'Clerk' : 'Warden');

    const newC = new Complaint({
      title, category, description,
      images: images.map(i => i.url),
      videos: videos.map(v => v.url),
      createdBy: req.user.id,
      createdByModel,
      roomNo
    });
    await newC.save();

    // emit via socket if available
    const io = req.app.get('io');
    if (io) io.to('clerks').emit('new_complaint', { complaint: newC });

    res.json(newC);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const modelName = req.user.model || (req.user.role === 'student' ? 'Student' : req.user.role === 'clerk' ? 'Clerk' : 'Warden');
    const complaints = await Complaint.find({ createdBy: req.user.id, createdByModel: modelName }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
};

exports.getAll = async (req, res) => {
  try {
    // filters, pagination minimal
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page-1)*limit;
    const items = await Complaint.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec();
    const total = await Complaint.countDocuments(filter);
    res.json({ items, total, page, limit });
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
};

exports.updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status, note, assignedTo, assignedToModel } = req.body;
    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ msg: 'Not found' });
    if (status) complaint.status = status;
    if (note) complaint.notes.push({ by: req.user.id, text: note });
    if (assignedTo) { complaint.assignedTo = assignedTo; complaint.assignedToModel = assignedToModel || complaint.assignedToModel; }
    await complaint.save();
    const io = req.app.get('io');
    if (io) io.to(`user_${complaint.createdBy}`).emit('status_update', { complaint });
    res.json(complaint);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
};

exports.stats = async (req, res) => {
  try {
    const agg = await Complaint.aggregate([
      { $group: { _id: '$category', total: { $sum: 1 }, resolved: { $sum: { $cond: [{ $eq: ['$status','resolved'] }, 1, 0] } } } },
      { $sort: { total: -1 } }
    ]);
    res.json(agg);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
};
