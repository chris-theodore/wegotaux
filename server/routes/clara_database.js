const { v4: uuidv4 } = require('uuid');
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

const Song = function(spotify_id, party_id, song_id, song_length, is_removed, playlist_position){
  this.spotify_id = spotify_id;
  this.party_id = party_id;
  this.song_id = song_id;
  this.song_length = song_length;
  this.is_removed = is_removed;
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
Song_Create: (spotify_id, party_id, song_length) => {
  let position;
  connection.query("SELECT COALESCE(MAX(playlist_position),0) AS value FROM Song WHERE party_id = "+parseInt(party_id)+"")
  .then(position => {
    const newSong = new Song(spotify_id, party_id, uuidv4(), song_length, 0, position);
  connection.query("INSERT INTO Song SET ?", newSong, (err, result) =>{
    if (err) {
      console.log("error: ", err);
      return err;
    }
    console.log("created song: ", { ...newSong });
    return result;
  });
  });
  
  console.log(position);
  
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


  function Find_Playlist_Position (id) {
    connection.query("SELECT COALESCE(MAX(playlist_position),0) AS value FROM Song WHERE party_id = "+parseInt(id)+"", (err, result) => {
      if (err) {
        console.log("error: ", err);
        return err;
      }
      //console.log(result[0].value);
      return result[0].value;
    });
  }





module.exports = db_client;