const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  createdDate: { type: Date, default: Date.now },
  founded: { type: Date },
  position: { type: String },
  img: { type: String },
  first_name: { type: String },
  linkedin_name: { type: String },
  email: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Address', addressSchema);
