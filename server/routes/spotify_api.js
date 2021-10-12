const axios = require('axios');

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
            console.log(req.query.track, req.query.artist, req)
            const songData = await spotifyClient.searchAPI(req.query.track, req.query.artist);
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
            res.json(results);
        }
        catch (error) {
            console.log(error);
            const err = new Error('Error: Check server --- one or more APIs are currently unavailable.');
            err.status = 503;
            next(err);
        }
    };





function postAPI(request, response) {
    family[request.body.isbn] = {
        name: request.body.name,
        relationship: request.body.relationship,
        age: request.body.age
    }

    response.json({message: 'Success'});
}