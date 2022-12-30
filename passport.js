const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Author = require('./models/author');

// Configure username and password authentication
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const author = await Author.findOne({ username });

      if (!author) {
        // Didn't find user
        return done(null, false, { message: 'Incorrect username or password' });
      }

      const isValidPassword = await author.isValidPassword(password);

      if (!isValidPassword) {
        // Wrong password
        return done(null, false, { message: 'Incorrect username or password' });
      }

      return done(null, author, { message: 'Logged in successfully' });
    } catch (err) {
      return done(err);
    }
  })
);
