const mysql = require('mysql');
require('dotenv').config();
config = {
    host: "us-cdbr-east-05.cleardb.net",
    user: "bfa453b94451ca" ,
    database: "heroku_41a437d65392f6c",
    password: "8ed2ec7b"
}
// var connection =mysql.createConnection(config);
// connection.connect(function(err){
//   if (err){
//     console.log('error connecting:' + err.stack);
//   }
//   console.log('connected successfully to DB.');
// });

function handleDisconnect() {
  connection = mysql.createConnection(config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

// const db = mysql.createConnection({
//     host: "us-cdbr-east-05.cleardb.net",
//     user: "bfa453b94451ca",
//     database: "heroku_41a437d65392f6c",
//     password: "8ed2ec7b"
//   });
  
  // connection.connect(function(err) {
  // if (err) {
  //   console.error('Error connecting: ' + err.stack);
  //   return;
  // }
  // console.log('MySql connected');
  // });

module.exports ={
     connection : mysql.createConnection(config) 
} 