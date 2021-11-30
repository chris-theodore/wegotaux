//bare minimum code to activate express server w CORS
const express = require('express');
const app = express();
  //bodyParser = require('body-parser');
const session = require('express-session');
const port = process.env.PORT || 5000;
const passport = require('passport');
const users = {};
const SpotifyStrategy = require('passport-spotify').Strategy;
const http = require("http");
const cors = require('cors');


require('dotenv').config();


const {Server}= require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
// socket connection
io.on("connection", (socket) =>{
  console.log(`User Connected: ${socket.id}`);
socket.on('disconnect', () =>
  console.log(`Disconnected: ${socket.id}`));
socket.on('join', (room) => {
  console.log(`Socket ${socket.id} joining ${room}`);
  socket.join(room);
});
socket.on('queue room', (room) => {
  console.log(`Socket ${socket.id} joining queue ${room}`);
  socket.join(room)
})
socket.on('add to block', (data) => {
  console.log("add to block")
  console.log(data);
  console.log(data.songPicArray);
  console.log(data.songnamerray);
  socket.to(data.room).emit('recieve qdata',
  (data))
})
socket.on('leave room', (room) => {
  console.log(`Socket ${socket.id} leaving ${room}`);
  socket.leave(room)
}) 
socket.on('leave queue room', (room) => {
  console.log(`Socket ${socket.id} leaving ${room}`);
  socket.leave(room)
})
socket.on('song event', (data) =>{
  socket.to(data.room).emit('receive code',   
    (data))
})
});

// socket room connection
io.on("join", (roomName) => {
  console.log("join: " + roomName);
  socket.join(roomName);
});
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
//app.use(bodyParser.json()); // support json encoded bodies
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
  origin: '*'
}));



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
      res.redirect('http://localhost:3000/create');
  }
);


//init routes
require('./routes/spotify_api')(app);
require('./routes/id_generator')(app);
require('./routes/database_api')(app);
//require('./routes/kenny_database')(app);
//require('./routes/preston_database')(app);

//start server
server.listen(port, () => console.log(`Listening on port ${port}`));
// app.listen(port, () => console.log("Backend server live on " + port));

