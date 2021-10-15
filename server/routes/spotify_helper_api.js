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
            console.log(process.env.ACCESS_TOKEN);
            const parameters = `?${querystring.stringify(parameterSong)}`;
            const urlWithParameters = `${process.env.SPOTIFY_API_BASE_URL}${'search'}${parameters}`;
            try{
                const result = await axios.get(urlWithParameters, {
                    headers: {
                        'Authorization' : `Bearer ${process.env.ACCESS_TOKEN}`
                    }  
                });
                const currSong = await result.data;
                if (currSong.tracks.items.length > 5) {
                    return currSong.tracks.items.slice(0, 5);
                }
                else {
                    return currSong.tracks.items
                }
            }
            catch(error){
                console.log(error);
            }
        }
    }
module.exports = spotifyClient;