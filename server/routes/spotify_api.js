const spotifyClient = require('./spotify_helper_api');

module.exports = function(app){
    app.route('/song/search')
    .get(searchAPI);

    app.route('/find/device')
    .get(deviceAPI);

    app.route('/')
    .get(initialAPI);

    app.route('/new/playlist')
    .get(create_playlistAPI);

    app.route('/start/playback')
    .get(start_playbackAPI);

    app.route('/add/queue').
    get(enqueueAPI);

    app.route('/add/playlist').
    get(add_playlistAPI);

    app.route('/currently/playing').
    get(playback_stateAPI);

}

function initialAPI(request, response){
    response.json({message: 'we did it'});
}

async function searchAPI(request, response, next) {
        try {
            console.log(request.query.type, request.query.search, request.query.artist, request)
            const songData = await spotifyClient.searchAPI(request.query.track, request.query.artist);
            results = []
            songData.forEach(song => results.push({
                title: song.name,
                artist: song.artists[0].name,
                picUrl: song.album.images[1].url,
                songType: song.album.album_type,
                albumName: song.album.name,
                releaseDate: song.album.release_date,
                extUrl: song.external_urls,
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
        const results = await spotifyClient.start_playbackAPI(request.body.songs, request.query.device_id);
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

