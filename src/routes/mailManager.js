const express = require('express');
const router = express.Router();
const mailManagerController = require('../controllers/mailManagerController');
const authMiddleware = require('../middleware/auth');

router.get('/emails', authMiddleware, mailManagerController.getUserEmails);

module.exports = router;
