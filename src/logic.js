const { validateEmail } = require('./utils');
const { scheduleEmail } = require('./mail');
const { getNewAddresses } = require('./dataQueries');

async function processNewAddresses(userId) {
  const newAddresses = await getNewAddresses(userId);
  for (const address of newAddresses) {
    const isValid = validateEmail(address.email);
    if (isValid) {
      console.log(`Scheduling email to ${address.email}`);
      await scheduleEmail(userId, address.email);
    } else {
      console.log(`Skipping invalid email: ${address.email}`);
    }
  }
}

module.exports = {
  processNewAddresses,
};
