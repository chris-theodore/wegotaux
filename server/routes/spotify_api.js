const spotifyClient = require('./spotify_helper_api');

module.exports = function(app){
    app.route('/song/search')
    .get(searchAPI);

    app.route('/')
    .get(initialAPI);
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

