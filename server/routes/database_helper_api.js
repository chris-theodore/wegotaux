const { v4: uuidv4 } = require('uuid');
const config = require('../config.js');
const connection = config.connection;

//constructor
const Listening_Party = function(spotify_playlist_name, time_created,device_id, spotify_user_id, playlist_id, id){
  this.spotify_playlist_name = spotify_playlist_name;
  this.id = id;
  this.time_created = time_created;
  this.device_id = device_id;
  this.spotify_user_id = spotify_user_id;
  this.playlist_id = playlist_id;
}

const Voting_Record = function(fun_name, id, vote, vote_time, song_id){
  this.fun_name = fun_name;
  this.id = id;
  this.vote = vote;
  this.vote_time = vote_time;
  this.song_id = song_id;
}


const User = function(fun_name, user_type, id){
  this.fun_name = fun_name;
  this.user_type = user_type;
  this.id = id;
}

const Song = function(spotify_id, party_id, song_id, is_removed, img, title, on_queue){
  this.spotify_id = spotify_id;
  this.party_id = party_id;
  this.song_id = song_id;
  this.is_removed = is_removed;
  this.on_queue = on_queue;
  this.img = img;
  this.title = title;
}





const db_client = {

 //CREATE

  Listening_Party_Create: (pname, did, uid, pid, id) => {
    const newParty = new Listening_Party(pname, new Date().toISOString().slice(0, 19).replace('T', ' '), did, uid, pid, id)
    connection.query("INSERT INTO Listening_Party SET ?", newParty, (err, res) =>{
      if (err) {
        console.log("error: ", err);
        return err;
      }
      console.log("created party: ", { ...newParty });
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
Voting_Record_Create: (fun_name, id, vote, song_id) => {
  const newRecord = new Voting_Record(fun_name, id, vote, new Date().toISOString().slice(0, 19).replace('T', ' '), song_id)
  connection.query("INSERT INTO Voting_Record SET ?", newRecord, (err, result) =>{
    if (err) {
      console.log("error: ", err);
      return err;
    }
    console.log("created voting record: ", { ...newRecord });
    return result;
  });
},
Song_Create: async (spotify_id, party_id, img, title, is_removed, on_queue) => {
  let new_sid = uuidv4();
    const newSong = new Song(spotify_id, party_id, new_sid, is_removed, img, title, on_queue);
    connection.query("INSERT INTO Song SET ?", newSong, (err, result) =>{
      if (err) {
        console.log("error: ", err);
        return err;
      }
      console.log("created song: ", { ...newSong });
      console.log("here1");
      //return song_id;
      return newSong.song_id;
    });
  return new_sid;
},

//READ
Listening_Party_Read: (id) => {
   return new Promise((resolve, reject) => {
     connection.query("SELECT * FROM Listening_Party WHERE id = ?", [id], async (err, result) =>{
      if (err) {
        return reject(err);
      }
      return resolve(result[0]);
  });
});
},

User_Read: (id) => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM Users WHERE id = ?", [id], async (err, result) =>{
     if (err) {
       return reject(err);
     }
     return resolve(result);
 });
});
},

User_Check: (fun_name, id) => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM Users WHERE fun_name = ? and id = ?", [fun_name, id], async (err, result) =>{
     if (err) {
       return reject(err);
     }
     return resolve(result);
 });
});
},

Song_Read: (song_id) => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM Song WHERE song_id = '?'", [song_id], async (err, result) =>{
     if (err) {
       return reject(err);
     }
     return resolve(result[0]);
 });
});  
},

Queue_Read: (id) => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM Song WHERE party_id = ? AND on_queue = 1 AND is_removed = 1", [id], async (err, result) =>{
     if (err) {
       return reject(err);
     }
     return resolve(result[0]);
 });
});  
},



First_block_Read: (id) => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM Song WHERE party_id = ? AND on_queue = 0 AND is_removed = 0", [id], async (err, result) =>{
     if (err) {
       return reject(err);
     }
     return resolve(result[0]);
 });
});  
},

