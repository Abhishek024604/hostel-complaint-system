const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  hostelName: { type: String, required: true },
  name: { type: String, required: true },
  course: { type: String },
  branch: { type: String },
  rollNo: { type: String, required: true, unique: true },
  roomNo: { type: String },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
