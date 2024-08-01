const addressService = require('../services/addressService');
const mailManagerService = require('../services/mailManagerService');
const usersService = require('../services/usersService');
const filesService = require('../services/filesService');
const nodemailer = require('nodemailer');

exports.addAddresses = async (req, res) => {
  try {
    const addresses = req.body;
    const userId = req.user.id;

    const processedAddresses = await Promise.all(
      addresses.map(async (addressData) => {
        const { email, ...rest } = addressData;
        const existingAddress =
          await addressService.findAddressByEmailAndUserId(email, userId);

        if (!existingAddress) {
          const address = await addressService.createAddress({
            email,
            userId,
            ...rest,
          });
          const versionId = 'initial';
          const entryData = { addressId: address._id, userId, versionId };

          await mailManagerService.createMailManagerEntry(entryData);

          // Send email
          const user = await usersService.getUserById(userId);
          const files = await filesService.getUserFiles(userId);
          const attachments = files.map((file) => ({
            filename: file.filename,
            content: file.data,
            contentType: file.contentType,
          }));

          const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
              user: user.email,
              pass: user.googleAppPassword,
            },
          });

          const mailOptions = {
            from: user.email,
            to: email,
            subject: user.labelText,
            text: user.messageText,
            attachments,
          };

          await transporter.sendMail(mailOptions);

          const now = new Date();

          return {
            address,
            message: 'Email sent successfully with attachments',
            timestamp: now.getTime(),
          };
        } else {
          const mailEntry = await mailManagerService.findMailManagerEntry(
            existingAddress._id,
            userId
          );

          if (mailEntry) {
            const now = new Date();
            const lastSent = new Date(mailEntry.lastSent);
            const daysPassed = Math.floor(
              (now - lastSent) / (1000 * 60 * 60 * 24)
            );

            if (daysPassed >= 35) {
              await mailManagerService.updateMailManagerEntry(mailEntry._id, {
                lastSent: now,
              });

              // Send email
              const user = await usersService.getUserById(userId);
              const files = await filesService.getUserFiles(userId);
              const attachments = files.map((file) => ({
                filename: file.filename,
                content: file.data,
                contentType: file.contentType,
              }));

              const transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE,
                auth: {
                  user: user.email,
                  pass: user.googleAppPassword,
                },
              });

              const mailOptions = {
                from: user.email,
                to: email,
                subject: user.labelText,
                text: user.messageText,
                attachments,
              };

              await transporter.sendMail(mailOptions);

              return {
                message: 'Email sent successfully with attachments',
                timestamp: now.getTime(),
              };
            } else {
              return {
                message: 'Email was recently sent, not sending again.',
              };
            }
          } else {
            const versionId = 'initial';
            const entryData = {
              addressId: existingAddress._id,
              userId,
              versionId,
            };

            await mailManagerService.createMailManagerEntry(entryData);

            // Send email
            const user = await usersService.getUserById(userId);
            const files = await filesService.getUserFiles(userId);
            const attachments = files.map((file) => ({
              filename: file.filename,
              content: file.data,
              contentType: file.contentType,
            }));

            const transporter = nodemailer.createTransport({
              service: process.env.EMAIL_SERVICE,
              auth: {
                user: user.email,
                pass: user.googleAppPassword,
              },
            });

            const mailOptions = {
              from: user.email,
              to: email,
              subject: user.labelText,
              text: user.messageText,
              attachments,
            };

            await transporter.sendMail(mailOptions);

            const now = new Date();

            return {
              message: 'Email sent successfully with attachments',
              timestamp: now.getTime(),
            };
          }
        }
      })
    );

    res.status(201).json(processedAddresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
