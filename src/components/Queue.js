import React, {useState} from "react";
import '../styles/Queue.css' // CSS imported
import { ArrowBackCircleOutline, ArrowUpCircleOutline,ArrowDownCircleOutline, ReturnUpBackOutline } from 'react-ionicons'
import { useHistory, useParams, useLocation } from "react-router-dom";
import {Form, Button} from "react-bootstrap";

import axios from "axios";
import querystring from 'querystring';
import * as io from 'socket.io-client';
const socket = io.connect(`http://localhost:5000`);

// Search Code
let songnameArray = [];
let songIDArray = [];
let songPicArray = [];

let song1_img;
let song2_img;
let song1_name;
let song2_name;

// HTML Zone 
export default function Queue() {
    const location = useLocation();
    //const init_song = location.state.song;
    const[dataB, setData] = React.useState([]);
    const [songsName, setSongsTerm] = React.useState([]);
    const [queueSongName, setSongQueue] = React.useState([]);
    const [songsURI, setSongsURI] = React.useState([]);
    const [artistsName, setArtistsTerm] = useState([]);
    const [block_data, setBlockData] = React.useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const history = useHistory();
    let {uid, lid} = useParams();
    let {utype} =useParams();
    React.useEffect(() => {
        socket.emit('queue room', lid);
        console.log("upon init!!");
        // console.log(location.state.song_id, location.state.song_pic, location.state.song_name)
        // const interval = setInterval(() => {
        //    refreshBlock2();
        //   }, 1000);
        if (utype === "listener"){
            socket.on("receive qdata", (data) => {
                console.log("receieved data");
                console.log(data);
                    });
        } else {
            song1_img = location.state.second.song_pic;
            song1_name = location.state.second.song_name;
            console.log(location.state.third);
            getFirstSong(location.state.third.song_id, location.state.third.song_pic, location.state.third.song_name, location.state.third.custom_id);
        }
        return () => {
            // clearInterval(interval);
            socket.emit('leave queue room', lid);
        }
      }, []);

      socket.on("new song", (data) => {
        console.log(data);
    });
    React.useEffect(()=>{
        async function refreshBlock(){
            console.log("in refresh function");
            const param = {
                id: lid
            };
            console.log(lid);
            const parameters = `?${querystring.stringify(param)}`;
            console.log("test in refresh function");
            console.log(parameters);
            const urlWithParameters = `${'http://localhost:5000/db/generate/votingblock'}${parameters}`;
            const response = await axios.get(urlWithParameters);
            console.log(response.data);
            let block_data_dummy = [];
            response.data.forEach(song =>{
                block_data_dummy.push({
                    title: song.title,
                    img: song.img, 
                    uri: song.spotify_uid,
                    vote_total: song.total_votes,
                    custom_id: song.song_id
                })
            });
            setBlockData(block_data_dummy);
            console.log(block_data);
            
        };
        refreshBlock();
    }, []);
   
    async function refreshBlock2(){
        console.log("in refresh function");
        const param = {
            id: lid
        };
        console.log(lid);
        const parameters = `?${querystring.stringify(param)}`;
        console.log("test in refresh function");
        console.log(parameters);
        const urlWithParameters = `${'http://localhost:5000/db/generate/votingblock'}${parameters}`;
        const response = await axios.get(urlWithParameters);
        console.log(response.data);
        let block_data_dummy = [];
        response.data.forEach(song =>{
            console.log("in loop!");
            console.log(song);
            block_data_dummy.push({
                title: song.title,
                img: song.img, 
                uri: song.spotify_uid,
                vote_total: song.total_votes,
                custom_id: song.song_id
            })
        });
        setBlockData(block_data_dummy);
        console.log(block_data);
        

    };

    async function getSong(song,artist){
        const parameterSong = {
            track: song,
        };
        const parameters = `?${querystring.stringify(parameterSong)}`;
        const urlWithParameters = `${'http://localhost:5000/song/search'}${parameters}`;
        const response = await axios.get(urlWithParameters);
        if (setData != []) {
            setData([])
        }
        setData(response.data);
        socket.emit("new song", {data: response.data, id: lid});
        console.log(setData);
    }

    async function getFirstSong(song_uri,song_img, song_title, custom_id){
        if (songnameArray.length == 0){
            console.log("This is the first song being added")
            console.log(song_img);
            let dummyArray = []
            dummyArray.push({
                title: song_title,
                img: song_img, 
                uri: song_uri,
                vote_total: 0,
                custom_id : custom_id
            })
            let parameterDB2 = {
                fname: uid,
                uid: lid,
                vote: 0,
                sid: custom_id
            };
            const parameters2 = `?${querystring.stringify(parameterDB2)}`;
            const dbSend2 = `${'http://localhost:5000/'}${'db/create/voterecord'}${parameters2}`
            const dbresponse2 = await axios.get(dbSend2);
            setBlockData(dummyArray);
            const tempArray = []
            tempArray.push(song_uri)
            let songs_formatted = []
            tempArray.forEach(id => songs_formatted.push({
                song: song_uri
            }))
            setSongsTerm([]);
            setData([]);
        }else{
            return;
        }
    }
    async function addSongToBlock(song_uri, song_img, song_title){
        
        let parameterDB = {
            lid: lid,
            sid: song_uri,
            img: song_img,
            title: song_title
        };
        const parameters = `?${querystring.stringify(parameterDB)}`;
        const dbSend = `${'http://localhost:5000/'}${'db/create/song'}${parameters}`;
        const dbresponse = await axios.get(dbSend);

        let parameterDB2 = {
            fname: uid,
            uid: lid,
            vote: 0,
            sid: dbresponse.data.code
        };
    
        const parameters2 = `?${querystring.stringify(parameterDB2)}`;
        const dbSend2 = `${'http://localhost:5000/'}${'db/create/voterecord'}${parameters2}`
        const dbresponse2 = await axios.get(dbSend2);

        let block_data_dummy = block_data;
        block_data_dummy.push({
            title: song_title,
            img: song_img, 
            uri: song_uri,
            vote_total: 0,
            custom_id: dbresponse.data.code
        })
        setBlockData(block_data_dummy);
        const tempArray = []
        tempArray.push(song_uri)
        let songs_formatted = []
        tempArray.forEach(id => songs_formatted.push({
            song: song_uri
        }));

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

    async function updateExistingVote(uid, lid, custom_id, direction){
        //check if voting record exists
        //request.query.vote, request.query.fun_name,request.query.id,request.query.sid
        let decision = -1;
        if(direction === "up"){
            decision = 1
        }
    
        let parameterDB_modify = {
            fun_name: uid,
            id: lid,
            sid: custom_id,
            vote: decision
        };
        const parameters_modify = `?${querystring.stringify(parameterDB_modify)}`;
        const dbSend2 = `${'http://localhost:5000/'}${'db/change/vote'}${parameters_modify}`;
        const dbresponse2 = await axios.get(dbSend2);
        console.log(dbresponse2);
        const test = await refreshBlock2();

    }

    async function handleVote(direction, uri, custom_id) {
        let parameterDB;
        //check if voting record exists
        
        let parameterDB_lookup = {
            fname: uid,
            id: lid,
            songid: custom_id
        };
    
        const parameters_lookup = `?${querystring.stringify(parameterDB_lookup)}`;
        const dbSend2 = `${'http://localhost:5000/'}${'db/voterecord/lookup'}${parameters_lookup}`;
        console.log(dbSend2);
        const dbresponse2 = await axios.get(dbSend2);
        console.log(dbresponse2.data);
        if(dbresponse2.data.exists === 1){
            updateExistingVote(uid, lid, custom_id, direction);
            return;
        }
        else{
            if(direction === "up"){
                // use react useState hook to increment votes and push to db
                // make sure to connect to the given song can use dom stuff to retrieve song name/id
                console.log("vote +1");
                parameterDB = {
                    fname: uid,
                    uid: lid,
                    vote: 1,
                    sid: custom_id
                };
            }
           
            else if(direction === "down"){
                // use react useState hook to decrement votes and push to db 
                // make sure to connect to the given song can use dom stuff to retrieve song name/id
                console.log("vote -1");
                parameterDB = {
                    fname: uid,
                    uid: lid,
                    vote: -1,
                    sid: custom_id
                };
            }
        }
        
        console.log("in helper");
        console.log(lid);
        const parameters = `?${querystring.stringify(parameterDB)}`;
        console.log(parameters)
        const dbSend = `${'http://localhost:5000/'}${'db/create/voterecord'}${parameters}`
        const dbresponse = await axios.get(dbSend);
        const test = await refreshBlock2();
        return;
    }

    
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
                    <img class="sc-album-art" src={song1_img}/>
                    <p>{song1_name}</p>
               </div>
               <div class="song-card">
                    <img class="sc-album-art" src={song2_img}/>
                    <p>{song2_name}</p>
               </div>
           </div>
           <React.Fragment>
            <ul>
                {
                dataB.map(data => <div class="vote-card" key = {data.id}> <img src={data.picUrl} alt="Album Cover"/> Song Name: {data.title} {"\n"} Artist: {data.artist} <Button onClick={()=>addSongToBlock(data.id, data.picUrl, data.title)}> Add me! </Button></div>)
}     
            </ul>
            </React.Fragment>

            <React.Fragment>
            <div id="polls">
            {block_data.map((data, index) => {
              return <div key={index}>
                        <img class="voter-album-art" src={data.img}/>
                            <p>{data.title}</p>
                            <div class="vote-tools">
                                <ArrowUpCircleOutline onClick={() => handleVote("up", data.uri, data.custom_id)} color={'#00000'}  title={"upvote"} height="25px" width="25px"/>
                                <ArrowDownCircleOutline onClick={() => handleVote("down", data.uri, data.custom_id)} color={'#00000'}  title={"downvote"} height="25px" width="25px"/>
                            </div>
                        <div>
                            <p>total: {data.vote_total}</p>
                        </div> 
                        </div>
            })}
          </div>
          </React.Fragment>

        </section>
    );
}

