//bare minimum code to activate express server w CORS
const express = require('express'),
  app = express(),
  session = require('express-session'),
  port = process.env.PORT || 5000,
  passport = require('passport'),
  users = {},
  SpotifyStrategy = require('passport-spotify').Strategy,
  cors = require('cors');

require('dotenv').config();
  

app.use(cors());
app.use(session({secret: "secret"}));


passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_LOCAL,
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        console.log('successful token retrieval');
        process.env.ACCESS_TOKEN = accessToken;
        process.env.REFRESH_TOKEN = refreshToken;
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


app.use(passport.initialize());
app.use(passport.session());



//authentication
app.get('/auth/spotify',
      passport.authenticate('spotify', {
        scope: ['user-read-email', 'user-read-playback-state','user-modify-playback-state', 'playlist-modify-private', 'playlist-modify-public','ugc-image-upload'],
        showDialog: true,
      })
  );

app.get('/auth/spotify/redirect',
  passport.authenticate('spotify'),
  function (req, res) {
      res.redirect('/');
  }
);


//init routes
require('./routes/spotify_api')(app);
require('./routes/id_generator')(app);
//require('./routes/database')(app);

//start server
app.listen(port, () => console.log("Backend server live on " + port));

