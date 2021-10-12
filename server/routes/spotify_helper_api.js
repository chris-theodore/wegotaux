// package that allows certain URLs to access the server
const querystring = require('querystring');
const axios = require('axios');
const SPOTIFY_API_TOKEN = "BQA42swMXclJZQzxWa70PdVW2B-2hfQ1okiWWR6peCXdF2etOR0mBo6HdxlQMpVRg_mGNosPxIQYaV7o2IH9FDGUsodfUR6cmVtO5QXKSHxoP-7J0fZkff5xrQ89UZCzn3IUPYcLExDrcJnUBXqwLKkX8jdzV4hkzaSQAhxXtERHvdS18ZhUu2RJNkCaQD0L5eH8zyBz1cCxNQ220kRcP9OcFpNrlCBdhPJUpvHp";
const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";

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
         
            const result = await axios.get(urlWithParameters, {
                headers: {
                    'Authorization': `Bearer ${SPOTIFY_API_TOKEN}`
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