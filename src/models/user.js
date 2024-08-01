const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleAppPassword: { type: String, required: true },
  apiKey: { type: String, required: true, unique: true },
  secretKey: { type: String, required: true, unique: true },
  paymentMethod: { type: String, required: true },
  lastPaymentDate: { type: Date, default: Date.now },
  subscriptionActive: { type: Boolean, required: true, default: true },
  messageText: { type: String, required: true },
  labelText: { type: String, required: true },
  language: { type: String, enum: ['en', 'he', 'ar'], default: 'en' },
  jwtToken: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
