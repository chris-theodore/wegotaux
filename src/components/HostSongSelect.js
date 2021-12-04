import React, {useContext, useState} from "react";
import { useHistory, useParams } from "react-router-dom";
import {Form, Button} from "react-bootstrap";
import '../styles/HostSongSelect.css' // CSS imported
import axios from 'axios';
import querystring from 'querystring';
import Create from './Create.js';
import '../styles/CopySearch.css' // CSS imported
import CodeContext from "./Create";


// Search Code
let songnameArray = [];
let songIDArray = [];
let songPicArray = [];
let songlengthArray = [];

// HTML Zone 
export default function HostSongSelect() {
    //Search Code
    let transfer_song;
    let {uid, lid} = useParams();
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
        console.log("HEREEE");
        console.log(dataB.data);
    }
    async function addSong(song_uri, song_img, song_title,song_length, song_artist, party_code){
        console.log(song_uri);
        songlengthArray.push(song_length);
        songnameArray.push(song_title);
        songPicArray.push(song_img);
        songIDArray.push(song_uri);
        const tempArray = []
        tempArray.push(song_uri)
        let songs_formatted = []
        tempArray.forEach(id => songs_formatted.push({
            song: song_uri
        }))
        // const parametersDB = {
        //     sid: song_uri,
        //     lid: party_code.lid,
        //     songlength: song_length,
        // };
        let req_body = {songs: songs_formatted}
        console.log(req_body);
        // const parameters = `?${querystring.stringify(parametersDB)}`;
        const urlOther = `${'http://localhost:5000/add/playlist?playlist_id='}${Create.playlistid}`;
        let otherdata = await axios.post(urlOther, req_body);
        // const dbSend = `${'http://localhost:5000/'}${'db/add/song'}${parameters}`
        // const dbAddSong = await axios.get(dbSend);
        // console.log(dbAddSong);
        console.log(song_img);
        console.log(songPicArray);
        console.log(songnameArray);
        // alert("Song added!");
        setSongsTerm([]);
    }
    async function finalAdd(song_array){
        if(song_array !== 3){
            console.log("chris test")
        }
        let playback_init = song_array.slice(0,2);
        let songs_formatted = []
        playback_init.forEach(id => songs_formatted.push({
            song: id
        }))
        let req_body = {songs: songs_formatted}
 
        const urlWithParams = `${'http://localhost:5000/start/playback?device_id='}${Create.deviceID}`;
        let data = await axios.post(urlWithParams,req_body);
         
        handleSubmit();
    }
    //End of Search Code
    const history = useHistory();

    async function handleSubmit(){
        if(true) {
            let parameterDB = {
                lid: lid,
                sid: songIDArray[2],
                img: songPicArray[2],
                title: songnameArray[2]
            };
            const parameters = `?${querystring.stringify(parameterDB)}`;
            const dbSend = `${'http://localhost:5000/'}${'db/create/song'}${parameters}`;
            const dbresponse = await axios.get(dbSend);
  
            history.push(`/host${'/'}${uid}${'/'}${lid}`,
                  {second:  {song_id: songIDArray[1], song_name: songnameArray[1], song_pic : songPicArray[1], song_length: songlengthArray[1]}, third: {song_id: songIDArray.slice(-1)[0], song_name: songnameArray.slice(-1)[0], song_pic : songPicArray.slice(-1)[0], song_length: songlengthArray.slice(-1)[0], custom_id: dbresponse.data.code}});
        }
    }

    return (
        <section id="host-select">
            <h1> Party Code: {lid} </h1>
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
                dataB.map(data => <li key = {data.id}> <img src={data.picUrl} alt="Album Cover"/> Song Name: {data.title} {"\n"} Artist: {data.artist} <Button onClick={()=>addSong(data.id, data.picUrl, data.title, data.artist, data.songlength, {lid})}> Add me! </Button></li>)
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