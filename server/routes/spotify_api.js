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

    app.route('/add/queue').
    get(enqueueAPI);
}


function initialAPI(request, response){
    response.json({message: 'we did it'});
}

async function searchAPI(request, response, next) {
        try {
            console.log(request.query.track, request.query.artist, request)
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
        const results = await spotifyClient.create_playlistAPI(request.query.name, request.query.descrip);
        response.json(results);
        app.get(
            '/queue/add',
            async (req, res, next) => {
                const parameterQueue = {
                  uri: "spotify:track:".concat(req.query.trackuri),
                  device_id: req.query.device,
                };
                console.log(req.query.trackuri)
                console.log('in queue');
                const parameters = `?${querystring.stringify(parameterQueue)}`;
                const urlWithParameters = `${SPOTIFY_API.baseURL}${'me/'}${'player/'}${'queue'}${parameters}`;
                console.log(urlWithParameters);
                const settings = {
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${SPOTIFY_API.REFRESH}`,
                    },
                };
                try {
                        const fetchResponse = await fetch(urlWithParameters, settings);
                        if(fetchResponse.status == 204 || fetchResponse.status == 304){
                            console.log('made it to 200 status')
                            res.sendStatus(200);
                            //res.json(SPOTIFY_API.PLAYLIST_INFO);
                          }
                          else{
                            console.log(fetchResponse)
                            res.sendStatus(503);
                          }
                }
                catch (error) {
                    console.log(error);
                    // create error object with useful message
                    const err = new Error('Error: Check server --- one or more APIs are currently unavailable.');
                    // set status code to return with response
                    err.status = 503;
                    // forward error on to next middleware handler (the error handler defined below)
                    next(err);
                }
            },
          );
          
          
    }
    catch (error) {
        console.log(error);
        const err = new Error('Error: Check server --- one or more APIs are currently unavailable.');
        err.status = 503;
        next(err);
    }
};


