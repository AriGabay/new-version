const File = require('../models/file');

exports.uploadFiles = async (req, res) => {
  try {
    const userId = req.user.id;
    const existingFiles = await File.find({ userId });

    if (existingFiles.length >= 2) {
      return res
        .status(400)
        .json({ message: 'You can upload up to 2 files only.' });
    }

    const files = req.files;

    const fileRecords = files.map((file) => ({
      userId,
      filename: file.originalname,
      contentType: file.mimetype,
      data: file.buffer,
    }));

    const savedFiles = await File.insertMany(fileRecords);
    res.status(201).json(savedFiles);
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getFile = async (req, res) => {
  try {
    const file = await File.findOne({
      filename: req.params.filename,
      userId: req.user.id,
    });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.set('Content-Type', file.contentType);
    res.send(file.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ userId: req.user.id });
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
