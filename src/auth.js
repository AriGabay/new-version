const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { registerUser, authenticateUser } = require('./dataQueries');

passport.use(
  'local-register',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const existingUser = await authenticateUser(username);
        if (existingUser) {
          return done(null, false, { message: 'Username already exists' });
        }

        const newUser = await registerUser(username, req.body.email, password);
        if (!newUser) {
          return done(null, false, { message: 'Failed to register user' });
        }

        return done(null, newUser);
      } catch (error) {
        console.error('Failed to register user:', error);
        return done(error);
      }
    }
  )
);

passport.use(
  'local-login',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const user = await authenticateUser(username, password);
        if (!user) {
          return done(null, false, {
            message: 'Incorrect username or password',
          });
        }

        return done(null, user);
      } catch (error) {
        console.error('Failed to authenticate user:', error);
        return done(error);
      }
    }
  )
);

module.exports = passport;
