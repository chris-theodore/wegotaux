const mysql = require('mysql');
require('dotenv').config();
config = {
    host: "us-cdbr-east-05.cleardb.net" || process.env.DB_HOST,
    user: "bfa453b94451ca" || process.env.DB_USER,
    database: "heroku_41a437d65392f6c" || process.env.DB_INSTANCE,
    password: "8ed2ec7b"|| ''
}
var connection =mysql.createConnection(config);
connection.connect(function(err){
  if (err){
    console.log('error connecting:' + err.stack);
  }
  console.log('connected successfully to DB.');
});


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

module.exports ={
     connection : mysql.createConnection(config) 
} 