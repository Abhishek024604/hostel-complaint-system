const mongoose = require('mongoose');

const ClerkSchema = new mongoose.Schema({
  hostelName: { type: String, required: true },
  name: { type: String, required: true },
  idNo: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Clerk', ClerkSchema);
