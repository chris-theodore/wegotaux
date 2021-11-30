const spotifyClient = require('./spotify_helper_api');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

module.exports = function(app){
    app.route('/song/search')
    .get(searchAPI);

    app.route('/find/device')
    .get(deviceAPI);

    app.route('/')
    .get(initialAPI);

    app.route('/init/party')
    .get(saveEnv);

    app.route('/new/playlist')
    .get(create_playlistAPI);

    app.route('/start/playback')
    .post(start_playbackAPI);

    app.route('/add/queue').
    get(enqueueAPI);

    app.route('/add/playlist').
    post(add_playlistAPI);

    app.route('/currently/playing').
    get(playback_stateAPI);

    app.route('/skip/song')
    .post(skip_songAPI);


}

function initialAPI(request, response){
    response.json({message: 'we did it'});
}

function saveEnv(request, response){
    console.log("SAVING ENV VARIABLES");
    console.log(request.query);
    process.env.DEVICE_ID = request.query.deviceid;
    process.env.PLAYLIST_ID = request.query.playlistid;
    console.log(process.env.DEVICE_ID);
    console.log(process.env.PLAYLIST_ID);
    response.json({message: 'we saved the variable'});
}


async function searchAPI(request, response, next) {
        try {
            console.log(request.query.type, request.query.search, request.query.artist, request)
            const songData = await spotifyClient.searchAPI(request.query.track, request.query.artist);
            let results = []
            songData.forEach(song => results.push({
                id: song.id,
                title: song.name,
                artist: song.artists[0].name,
                picUrl: song.album.images[1].url,
                songType: song.album.album_type,
                albumName: song.album.name,
                releaseDate: song.album.release_date,
                extUrl: song.external_urls,
                songlength: song.duration_ms,
            }));
            console.log(results);
            response.json(results);
        }
        catch (error) {
            console.log(error);
            const err = new Error('Error: Check server --- one or more APIs are currently unavailable.');
            err.status = 503;
            next(err);
        }
    };

async function deviceAPI(request, response, next) {
    try {
        const results = await spotifyClient.deviceAPI();
        response.json(results);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error: Check server --- one or more APIs are currently unavailable.');
        err.status = 503;
        next(err);
    }
};

async function start_playbackAPI(request, response, next) {
    try {
        //request.body.songs is an array of track uris that the 
        //host user has selected as the initial songs to start the party
        console.log("in playback function");
        console.log("device_id:");
        console.log(request.query.device_id);
        console.log(request.body.songs);
        const results = await spotifyClient.start_playbackAPI(request.body.songs, request.query.device_id);
        console.log(results);
        response.json(results);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error: Check server --- one or more APIs are currently unavailable.');
        err.status = 503;
        next(err);
    }
};

async function create_playlistAPI(request, response, next) {
    try {
        const results = await spotifyClient.create_playlistAPI(request.query.name, request.query.descrip);
        response.json(results);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error: Check server --- one or more APIs are currently unavailable.');
        err.status = 503;
        next(err);
    }
};


async function enqueueAPI(request, response, next) {
    try {
        const results = await spotifyClient.enqueueAPI(request.query.trackuri, request.query.device);
        console.log("POST CALL");
        //console.log(results);
        response.json(results);
        }
    catch (error) {
        //console.log(error);
        const err = new Error('Error: Check server --- one or more APIs are currently unavailable.');
        err.status = 503;
        next(err);
    }
};


async function add_playlistAPI(request, response, next) {
    try {
        const results = await spotifyClient.add_playlistAPI(request.body.songs, request.query.playlist_id);
        response.json(results);
        }
    catch (error) {
        //console.log(error);
        const err = new Error('Error: Check server --- one or more APIs are currently unavailable.');
        err.status = 503;
        next(err);
    }
};

async function playback_stateAPI(request, response, next) {
    try {
        const results = await spotifyClient.playback_stateAPI();
        //if results are null, that means user is currently not
        //listening to audio through Spotify
        response.json(results);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error: Check server --- one or more APIs are currently unavailable.');
        err.status = 503;
        next(err);
    }
};

async function skip_songAPI(request, response, next) {
    try {
        const results = await spotifyClient.skip_songAPI(process.env.DEVICE_ID);
        response.json(results);
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error: Check server --- one or more APIs are currently unavailable.');
        err.status = 503;
        next(err);
    }
};


