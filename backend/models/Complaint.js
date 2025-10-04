const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }],
  videos: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'createdByModel' },
  createdByModel: { type: String, required: true, enum: ['Student','Clerk','Warden'] },
  roomNo: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, refPath: 'assignedToModel' },
  assignedToModel: { type: String, enum: ['Student','Clerk','Warden'] },
  status: { type: String, enum: ['pending','in_progress','resolved'], default: 'pending' },
  notes: [{ by: String, text: String, at: { type: Date, default: Date.now } }]
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
