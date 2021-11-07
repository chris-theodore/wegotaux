const mysql = require('mysql');
require('dotenv').config();
config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_INSTANCE,
    password: ''
}
var connection =mysql.createConnection(config); //added the line
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