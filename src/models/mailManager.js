const mongoose = require('mongoose');

const mailManagerSchema = new mongoose.Schema({
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  },
  versionId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastSent: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MailManager', mailManagerSchema);
