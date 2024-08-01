const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.registerUser = async (userData) => {
  const user = new User(userData);
  user.password = await bcrypt.hash(user.password, 10);
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  user.jwtToken = token;
  return await user.save();
};

exports.loginUser = async (loginData) => {
  const user = await User.findOne({ email: loginData.email });
  if (!user || !(await bcrypt.compare(loginData.password, user.password))) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  user.jwtToken = token;
  await user.save();
  return { userId: user.id, token: token };
};

exports.getUserById = async (id) => {
  return await User.findById(id);
};

exports.updateUserSubscriptionStatus = async () => {
  const users = await User.find();
  users.forEach(async (user) => {
    const now = new Date();
    const lastPaymentDate = new Date(user.lastPaymentDate);
    const oneMonth = 1000 * 60 * 60 * 24 * 30;
    if (now - lastPaymentDate > oneMonth) {
      user.subscriptionActive = false;
      await user.save();
    }
  });
};
