const Address = require('../models/address');

exports.createAddress = async (addressData) => {
  const address = new Address(addressData);
  return await address.save();
};

exports.findAddressByEmailAndUserId = async (email, userId) => {
  return await Address.findOne({ email, userId });
};
