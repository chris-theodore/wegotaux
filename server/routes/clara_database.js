const config = require('../config.js');
const connection = config.connection;

//constructor
const Listening_Party = function(spotify_playlist_name, time_created, currently_playing, device_id, spotify_user_id, playlist_id, id){
  this.spotify_playlist_name = spotify_playlist_name;
  this.id = id;
  this.time_created = time_created;
  this.currently_playing = currently_playing;
  this.device_id = device_id;
  this.spotify_user_id = spotify_user_id;
  this.playlist_id = playlist_id;
  
}

const Voting_Record = function(fun_name, id, vote, vote_time, spotify_id, time_added){
  this.fun_name = fun_name;
  this.id = id;
  this.vote = vote;
  this.vote_time = vote_time;
  this.spotify_id = spotify_id;
  this.time_added = time_added;
}


const User = function(fun_name, user_type, id){
  this.fun_name = fun_name;
  this.user_type = user_type;
  this.id = id;
}

const Song = function(spotify_id, id, song_length, time_added, time_removed, playlist_position){
  this.spotify_id = spotify_id;
  this.id = id;
  this.song_length = song_length;
  this.time_added = time_added;
  this.time_removed = time_removed;
  this.playlist_position = playlist_position;
}


//INSERT INTO Listening_Party (spotify_playlist_name,id, time_created, currently_playing, device_id, spotify_user_id, playlist_id) VALUES(playlist_name,unique_id, time_created, NULL, device_id, spotify_user_id, playlist_id);


const db_client = {
  //CREATE 
  //(spotify_playlist_name, time_created, currently_playing, device_id, spotify_user_id, playlist_id, id)
  // this.spotify_playlist_name = spotify_playlist_name;
  // this.id = id;
  // this.time_created = time_created;
  // this.currently_playing = currently_playing;
  // this.device_id = device_id;
  // this.spotify_user_id = spotify_user_id;
  // this.playlist_id = playlist_id;
  Listening_Party_Create: (pname, did, uid, pid, id, result) => {
    const newParty = new Listening_Party(pname, new Date().toISOString().slice(0, 19).replace('T', ' '), 1, did, uid, pid, id)
    connection.query("INSERT INTO Listening_Party SET ?", newParty, (err, res) =>{
      if (err) {
        console.log("error: ", err);
        //result(err, null);
        return err;
      }
      console.log("created party: ", { ...newParty });
      //result(null, { id: res.id, ...newParty });
      return res;
    });
},
  Users_Create: (fname, utype, uid) => {
  const newUser = new User(fname, utype, uid)
  connection.query("INSERT INTO Users SET ?", newUser, (err, result) =>{
    if (err) {
      console.log("error: ", err);
      //result(err, null);
      return err;
    }
    console.log("created user: ", { ...newUser });
    return result;
    //result(null, { id: result.id, ...newUser });
  });
},
Voting_Record_Create: (fun_name, id, vote, spotify_id, time_added) => {
  const newRecord = new Voting_Record(fun_name, id, vote, new Date().toISOString().slice(0, 19).replace('T', ' '), spotify_id, time_added)
  connection.query("INSERT INTO Voting_Record SET ?", newRecord, (err, result) =>{
    if (err) {
      console.log("error: ", err);
      //result(err, null);
      return err;
    }
    console.log("created user: ", { ...newRecord });
    return result;
    //result(null, { id: result.id, ...newRecord });
  });
},
Song_Create: (spotify_id, id, song_length, playlist_position) => {
  const newSong = new Song(spotify_id, id, song_length, new Date().toISOString().slice(0, 19).replace('T', ' '), null, playlist_position)
  const lastPos = new Song(spotify_id, id, song_length, new Date().toISOString().slice(0, 19).replace('T', ' '), null, playlist_position)
  
  connection.query("INSERT INTO Song SET ?", newSong, (err, result) =>{
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created user: ", { ...newSong });
    result(null, { id: result.id, ...newSong });
  });
},

//READ
Listening_Party_Read: (id) => {
  connection.query("SELECT * FROM `Listening_Party` WHERE `id` = '"+id+"')", (err, result) =>{
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log(result);
    result(null, result);
});
},
User_Read: (fun_name, id) => {
  connection.query("SELECT * FROM `Users` WHERE `id` = '"+id+" and  `fun_name` = '"+fun_name+"')", (err, result) =>{
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log(result);
    result(null, result);
});
},
Song_Read: (id, spotify_id, time_added) => {
  connection.query("SELECT * FROM `Song` WHERE `id` = '"+id+" and  `spotify_id` = '"+spotify_id+"' and  `time_added` = '"+time_added+"')", (err, result) =>{
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log(result);
    result(null, result);
});
},
Voting_Read: (fun_name, id, spotify_id, time_added) => {
  connection.query("SELECT * FROM `Voting_Record` WHERE  `fun_name` = '"+fun_name+" and `id` = '"+id+" and  `spotify_id` = '"+spotify_id+"' and  `time_added` = '"+time_added+"')", (err, result) =>{
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log(result);
    result(null, result);
});
},
//UPDATE
Listening_Party_Update_Curr_Playing: (id) => {
  connection.query("UPDATE Listening_Party SET currently_playing = currently_playing + 1 WHERE id = ?", [id], (err, result) =>{
    if (err) {
      console.log("error: ", err);
      return err;
    }
    console.log("updated listening_party");
    return result;
});
},
Song_Update_Time_Removed: (spotify_id, id, time_added) => {
  connection.query("UPDATE Song SET time_removed = ? WHERE spotify_id = ? and id = ? and time_added = ?", [new Date().toISOString().slice(0, 19).replace('T', ' '), spotify_id, id, time_added], (err, result) =>{
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("updated song");
    result(null, result);
});
},
Voting_Time_Removed: (spotify_id, id, time_added) => {
  connection.query("UPDATE Song SET time_removed = ? WHERE spotify_id = ? and id = ? and time_added = ?", [new Date().toISOString().slice(0, 19).replace('T', ' '), spotify_id, id, time_added], (err, result) =>{
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("updated song");
    result(null, result);
});
},
//EXTRA
Listening_Party_Lookup: (id) => {
  connection.query("SELECT EXISTS( SELECT 1 FROM `Listening_Party` WHERE `id` = '"+id+"')", (err, result) =>{
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log(result);
});
},


};


