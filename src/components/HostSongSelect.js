import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import {Form, Button} from "react-bootstrap";
import '../styles/HostSongSelect.css' // CSS imported
import axios from 'axios';
import querystring from 'querystring';
import Create from './Create.js';
import '../styles/CopySearch.css' // CSS imported

// Search Code
let songnameArray = [];
let songIDArray = [];
let songPicArray = [];
// HTML Zone 
export default function HostSongSelect() {
    //Search Code
    const[dataB, setData] = React.useState([]);
    const [songsName, setSongsTerm] = React.useState([]);
    const [artistsName, setArtistsTerm] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');


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
    async function addSong(song_uri, song_img, song_title){
        console.log(song_uri);
        songnameArray.push(song_title);
        songPicArray.push(song_img);
        songIDArray.push(song_uri);
        const tempArray = []
        tempArray.push(song_uri)
        let songs_formatted = []
        tempArray.forEach(id => songs_formatted.push({
            song: song_uri
        }))
        let req_body = {songs: songs_formatted}
        console.log(req_body);
        const urlOther = `${'http://localhost:5000/add/playlist?playlist_id='}${Create.playlistid}`;
        let otherdata = await axios.post(urlOther, req_body);
        console.log(song_img);
        console.log(songPicArray);
        console.log(songnameArray);
        setSongsTerm([]);
    }
    async function finalAdd(song_array){
        if(song_array != 3){
            console.log("chris test")
        }
        let songs_formatted = []
        song_array.forEach(id => songs_formatted.push({
            song: id
        }))
        console.log("TEST HERE")
        console.log(songs_formatted);
        let req_body = {songs: songs_formatted}
        console.log("HERE WE ARE");
        console.log(Create.deviceID);
        console.log(req_body);
        const urlWithParams = `${'http://localhost:5000/start/playback?device_id='}${Create.deviceID}`;
        console.log(urlWithParams);
        let data = await axios.post(urlWithParams,req_body);
        console.log(data);
        handleSubmit();
    }
    //End of Search Code
    const history = useHistory();

    function handleSubmit(){
        if(true) {
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
    </div>
        <Button onClick={()=>getSong(songsName,artistsName)} variant="info" type="submit">
          Search!
        </Button>
        <React.Fragment>
            <ul>
                {
                dataB.map(data => <li key = {data.id}> <img src={data.picUrl} alt="Album Cover"/> Song Name: {data.title} {"\n"} Artist: {data.artist} <Button onClick={()=>addSong(data.id, data.picUrl, data.title)}> Add me! </Button></li>)
}     
            </ul>
            </React.Fragment>
    </div>
    <Button id="final-submit" onClick={()=>finalAdd(songIDArray)}> Party time! </Button>

            <div id="song-view">
               <div class="song-card">
                    <img class="sc-album-art" src={songPicArray[0]}></img>
                    <p>{songnameArray[0]}</p>
               </div>
               <div class="song-card">
                    <img class="sc-album-art" src={songPicArray[1]}/>
                    <p>{songnameArray[1]}</p>
               </div>
               <div class="song-card">
                    <img class="sc-album-art" src={songPicArray[2]}/>
                    <p>{songnameArray[2]}</p>
               </div>
           </div>
        </section>
    );
}