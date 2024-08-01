const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const mailManagerController = require('../controllers/mailManagerController');
const authMiddleware = require('../middleware/auth');

router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);
router.post('/refresh-token', usersController.refreshToken);
router.get('/settings', authMiddleware, usersController.getSettings);
router.post('/settings', authMiddleware, usersController.updateSettings);
router.get(
  '/:userId/emails',
  authMiddleware,
  mailManagerController.getUserEmails
);
router.patch(
  '/update-google-password',
  authMiddleware,
  usersController.updateGoogleAppPassword
);

module.exports = router;
