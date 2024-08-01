const jwt = require('jsonwebtoken');
const User = require('../models/user'); // או כל מודל שמתאים לאימות

exports.authenticate = async (req, res) => {
  const { apiKey, secretKey } = req.body;

  try {
    const user = await User.findOne({ apiKey, secretKey });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginWithKeys = async (req, res) => {
  const { apiKey, secretKey } = req.body;

  try {
    const user = await User.findOne({ apiKey, secretKey });
    if (!user) {
      throw new Error('Invalid API key or Secret key');
    }

    const token = jwt.sign({ id: user._id }, user.secretKey, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
