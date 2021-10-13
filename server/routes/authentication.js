require('dotenv').config();
//process.env now has the keys and values you defined in your .env file.
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;

module.exports = function(app){
    

    app.route('/auth/spotify')
    .get(
          passport.authenticate('spotify', {
            scope: ['user-read-email', 'user-read-playback-state','user-modify-playback-state', 'playlist-modify-private', 'playlist-modify-public','ugc-image-upload'],
            showDialog: true,
          })
      );

      app.route('/auth/spotify/redirect').
      get(
        passport.authenticate('spotify'),
        function (req, res) {
            res.redirect('/');
           // Successful authentication
          //res.send(`<script>window.close();</script>`);
        }
      );


}



// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete spotify profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });
  
const CLIENT_SECRET = "075ab4a9babf4c70baeffc9ca8ca8736";
const CLIENT_ID = "9eb6b774877749cbaee926baabeb1644";
const CALLBACK_LOCAL = "http://localhost:5000/auth/spotify/redirect";

passport.use(
    new SpotifyStrategy(
      {
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: CALLBACK_LOCAL,
      },
      function(accessToken, refreshToken, expires_in, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
          // To keep the example simple, the user's spotify profile is returned to
          // represent the logged-in user. In a typical application, you would want
          // to associate the spotify account with a user record in your database,
          // and return that user instead.
          process.env.REFRESH = refreshToken;
          process.env.TOKEN = accessToken;
          console.log('successful token retrieval');
          users[profile.id] = profile;
          return done(null, profile);
        });
      }
    )
  );


// get user info if it exists
passport.deserializeUser((id, done) => {
    done(null, users[id] || {});
  });
  // save given user info returned from Strategy 
  passport.serializeUser((user, done) => {
    users[user.id] = user
    done(null, user.id);
  });
  
