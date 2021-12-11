const dbClient = require('./database_helper_api');
const dotenv = require('dotenv');
const { Voting_Record_Lookup } = require('./database_helper_api');
dotenv.config({ path: '../.env' });

module.exports = function(app){
    app.route('/db/create/party')
    .get(create_listening_party_API);

    app.route('/db/alter/party')
    .get(change_listening_party_API);

    app.route('/db/alter/song')
    .get(change_song_API);

    app.route('/db/create/user')
    .get(create_user_API);

    app.route('/db/create/voterecord')
    .get(create_vote_record_API);

    app.route('/db/create/song')
    .get(create_song_API);

    app.route('/db/read/listening_party')
    .get(read_listening_party_API);

    app.route('/db/read/users')
    .get(read_users_API);

    app.route('/db/check/user')
    .get(check_user_API);

    app.route('/db/read/song')
    .get(read_song_API);

    app.route('/db/read/first_block')
    .get(read_fblock_API);

    app.route('/db/read/voterecord')
    .get(read_vote_record_API);

    app.route('/db/read/queue')
    .get(read_queue_API);

    app.route('/db/change/vote')
    .get(change_vote_API);

    app.route('/db/delete/listening_party')
    .get(delete_listening_party_API);

    app.route('/db/delete/user')
    .get(delete_user_API);

    app.route('/db/delete/song')
    .get(delete_song_API);

    app.route('/db/delete/song_vote')
    .get(delete_song_vote_API);

    app.route('/db/generate/votingblock')
    .get(generate_voting_block_API);

    app.route('/db/voterecord/lookup')
    .get(voting_record_lookup_API);

    app.route('/get/queue')
    .get(voting_record_queue_API);
    

}

function create_listening_party_API(request, response){
    //console.log("in call!");
    //console.log(request.query);
    let result = dbClient.Listening_Party_Create(request.query.playlistname, request.query.deviceid, request.query.userid, request.query.playlistid, request.query.id);
    response.json(result);
}


async function read_users_API(request, response){
    let result = await dbClient.User_Read(request.query.id);
    //console.log(result);
    response.json(result);
}

async function check_user_API(request, response){
    let result = await dbClient.User_Check(request.query.fname, request.query.id);
    //console.log(result);
    response.json(result);
}

async function voting_record_queue_API(request, response){
    let result = await dbClient.Voting_Record_Queue(request.query.lid);
    //console.log(result);
    response.json(result);
}

async function read_song_API(request, response){
    let result = await dbClient.Song_Read(request.query.sid);
    ////console.log(result);
    //console.log(JSON.parse(JSON.stringify(result)));
    response.json(result);
}


async function read_listening_party_API(request, response){
    let result = await dbClient.Listening_Party_Read(request.query.id);
    //console.log("back");
    //console.log(result);
    response.json(result);
}

async function read_vote_record_API(request, response){
    let result = await dbClient.Voting_Read(request.query.fname, request.query.id, request.query.sid);
    //console.log(result);
    response.json(result);
}

async function read_queue_API(request, response){
    let result = await dbClient.Queue_Read(request.query.id);
    //console.log(result);
    response.json(result);
}

async function read_fblock_API(request, response){
    let result = await dbClient.First_block_Read(request.query.id);
    //console.log(result);
    response.json(result);
}

async function create_song_API(request, response){
    let result = await dbClient.Song_Create(request.query.sid, request.query.lid, request.query.img, request.query.title, request.query.is_removed, request.query.on_queue);
    //console.log(result);
    response.json({code: result});
}


function create_vote_record_API(request, response){
    let result = dbClient.Voting_Record_Create(request.query.fname, request.query.uid, request.query.vote, request.query.sid);
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

function change_song_API(request, response){
    let result = dbClient.Song_Update_Removed(request.query.sid, request.query.id);
    response.json(result);
}


function change_vote_API(request, response){
    let result = dbClient.Voting_Record_Update_Vote(request.query.vote, request.query.fun_name,request.query.id,request.query.sid);
    response.json(result);
}

function delete_listening_party_API(request, response){
    let result = dbClient.Listening_Party_Delete(request.query.id);
    response.json(result);
}

function delete_user_API(request, response){
    let result = dbClient.User_Delete_Indiv(request.query.fname, request.query.id);
    response.json(result);
}

function delete_song_API(request, response){
    let result = dbClient.Song_Delete_Indiv(request.query.id);
    console.log(result);
    response.json(result);
}
function delete_song_vote_API(request, response){
    let result = dbClient.Song_Delete_Vote(request.query.id, request.query.songid);
    console.log(result);
    response.json(result);
}


async function generate_voting_block_API(request, response){
    let result = await dbClient.Generate_Voting_Block(request.query.id);
    // //console.log("heyyyyyooooooo");
    // //console.log(result);
    response.send(result);
}

async function voting_record_lookup_API(request, response){
    //console.log("here we are");
    let result = await dbClient.Voting_Record_Lookup(request.query.fname, request.query.id, request.query.songid);
    //console.log(result);
    response.send({exists: result});
}




