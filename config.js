const mysql = require('mysql');
require('dotenv').config();
config = {
    host: "us-cdbr-east-05.cleardb.net",
    user: "bfa453b94451ca" ,
    database: "heroku_41a437d65392f6c",
    password: "8ed2ec7b"
}
var connection =mysql.createConnection(config);
connection.connect(function(err){
  if (err){
    console.log('error connecting:' + err.stack);
  }
  console.log('connected successfully to DB.');
});


const db = mysql.createConnection({
    host: "us-cdbr-east-05.cleardb.net",
    user: "bfa453b94451ca",
    database: "heroku_41a437d65392f6c",
    password: "8ed2ec7b"
  });
  
  db.connect(function(err) {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('MySql connected');
  });

module.exports ={
     connection : mysql.createConnection(config) 
} 