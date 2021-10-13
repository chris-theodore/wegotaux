// package that allows certain URLs to access the server
const querystring = require('querystring');
const axios = require('axios');
const SPOTIFY_API_TOKEN = "BQBV6bLloqpWlvvVTFuNnHbUTYY9nCRiGd-l3fhDrxNB8JLouZQKmxnHtYyOOYKrAjHQLHPMJYI_VjvaIHJi7HfGtoVVOn5Eop08BB1lJvFDwc602Cn4x6LJIEFHC14X0ecu8uMcwFi4TNCjZNl8IXNk-63mz2zrScLlMbeSqsWtrl1RWx8G8uLCposKNtFGSS1LATlZqY_XVy3h5V8J_bfNxIBUR5mvU200-9Bo";
const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1/";
//axios.defaults.baseURL = SPOTIFY_API_BASE_URL;
axios.defaults.headers.common = {'Authorization' : `Bearer ${SPOTIFY_API_TOKEN}`};



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
            const urlWithParameters = `${SPOTIFY_API_BASE_URL}${'search'}${parameters}`;
            console.log(urlWithParameters);
         
            const result = await axios.get(urlWithParameters);
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