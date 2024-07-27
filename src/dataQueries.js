const { Client } = require('pg');
const bcrypt = require('bcrypt');

const connectionString = {
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: true,
  },
};

const client = new Client(connectionString);

async function connect() {
  await client.connect();
  console.log('Connected to Postgres database');
}

async function registerUser(username, email, password) {
  await connect();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`;
    const values = [username, email, hashedPassword];
    await client.query(query, values);
    console.log('User registered successfully');
  } catch (error) {
    console.error('Failed to register user:', error);
  } finally {
    await client.end();
  }
}

async function authenticateUser(username, password) {
  await connect();
  try {
    const query = `SELECT * FROM users WHERE username = $1`;
    const values = [username];
    const result = await client.query(query, values);
    const user = result.rows[0];
    if (!user) {
      return null;
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return null;
    }
    return user;
  } catch (error) {
    console.error('Failed to authenticate user:', error);
    return null;
  } finally {
    await client.end();
  }
}

async function saveNewEmailAddresses(userId, addresses) {
  await connect();
  try {
    for (const address of addresses) {
      const query = `INSERT INTO email_addresses (user_id, email) VALUES ($1, $2)`;
      const values = [userId, address];
      await client.query(query, values);
    }
    console.log('New email addresses saved successfully');
  } catch (error) {
    console.error('Failed to save email addresses:', error);
  } finally {
    await client.end();
  }
}

async function getNewAddresses(userId) {
  await connect();
  try {
    const query = `SELECT * FROM email_addresses WHERE user_id = $1`;
    const values = [userId];
    const result = await client.query(query, values);
    const addresses = result.rows.map((row) => row.email);
    return addresses;
  } catch (error) {
    console.error('Failed to get new addresses:', error);
    return [];
  } finally {
    await client.end();
  }
}

module.exports = {
  registerUser,
  authenticateUser,
  saveNewEmailAddresses,
  getNewAddresses,
};
