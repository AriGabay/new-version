const express = require('express');
const passport = require('passport');
const session = require('express-session');
const { authenticateUser } = require('./auth');
const { handleNewAddresses } = require('./addresses');

const app = express();
const port = process.env.PORT || 3000;

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Passport authentication strategy
passport.use(
  'local',
  passport.Strategy({
    usernameField: 'username',
    passwordField: 'password',
    validator: async (username, password, done) => {
      const user = await authenticateUser(username, password);
      if (!user) {
        return done(null, false, { message: 'Invalid username or password' });
      }
      return done(null, user);
    },
  })
);

// Serialization and deserialization of user object for session storage
passport.serializeUser((user) => user.id);
passport.deserializeUser(async (id) => {
  await connect();
  try {
    const query = `SELECT * FROM users WHERE id = $1`;
    const values = [id];
    const result = await client.query(query, values);
    const user = result.rows[0];
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error('Failed to deserialize user:', error);
    return null;
  } finally {
    await client.end();
  }
});

// Define authentication middleware
const authenticateMiddleware = passport.authenticate('local', {
  failureFlash: true,
});

// Authentication routes
app.post('/login', authenticateMiddleware, (req, res) => {
  req.session.userId = req.user.id;
  res.json({ message: 'Login successful' });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.json({ message: 'Logout successful' });
});

// Protected route for handling new email addresses
app.post('/addresses', authenticateMiddleware, async (req, res) => {
  const userId = req.session.userId;
  const addresses = req.body.addresses;
  await handleNewAddresses(userId, addresses);
  res.json({ message: 'Addresses processed successfully' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
