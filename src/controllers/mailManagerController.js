const MailManager = require('../models/mailManager');
const Address = require('../models/address');
exports.getUserEmails = async (req, res) => {
  try {
    const userId = req.user.id;
    const mailEntries = await MailManager.find({ userId }).populate(
      'addressId'
    );

    const emails = mailEntries.map((entry) => ({
      subject: entry.subject,
      text: entry.text,
      email: entry.addressId.email,
      firstName: entry.addressId.first_name,
      linkedinName: entry.addressId.linkedin_name,
      position: entry.addressId.position,
      img: entry.addressId.img,
      founded: entry.addressId.founded,
      lastSent: entry.lastSent,
    }));

    res.status(200).json(emails);
  } catch (error) {
    console.log('error:', error);
    res.status(500).json({ message: error.message });
  }
};
