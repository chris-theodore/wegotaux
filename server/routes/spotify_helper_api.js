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
    newplaylistAPI: async (name, description) => {
          const urlWithParameters = `${process.env.SPOTIFY_API_BASE_URL}${'users/'}${process.env.SPOTIFY_API_USER_PROFILE_ID}${'/playlists'}`;
          const result = await axios.post(
            urlWithParameters,
            {
                'name': name,
                'description': descrip,
                'public': true,
            },
            {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
                },
            }
          );
          const 
         
                  console.log(data);
                  if(data){
                    SPOTIFY_API.PLAYLIST_INFO = data;
    
                    //modResp = await modifyExistingPlaylist();
                    res.status(200).json(SPOTIFY_API.PLAYLIST_INFO);
                      //res.json(SPOTIFY_API.PLAYLIST_INFO);
                    }
                    else{
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

    }
module.exports = spotifyClient;