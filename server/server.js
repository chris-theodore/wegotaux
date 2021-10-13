//bare minimum code to activate express server w CORS
const express = require('express'),
  app = express(),
  session = require('express-session'),
  port = process.env.PORT || 5000,
  passport = require('passport'),
  SpotifyStrategy = require('passport-spotify').Strategy,
  cors = require('cors');

  const CLIENT_SECRET = "075ab4a9babf4c70baeffc9ca8ca8736";
  const CLIENT_ID = "9eb6b774877749cbaee926baabeb1644";
  const CALLBACK_LOCAL = "http://localhost:5000/auth/spotify/redirect";
  
  const users = {}

app.use(cors());
// passport.use(
//   new SpotifyStrategy(
//     {
//       clientID: CLIENT_ID,
//       clientSecret: CLIENT_SECRET,
//       callbackURL: CALLBACK_LOCAL,
//     },
//     function(accessToken, refreshToken, expires_in, profile, done) {
//       // asynchronous verification, for effect...
//       process.nextTick(function () {
//         console.log('successful token retrieval');
//         users[profile.id] = profile;
//         return done(null, profile);
//       });
//     }
//   )
// );




// app.use(passport.initialize());
// app.use(passport.session());



// //authentication
// app.get('/auth/spotify',
//       passport.authenticate('spotify', {
//         scope: ['user-read-email', 'user-read-playback-state','user-modify-playback-state', 'playlist-modify-private', 'playlist-modify-public','ugc-image-upload'],
//         showDialog: true,
//       })
//   );

//   app.route('/auth/spotify/redirect').
//   get(
//     passport.authenticate('spotify'),
//     function (req, res) {
//         res.redirect('/');
//        // Successful authentication
//       //res.send(`<script>window.close();</script>`);
//     }
//   );

  



//init routes
require('./routes/spotify_api')(app);
//require('./routes/authentication')(app);
//require('./routes/database')(app);

//start server
app.listen(port, () => console.log("Backend server live on " + port));

