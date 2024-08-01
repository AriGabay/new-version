const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');

exports.registerUser = async (req, res) => {
  const {
    username,
    password,
    email,
    googleAppPassword,
    labelText,
    messageText,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const apiKey = uuidv4();
    const secretKey = uuidv4();
    const user = new User({
      username,
      password: hashedPassword,
      email,
      googleAppPassword,
      apiKey,
      secretKey,
      paymentMethod: 'default',
      lastPaymentDate: new Date(),
      subscriptionActive: true,
      messageText,
      language: 'en',
      labelText,
    });

    const accessToken = jwt.sign({ id: user._id }, secretKey, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ id: user._id }, apiKey);
    user.jwtToken = refreshToken;

    await user.save();

    res
      .status(201)
      .json({ accessToken, refreshToken, userId: user._id, apiKey, secretKey });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const accessToken = jwt.sign({ id: user._id }, user.secretKey, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ id: user._id }, user.apiKey);
    user.jwtToken = refreshToken;

    await user.save();

    res.status(200).json({
      accessToken,
      refreshToken,
      userId: user._id,
      apiKey: user.apiKey,
      secretKey: user.secretKey,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh Token is required' });
  }

  try {
    const decoded = jwt.decode(refreshToken);
    const user = await User.findById(decoded.id);
    if (!user || user.jwtToken !== refreshToken) {
      throw new Error('Invalid Refresh Token');
    }

    jwt.verify(refreshToken, user.apiKey);

    const newAccessToken = jwt.sign({ id: user._id }, user.secretKey, {
      expiresIn: '15m',
    });
    const newRefreshToken = jwt.sign({ id: user._id }, user.apiKey);
    user.jwtToken = newRefreshToken;

    await user.save();

    res
      .status(200)
      .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(403).json({ message: 'Invalid Refresh Token' });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      apiKey: user.apiKey,
      secretKey: user.secretKey,
      email: user.email,
      googleAppPassword: user.googleAppPassword,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      apiKey,
      secretKey,
      email,
      googleAppPassword,
      jwt,
      username,
      password,
    } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.apiKey = apiKey;
    user.secretKey = secretKey;
    user.email = email;
    user.googleAppPassword = googleAppPassword;
    user.jwtToken = jwt;
    user.username = username;
    user.password = password;
    await user.save();
    res.status(200).json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateGoogleAppPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { googleAppPassword } = req.body;

    if (!googleAppPassword) {
      return res
        .status(400)
        .json({ message: 'Google App Password is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.googleAppPassword = googleAppPassword;
    await user.save();

    res
      .status(200)
      .json({ message: 'Google App Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const user = await usersService.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
