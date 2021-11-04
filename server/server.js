//bare minimum code to activate express server w CORS
const express = require('express'),
  app = express(),
  //bodyParser = require('body-parser');
  mysql = require('mysql'),
  session = require('express-session'),
  port = process.env.PORT || 5000,
  passport = require('passport'),
  users = {},
  SpotifyStrategy = require('passport-spotify').Strategy,
  cors = require('cors');

require('dotenv').config();


app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
//app.use(bodyParser.json()); // support json encoded bodies
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(session({secret: "secret"}));

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_INSTANCE,
  password: ''
});

db.connect(function(err) {
if (err) {
  console.error('Error connecting: ' + err.stack);
  return;
}
console.log('MySql connected');
});

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
        console.log(expires_in);
        console.log("refresh token");
        console.log(refreshToken);
        process.env.ACCESS_TOKEN = accessToken;
        process.env.REFRESH_TOKEN = refreshToken;
        process.env.SPOTIFY_API_USER_ID = profile.id;
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
        scope: ['user-read-email', 'user-read-playback-state', 'playlist-modify-private', 'playlist-modify-public','ugc-image-upload', 'user-modify-playback-state'],
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
require('./routes/create_database')(app,db);
require('./routes/database')(app, db);

//start server
app.listen(port, () => console.log("Backend server live on " + port));

