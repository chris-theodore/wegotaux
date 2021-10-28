const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

module.exports = function(app, db){
  app.get("/createemployee", (req, res) => {
    let sql =
      "CREATE TABLE employee(id int AUTO_INCREMENT, name VARCHAR(255), designation VARCHAR(255), PRIMARY KEY(id))";
    db.query(sql, (err) => {
      if (err) {
        throw err;
      }
      res.send("Employee table created");
    });
  });
}

   

      