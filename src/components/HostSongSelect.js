import React, {useContext, useState} from "react";
import { useHistory, useParams } from "react-router-dom";
import {Form, Button} from "react-bootstrap";
import '../styles/HostSongSelect.css' // CSS imported
import axios from 'axios';
import querystring from 'querystring';
import Create from './Create.js';
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
        if (songnameArray.length < 3){
        const urlOther = `${'http://localhost:5000/add/playlist?playlist_id='}${Create.playlistid}`;
        let otherdata = await axios.post(urlOther, req_body);
        // const dbSend = `${'http://localhost:5000/'}${'db/add/song'}${parameters}`
        // const dbAddSong = await axios.get(dbSend);
        // console.log(dbAddSong);
        console.log(song_img);
        console.log(songPicArray);
        console.log(songnameArray);
        }
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
                title: songnameArray[2],
                is_removed: 0,
                on_queue: 0
            };
            let parameterDB2 = {
                lid: lid,
                sid: songIDArray[1],
                img: songPicArray[1],
                title: songnameArray[1],
                is_removed: 1,
                on_queue: 1

            };
          
            const parameters = `?${querystring.stringify(parameterDB)}`;
            const parameters2 = `?${querystring.stringify(parameterDB2)}`;
            
            const dbSend = `${'http://localhost:5000/'}${'db/create/song'}${parameters}`;
            const dbSend2 = `${'http://localhost:5000/'}${'db/create/song'}${parameters2}`;
           

            const dbresponse = await axios.get(dbSend);
            const dbresponse2 = await axios.get(dbSend2);
            console.log(dbresponse2)
           

            let parameterDBvote = {
                uid: lid,
                sid: dbresponse.data.code,
                vote: 0,
                fname: uid
            };
            const parameters_vote = `?${querystring.stringify(parameterDBvote)}`;
            const dbSend_vote = `${'http://localhost:5000/'}${'db/create/voterecord'}${parameters_vote}`;
            const dbresponse_vote = await axios.get(dbSend_vote);
            history.push(`/host${'/'}${uid}${'/'}${lid}`,
                  {second:  {song_id: songIDArray[1], song_name: songnameArray[1], song_pic : songPicArray[1], song_length: songlengthArray[1]}, 
                  third: {song_id: songIDArray.slice(-1)[0], song_name: songnameArray.slice(-1)[0], song_pic : songPicArray.slice(-1)[0], song_length: songlengthArray.slice(-1)[0], custom_id: dbresponse.data.code}});
        }
    }

    return (
        <section id="host-select">
            <div>
                <h1> Party Code: {lid} </h1>
                <h1>Select 3 songs to kick off your party!</h1>
                <div>
                    <div className = "search-inputs">
                    <input
                    type="song"
                    value={songsName}
                    onChange={e => setSongsTerm(e.target.value)}
                    placeholder="Search Song or Artist Name"
                />
                    <button class="search-button" onClick={()=>getSong(songsName,artistsName)} variant="info" type="submit">
                Search!
                </button>
                </div>
            </div>
        
        <React.Fragment>
            <ul class="song-list">
                {
                dataB.map(data => 
                <li key = {data.id}> 
                    <img src={data.picUrl} alt="Album Cover"/> 
                    <div class="song-info">
                        <p class ="title" > {data.title}</p>
                        <p class="artist">By: {data.artist}</p>
                    </div>
                    <button onClick={()=>addSong(data.id, data.picUrl, data.title, data.artist, data.songlength, {lid})}> Add me! </button>
                </li>)
}     
            </ul>
            </React.Fragment>
    </div>

            <div id="song-view">

                {songnameArray.map((data, i) =>
                    <div class="song-card">
                        <img class="sc-album-art" src={songPicArray[i]}></img>
                        <p class="song-name">{data}</p>
                    </div>
                )}
           </div>
           
        </section>
    );
}


//  <Button id="final-submit" onClick={()=>finalAdd(songIDArray)}> Party time! </Button>