// Customer.findById = (partyId, result) => {
//   sql.query(`SELECT * FROM Listening_Party WHERE id = ${partyId}`, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }

//     if (res.length) {
//       console.log("found party: ", res[0]);
//       result(null, res[0]);
//       return;
//     }

//     // not found Customer with the id
//     result({ kind: "not_found" }, null);
//   });
// };



// Customer.updateById = (id, new_song, result) => {
//   sql.query(
//     "UPDATE listening_party SET currently_playing = ? WHERE id = ?",
//     [new_song, id],
//     (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(null, err);
//         return;
//       }

//       if (res.affectedRows == 0) {
//         // not found Customer with the id
//         result({ kind: "not_found" }, null);
//         return;
//       }

//       console.log("updated party");
//       result(null, { PermissionStatus });
//     }
//   );
// };

// Customer.remove = (id, result) => {
//   sql.query("DELETE FROM customers WHERE id = ?", id, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     if (res.affectedRows == 0) {
//       // not found Customer with the id
//       result({ kind: "not_found" }, null);
//       return;
//     }

//     console.log("deleted customer with id: ", id);
//     result(null, res);
//   });
// };

// Customer.removeAll = result => {
//   sql.query("DELETE FROM customers", (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     console.log(`deleted ${res.affectedRows} customers`);
//     result(null, res);
//   });
// };

// module.exports = Customer;

// module.exports = function(app){
//   app.get("/test/database", (req, res) => {
//     let sql =
//       "CREATE TABLE employee(id int AUTO_INCREMENT, name VARCHAR(255), designation VARCHAR(255), PRIMARY KEY(id))";
//     connection.query(sql, (err) => {
//       if (err) {
//         throw err;
//       }
//       res.send("Employee table created");
//     });
//   });
// }


module.exports = db_client;