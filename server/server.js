//bare minimum code to activate express server w CORS
const express = require("express"),
  app = express(),
  port = process.env.PORT || 5000,
  cors = require("cors");

app.use(cors());

//init routes
require('./routes/spotify_api')(app);
//require('./routes/authentication')(app);
//require('./routes/database')(app);

//start server
app.listen(port, () => console.log("Backend server live on " + port));

