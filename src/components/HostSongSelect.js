import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import {Form, Button} from "react-bootstrap";
import '../styles/HostSongSelect.css' // CSS imported
import axios from 'axios';
import querystring from 'querystring';
import Create from './Create.js';
import '../styles/CopySearch.css' // CSS imported

// Search Code

// HTML Zone 
export default function HostSongSelect() {
    //Search Code
    const[dataB, setData] = React.useState([]);
    const [songsName, setSongsTerm] = React.useState([]);
    const [artistsName, setArtistsTerm] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    var songnameArray = [];
    var songPicArray = [];

    async function getSong(song,artist){
        const parameterSong = {
            track: song, artist,
            // artist: artist
        };
        const parameters = `?${querystring.stringify(parameterSong)}`;
        const urlWithParameters = `${'http://localhost:5000/song/search'}${parameters}`;
        console.log(urlWithParameters);
        const response = await axios.get(urlWithParameters);
        console.log(response)
        console.log(response.data)
        if (setData != []) {
            setData([])
        }
        setData(response.data);
        console.log(setData);
    }
    async function addSong(song_uri, song_img){
        songnameArray.push(song_uri);
        songPicArray.push(song_img);
        console.log(song_img);
        console.log(songPicArray);
        console.log(songnameArray);
    }
    async function finalAdd(song_array){
        let songs_formatted = []
        song_array.forEach(id => songs_formatted.push({
            song: id
        }))
        let req_body = {songs: songs_formatted}
        console.log("HERE WE ARE");
        //console.log(Create.deviceID);
        const urlWithParams = `${'http://localhost:5000/start/playback?device_id='}${Create.deviceID}`;
        console.log(urlWithParams);
        let data = await axios.post(urlWithParams,req_body);
        console.log(data);
    }
    //End of Search Code
    const history = useHistory();

    function handleSubmit(){
        if(true) { // replace true with back end check to validate code
            history.push("/host");
        }
    }

    return (
        <section id="host-select">
            <h1>Select 3 songs to kick off your party!</h1>
            <div>
        <div className = "search-inputs">
        < input
        type="song"
        value={songsName}
        onChange={e => setSongsTerm(e.target.value)}
        placeholder="Search Song or Artist Name"
      />
      {/* <input
        type="artist"
        value={artistsName}
        onChange={e => setArtistsTerm(e.target.value)}
        placeholder="Search Artist Name"
      /> */}
    </div>
        <Button onClick={()=>getSong(songsName,artistsName)} variant="info" type="submit">
          Search!
        </Button>
        <React.Fragment>
            <ul>
                {
                dataB.map(data => <li key = {data.id}> <img src={data.picUrl} alt="Album Cover"/> Song Name: {data.title} {"\n"} Artist: {data.artist} <Button onClick={()=>addSong(data.id, data.picUrl)}> Add me! </Button></li>)
}     
            </ul>
            </React.Fragment>
    </div>
    <Button id="final-submit" onClick={()=>finalAdd(songnameArray)}> Party time! </Button>

            <div id="song-view">
               <div class="song-card">
                    <img class="sc-album-art" src={songPicArray[0]}/>
                    <p>Song Name #1</p>
               </div>
               <div class="song-card">
                    <img class="sc-album-art" src={songPicArray[1]}/>
                    <p>Song Name #2</p>
               </div>
               <div class="song-card">
                    <img class="sc-album-art" src={songPicArray[2]}/>
                    <p>Song Name #3</p>
               </div>
           </div>
        </section>
    );
}