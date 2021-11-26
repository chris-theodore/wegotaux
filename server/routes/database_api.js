const dbClient = require('./clara_database');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

module.exports = function(app){
    app.route('/test/db')
    .get(create_listening_party_API);

    app.route('/test/db/alt')
    .get(change_listening_party_API);

    app.route('/test/db/users')
    .get(create_user_API);

    app.route('/test/db/voterecord')
    .get(create_vote_record_API);

    app.route('/test/db/songs/add')
    .get(create_song_API);

    //app.route('/test/db/songs/remove')
    //.get(update_song_API);
}

function create_listening_party_API(request, response){
    let result = dbClient.Listening_Party_Create(request.query.playlistname, request.query.deviceid, request.query.userid, request.query.playlistid, request.query.id, null);
    response.json(result);
}

function create_song_API(request, response){
    //(spotify_id, id, song_length, new Date().toISOString().slice(0, 19).replace('T', ' '), null, playlist_position)
    //spotify_id, party_id, song_id, song_length, is_removed, playlist_position
    let result = dbClient.Song_Create(request.query.sid, request.query.lid, request.query.songlength);
    response.json(result);
}

function create_vote_record_API(request, response){
    let result = dbClient.Voting_Record_Create(request.query.fname, request.query.uid, request.query.vote, request.query.sid, request.query.timeadded);
    response.json(result);
}

function create_user_API(request, response){
    let result = dbClient.Users_Create(request.query.fname, request.query.utype, request.query.uid);
    response.json(result);
}


function change_listening_party_API(request, response){
    let result = dbClient.Listening_Party_Update_Curr_Playing(request.query.id);
    response.json(result);
}






