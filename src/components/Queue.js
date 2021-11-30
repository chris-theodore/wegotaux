import React, {useState} from "react";
import '../styles/Queue.css' // CSS imported
import { ArrowBackCircleOutline, ArrowUpCircleOutline,ArrowDownCircleOutline } from 'react-ionicons'
import { useHistory, useParams } from "react-router-dom";
import {Form, Button} from "react-bootstrap";

import Search from "./Search.js"
import songnamearray from "./Search.js"
import axios from "axios";
import querystring from 'querystring';
import { Socket } from "dgram";
import * as io from 'socket.io-client';
const socket = io.connect(`http://localhost:5000`);

// Search Code
let songnameArray = [];
let songIDArray = [];
let songPicArray = [];

// HTML Zone 
export default function Queue() {
    const[dataB, setData] = React.useState([]);
    const [songsName, setSongsTerm] = React.useState([]);
    const [queueSongName, setSongQueue] = React.useState([]);
    const [songsURI, setSongsURI] = React.useState([]);
    const [artistsName, setArtistsTerm] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const history = useHistory();
    let {lid} = useParams();

    React.useEffect(() => {
        socket.emit('queue room', lid);
        return () => {
            socket.emit('leave queue room', 
              lid
            )
        }
      }, []);
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
    socket.on("receive qdata", (data) => {
        console.log(data);
            });
    async function addSongToBlock(song_uri, song_img, song_title){
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
        console.log(song_img);
        console.log(songPicArray);
        console.log(songnameArray);
        socket.emit('add to block', {
            room: lid,
            socketImageArray: {songPicArray},
            socketNameArray: {songnameArray}
        })
        setSongsTerm([]);
        setData([]);

    }
    function handlePageChange(direction){
        if(direction === "back"){
            history.goBack();
        } else if(direction === "q") {
            history.push("search");
        }
    }

    function handleVote(direction) {
        if(direction === "up"){
            // use react useState hook to increment votes and push to db
            // make sure to connect to the given song can use dom stuff to retrieve song name/id
            console.log("vote +1");
        } else if(direction === "down"){
            // use react useState hook to decrement votes and push to db 
            // make sure to connect to the given song can use dom stuff to retrieve song name/id
            console.log("vote -1");
        }
    }

    
    // gonna need to add the songs to song view with a for loop later from database, place holders for now.
    // gonna need to add the songs to polls div with a for loop later from database, place holders for now.
    // polls section would probs be scrollable later
    return (
        <section id="queue">
                

           <div id="header">
                <ArrowBackCircleOutline onClick={() => handlePageChange("back")}color={'#00000'}  title={"back"} height="40px" width="40px"/>
                <input type="song" value={songsName} onChange={e =>setSongsTerm(e.target.value)} name="search" placeholder="Search Song or Artist Name">
                 </input>
                 <Button onClick={()=>getSong(songsName,artistsName)} variant="info" type="submit">
          Search!
        </Button>


           </div>
           <div class="search-box">

  </div>
           <div id="song-view">
               <div class="song-card">
                    <img class="sc-album-art" src="../data/images/albumcover-placeholder.jpg"/>
                    <p>Song Name #1</p>
               </div>
               <div class="song-card">
                    <img class="sc-album-art" src="../data/images/albumcover-placeholder.jpg"/>
                    <p>Song Name #2</p>
               </div>
           </div>
           <React.Fragment>
            <ul>
                {
                dataB.map(data => <li key = {data.id}> <img src={data.picUrl} alt="Album Cover"/> Song Name: {data.title} {"\n"} Artist: {data.artist} <Button onClick={()=>addSongToBlock(data.id, data.picUrl, data.title)}> Add me! </Button></li>)
}     
            </ul>
            </React.Fragment>
           <div id="polls">
                <div class="vote-card">
                    <img class="voter-album-art" src={songPicArray[0]}/>
                    <p>{songnameArray[0]}</p>
                    <div class="vote-tools">
                        <ArrowUpCircleOutline onClick={() => handleVote("up")} color={'#00000'}  title={"upvote"} height="25px" width="25px"/>
                        <ArrowDownCircleOutline onClick={() => handleVote("down")} color={'#00000'}  title={"downvote"} height="25px" width="25px"/>
                    </div>
               </div>
               <div class="vote-card">
                    <img class="voter-album-art" src={songPicArray[1]}/>
                    <p>{songnameArray[1]}</p>
                    <div class="vote-tools">
                        <ArrowUpCircleOutline onClick={() => handleVote("up")} color={'#00000'}  title={"upvote"} height="25px" width="25px"/>
                        <ArrowDownCircleOutline onClick={() => handleVote("down")} color={'#00000'}  title={"downvote"} height="25px" width="25px"/>
                    </div>
               </div>
               <div class="vote-card">
                    <img class="voter-album-art" src={songPicArray[2]}/>
                    <p>{songnameArray[2]}</p>
                    <div class="vote-tools">
                        <ArrowUpCircleOutline onClick={() => handleVote("up")} color={'#00000'}  title={"upvote"} height="25px" width="25px"/>
                        <ArrowDownCircleOutline onClick={() => handleVote("down")} color={'#00000'}  title={"downvote"} height="25px" width="25px"/>
                    </div>
                </div>
               <div class="vote-card">
                    <img class="voter-album-art" src={songPicArray[3]}/>
                    <p>{songnameArray[3]}</p>
                    <div class="vote-tools">
                        <ArrowUpCircleOutline onClick={() => handleVote("up")} color={'#00000'}  title={"upvote"} height="25px" width="25px"/>
                        <ArrowDownCircleOutline onClick={() => handleVote("down")} color={'#00000'}  title={"downvote"} height="25px" width="25px"/>
                    </div>
                </div>
               <div class="vote-card">
                    <img class="voter-album-art" src={songPicArray[4]}/>
                    <p>{songnameArray[4]}</p>
                    <div class="vote-tools">
                        <ArrowUpCircleOutline onClick={() => handleVote("up")} color={'#00000'}  title={"upvote"} height="25px" width="25px"/>
                        <ArrowDownCircleOutline onClick={() => handleVote("down")} color={'#00000'}  title={"downvote"} height="25px" width="25px"/>
                    </div>
        </div>
           </div>

        </section>
    );
}

