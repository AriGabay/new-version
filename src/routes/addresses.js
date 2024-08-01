const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, addressController.addAddresses);

module.exports = router;
