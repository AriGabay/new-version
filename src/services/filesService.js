const File = require('../models/file');

exports.getUserFiles = async (userId) => {
  return await File.find({ userId });
};
