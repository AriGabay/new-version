const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const filesController = require('../controllers/filesController');
const authMiddleware = require('../middleware/auth');

router.post('/upload', authMiddleware, upload, filesController.uploadFiles);
router.get('/:filename', authMiddleware, filesController.getFile);
router.get('/', authMiddleware, filesController.getUserFiles);
router.delete('/:id', authMiddleware, filesController.deleteFile);

module.exports = router;
