const querystring = require('querystring');
const qs = require('qs');
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
        },
    deviceAPI: async () => {
        const urlWithParameters = `${process.env.SPOTIFY_API_BASE_URL}${'me/'}${'player/'}${'devices'}`;
        const result = await axios.get(urlWithParameters, {
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        const currDevices = await result.data;
        if (currDevices.status = 200) {
            return currDevices;
        } else {
            throw new Error(`API Access Error ${result.status} for URL: ${urlWithParameters}`);
        }
    },
    create_playlistAPI: async (name, description) => {
          const urlWithParameters = `${process.env.SPOTIFY_API_BASE_URL}${'users/'}${process.env.SPOTIFY_API_USER_ID}${'/playlists'}`;
          const result = await axios.post(
            urlWithParameters,
            {
                'name': name,
                'description': description,
                'public': true,
            },
            {
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            });
                  if(result.status == 200 || result.status == 201){
                        return result.data;
                    }
                    else{
                        throw new Error(`API Access Error ${result.status} for URL: ${urlWithParameters}`);
                    }
            },
    enqueueAPI: async (trackuri, device) => {
        const parameterQueue = {
            uri: "spotify:track:".concat(trackuri),
            device_id: device,
          };
        console.log('in queue');
        const parameters = `?${qs.stringify(parameterQueue)}`;
        const headers = {
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
          };
        const urlWithParameters = `${process.env.SPOTIFY_API_BASE_URL}${'me/'}${'player/'}${'queue'}${parameters}`;
        //const urlWithParameters = `${process.env.SPOTIFY_API_BASE_URL}${'me/'}${'player/'}${'queue'}`;
        try {
            const response = await axios.post(
              urlWithParameters,
               null,
               headers
            );
            console.log(response.data);
            return response.data;
          } catch (error) {
            console.log(error);
          }
    },
    start_playbackAPI: async (songs, did) => {
        //where songs is a json array
        //{"songs": [
            //{"song" : "{id}"},
            //{"song" : "{id}"},
            //{"song" : "{id}"}
      //   ]
   //     }

        //const urlWithParameters = `${process.env.SPOTIFY_API_BASE_URL}${'me/'}${'player/'}${'play'}${'?device_id='}${did}`;
        const urlWithParameters = `${process.env.SPOTIFY_API_BASE_URL}${'me/'}${'player/'}${'play'}${'?device_id='}${process.env.DEVICE_ID}`;
        console.log(urlWithParameters);
        console.log(process.env.DEVICE_ID);
        let song_uris = [];
        songs.forEach(function(selection) {
            song_uris.push("spotify:track:".concat(selection.song));
        });
        const test = JSON.stringify({
            uris: song_uris,
            offset: { "position": 0 }
        });
        console.log(test);
        try{
        const res = await axios.put(urlWithParameters, 
            test,
        {
        headers: {
            'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        }).then(function(response){
            console.log(response.data)
        });
           return true;
        } catch(err){
            return false;
        }
    },
    add_playlistAPI: async (songs, pid) => {
        //where songs is a json array
        //{"songs": [
            //{"song" : "{id}"},
            //{"song" : "{id}"},
            //{"song" : "{id}"}
         //   ]
          //     }
        let song_uris = [];
   
        songs.forEach(function(selection) {
            
            song_uris.push("spotify:track:".concat(selection));
        });
        const test = JSON.stringify({
            uris: song_uris
        });
        //const urlWithParameters = `${process.env.SPOTIFY_API_BASE_URL}${'playlists/'}${pid}${'/tracks'}`;
        const urlWithParameters = `${process.env.SPOTIFY_API_BASE_URL}${'playlists/'}${process.env.PLAYLIST_ID}${'/tracks'}`;
        console.log(urlWithParameters);
        try{
        const res = await axios.post(urlWithParameters, 
            test,
        {
        headers: {
            'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        }).then(function(response){
            console.log(response.data)
        });
           return true;
        } catch(err){
            console.log(err);
            return false;
        }
    },
    playback_stateAPI: async () => {
        //first url get user's current playback state
        //const urlWithParameters = `${process.env.SPOTIFY_API_BASE_URL}${'me/'}${'player'}`;
        //second url gets user's currently playing song
        const urlWithParameters = `${process.env.SPOTIFY_API_BASE_URL}${'me/'}${'player/'}${'currently-playing'}`;
        const result = await axios.get(urlWithParameters, {
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        const currState = await result.data;
        if (result.status = 200) {
            return currState;
        } else {
            throw new Error(`API Access Error ${result.status} for URL: ${urlWithParameters}`);
        }
    }
}
module.exports = spotifyClient;
