const config = require('../config.js');
const connection = config.connection;


module.exports = function(app){
  app.get("/test/database", (req, res) => {
    let sql =
      "CREATE TABLE employee(id int AUTO_INCREMENT, name VARCHAR(255), designation VARCHAR(255), PRIMARY KEY(id))";
    connection.query(sql, (err) => {
      if (err) {
        throw err;
      }
      res.send("Employee table created");
    });
  });
}

   

      