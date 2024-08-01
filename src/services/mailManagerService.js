const MailManager = require('../models/mailManager');

exports.createMailManagerEntry = async (entryData) => {
  const mailManager = new MailManager(entryData);
  return await mailManager.save();
};

exports.findMailManagerEntry = async (addressId, userId) => {
  return await MailManager.findOne({ addressId, userId });
};

exports.updateMailManagerEntry = async (entryId, updateData) => {
  return await MailManager.findByIdAndUpdate(entryId, updateData, {
    new: true,
  });
};