//SINGLE VOTING RECORD READ
Voting_Read: (fun_name, id, song_id) => {
  return new Promise((resolve, reject) => {

    connection.query("SELECT * FROM Voting_Record WHERE fun_name = ? and id = ? and song_id = '?'", [fun_name, parseInt(id), song_id], async (err, result) =>{
     if (err) {
       return reject(err);
     }
     console.log(result);
     return resolve(result[0]);
 });
});
},

//VOTING BLOCK READ
Voting_Block_Read: (id) => {
  return new Promise((resolve, reject) => {
   
    connection.query("SELECT * FROM Voting_Record WHERE fun_name = ? and id = ? and song_id = '?'", [parseInt(id)], async (err, result) =>{
     if (err) {
       return reject(err);
     }
     console.log(result);
     return resolve(result[0]);
 });
});
},


Song_Update_Removed: (song_id) => {
  connection.query("UPDATE Song SET is_removed = ?, on_queue = ? WHERE song_id = ?", [1,1, song_id], (err, result) =>{
    if (err) {
      console.log("error: ", err);
      return err;
    }
    return result;
});
},
Voting_Record_Update_Vote: (vote, fun_name, id, song_id) => {
  connection.query("UPDATE Voting_Record SET vote = ?, vote_time = ? WHERE fun_name = ? and id = ? and song_id = '?'", [vote, new Date().toISOString().slice(0, 19).replace('T', ' '), fun_name, parseInt(id), song_id], (err, result) =>{
    if (err) {
      console.log("error: ", err);
      return err;
    }
    console.log("updated voting record");
    return result;
});
},

//DELETE 
Listening_Party_Delete: (id) => {
  return new Promise((resolve, reject) => {
    connection.query("DELETE FROM Listening_Party WHERE id = ?", [parseInt(id)], async (err, result) =>{
     if (err) {
       return reject(err);
     }
     return resolve(result[0]);
 });
});  
},
User_Delete_Indiv: (fun_name, id) => {
  return new Promise((resolve, reject) => {
    connection.query("DELETE FROM Users WHERE fun_name = ? and id = ?", [fun_name, parseInt(id)], async (err, result) =>{
     if (err) {
       return reject(err);
     }
     return resolve(result[0]);
 });
});  
},
Song_Delete_Indiv: (song_id) => {
  return new Promise((resolve, reject) => {
    connection.query("DELETE FROM Song WHERE song_id = '?' ", [song_id], async (err, result) =>{
     if (err) {
       return reject(err);
     }
     console.log(result[0]);
     return resolve(result);
 });
});  
},

//EXTRA
Listening_Party_Lookup: (id) => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT EXISTS( SELECT 1 FROM `Listening_Party` WHERE `id` = '"+id+"')", async (err, result) =>{
     if (err) {
       //console.log("error: ", err);
       return reject(err);
     }
     //console.log(result[0]);
   
     return resolve(result[0]);
 });
});
},
Voting_Record_Lookup: (fun_name, id, song_id) => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM Voting_Record WHERE fun_name = ? AND id = ? AND song_id = '?'", [fun_name, parseInt(id), song_id],async (err, result) =>{
     if (err) {
       //console.log("error: ", err);
       return reject(err);
     }
     else{
      if (result && result.length ) {
        console.log('Case row was found!');
        return resolve(1);
      } else {
          return resolve(0);
      }
     }
 });
});
},
Generate_Voting_Block: async (id) => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT Song.spotify_id AS spotify_uid, Song.song_id AS song_id, SUM(Voting_Record.vote) AS total_votes, Song.img AS img, Song.title AS title FROM Voting_Record, Song WHERE (Voting_Record.id = ? AND Voting_Record.song_id = Song.song_id AND Song.is_removed = 0 AND Song.on_queue = 0) GROUP BY Voting_Record.song_id ORDER BY total_votes DESC", [parseInt(id)], async (err, result) =>{
     if (err) {
       return reject(err);
     }
     return resolve(result);
 });
});
}
};

module.exports = db_client;
