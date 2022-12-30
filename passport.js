const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const Author = require('./models/author');

// Configure username and password authentication
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const author = await Author.findOne({ username });

      if (!author) {
        // Didn't find author
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

// Configure JWT authentication
passport.use(
  new JwtStrategy(
    {
      secretOrKey: process.env.TOKEN_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (jwtPayload, done) => {
      try {
        const author = await Author.findById(jwtPayload.author._id);

        if (!author) {
          // Didn't find author
          return done(null, false);
        }

        return done(null, author);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);
