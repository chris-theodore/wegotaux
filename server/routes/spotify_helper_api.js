const querystring = require('querystring');
const axios = require('axios');


const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });


const spotifyClient = {
    searchAPI: async (song, artistq) => {
            const parameterSong = {
                q: song,
                type: 'track',
                artist: artistq,
                market: 'US'
            };
            console.log('in search');
            const parameters = `?${querystring.stringify(parameterSong)}`;
            const urlWithParameters = `${process.env.SPOTIFY_API_BASE_URL}${'search'}${parameters}`;
            console.log(urlWithParameters);
         
            const result = await axios.get(urlWithParameters, {
                headers: {
                    'Authorization' : `Bearer ${process.env.ACCESS_TOKEN}`
                }
            });
            if (result.ok) {
                const currSong = await result.json();
                if (currSong.tracks.items.length > 5) {
                    return currSong.tracks.items.slice(0, 5);
                }
                else {
                    return currSong.tracks.items
                }
            } else {
                console.log()
                throw new Error(`API Access Error ${result.status} for URL: ${urlWithParameters}`);
            }
        }
    }
module.exports = spotifyClient;