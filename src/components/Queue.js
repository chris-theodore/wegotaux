import React, {useState} from "react";
import '../styles/Queue.css' // CSS imported
import { Trash, ArrowBackCircleOutline, ArrowUpCircleOutline,ArrowDownCircleOutline, ReturnUpBackOutline } from 'react-ionicons'
import { useHistory, useParams, useLocation } from "react-router-dom";
import {Form, Button, ResponsiveEmbed} from "react-bootstrap";

import axios from "axios";
import querystring from 'querystring';
import * as io from 'socket.io-client';
import { useEffect } from "react";
const socket = io.connect(`http://localhost:5000`);

// Search Code
let songnameArray = [];
let oldincoming = "";
let incoming_songid = "";
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
    const [queue_img, setQueueImg] = React.useState([]);
    const [queue_name, setQueueName] = React.useState([]);
    const [queue_id, setQueueID] = React.useState([]);
    const [current_id, setCurrentID] = React.useState(null);
    const [newSong, setNewSong] = React.useState(false);
    const history = useHistory();
    let {uid, lid} = useParams();
    let {utype} =useParams();
    React.useEffect(() => {
        socket.emit('queue room', lid);
        //console.log("upon init!!");

        //We want to see what song is playing at the start of opening the page to see if the song is about to change.
        getPlaybackOnOpen();

        const interval = setInterval(() => {
            //This function refreshes the voting block every 3 seconds and updates the block_data state variable with the current voting block.
            refreshBlock2();
            //This function gets the current song playing and sets the incoming song id and currentID to that song.
            getPlayback();
           }, 3000);
        return () => {
            // clearInterval(interval);
            socket.emit('leave queue room', lid);
        }
      }, []);
      socket.on("queue update", (data) => {
        // console.log(data);
        setQueueID(data.socketSong);
        setQueueImg(data.socketImage);
        setQueueName(data.socketName);
            });
      socket.on("new song", (data) => {
        //console.log(data);
    });
    React.useEffect(()=>{
        async function refreshBlock(){
            //console.log("in refresh function");
            const param = {
                id: lid
            };
            //console.log(lid);
            const parameters = `?${querystring.stringify(param)}`;
            //console.log("test in refresh function");
            //console.log(parameters);
            const urlWithParameters = `${'http://localhost:5000/db/generate/votingblock'}${parameters}`;
            const response = await axios.get(urlWithParameters);
            console.log("RESPONSE DATA 1")
            console.log(response.data)
            setBlockData(response.data);
            console.log("Init refresh")
            console.log(block_data);
            
        };
        refreshBlock();
    }, []);
//    PLAYBACK LISTENER FUNCTION
useEffect(() => {
    if(newSong){
    bigBoyTime();
    }
},[newSong]);

async function getPlaybackOnOpen(){
    const response = await axios.get("http://localhost:5000/currently/playing");
    //console.log("ID CHECK");
    oldincoming = response.data.item.id;
    //console.log(oldincoming);
}

async function getPlayback(){
    const response = await axios.get("http://localhost:5000/currently/playing");
    incoming_songid = response.data.item.id; 
    //console.log(incoming_songid)
    setCurrentID(response.data.item.id)
    // //console.log("ALL BLOCK DATA")
    // //console.log(block_data)
    // //console.log("BLOCK DATA 0")
    // //console.log(block_data[0].uri);
    socket.emit('song change', {
        lid: lid,
        socketSong: incoming_songid,
        socketImage: response.data.item.album.images[1].url,
        socketName: response.data.item.name
    })
    //This is when a song change occurs and the old song does not match the new song. 
    if(incoming_songid !== oldincoming){
        oldincoming = incoming_songid;
        setNewSong(true);
        socket.emit('big boy time', {
            lid: lid,
            queue_id: queue_id,
            block_data: block_data
        });
    }
  
}
    //IF THE SONG CHANGED, WE NEED TO CHANGE THE QUEUE FORM AND CALL UP THE VOTE
    async function bigBoyTime(){
        if (utype === "host"){

        //GET LISTENING PARTY PLAYLIST ID
        const param = {
            id: lid
        };
        const parameters = `?${querystring.stringify(param)}`;
        const urlWithParameters = `${'http://localhost:5000/db/read/listening_party'}${parameters}`;
        const response = await axios.get(urlWithParameters);
        let playlist_id = response.data.playlist_id;

        //ADD RANDOM SONG TO VOTING BLOCK IF VOTING BLOCK IS ABOUT TO BE EMPTY
        if (block_data.length ===1){
            const getRandomSong = `${'http://localhost:5000/get/party/playlist'}`;
            const chosenSong = await axios.get(getRandomSong);
            console.log("accessing randomly selected song data");
            console.log(chosenSong);
            if(chosenSong){
                const test = await addSongToBlock(chosenSong.id, chosenSong.picUrl, chosenSong.title);
            }
        }

        //REMOVE QUEUE SONG FROM DB
        const urlSongDelete = `${'http://localhost:5000/db/delete/song'}${parameters}`;
        console.log(urlSongDelete);
        const deleteSong = await axios.get(urlSongDelete);
        
    
      
        //GET SONG OFF VOTING BLOCK AND TRANSFER TO QUEUE POSITION
        const blockparam = {
            sid: block_data[0].spotify_id,
            id: lid
        };
     
        const blockParameters = `?${querystring.stringify(blockparam)}`;
        const urlSongOffBlock = `${'http://localhost:5000/db/alter/song'}${blockParameters}`;
        const songOffBlock = await axios.get(urlSongOffBlock);
          
        setQueueName(block_data[0].title);
        setQueueImg(block_data[0].img);

        //ADD SONG TO SPOTIFY PLAYLIST HERE
        const tempArray = []
        tempArray.push(block_data[0].spotify_id)
        let songs_formatted = []
        tempArray.forEach(id => songs_formatted.push({
            song: block_data[0].spotify_id
        }))
        let req_body = {songs: songs_formatted}
        const urlOther = `${'http://localhost:5000/add/playlist?playlist_id='}${playlist_id}`;
        let addSong = await axios.post(urlOther, req_body);
     
        //ADD SONG TO SPOTIFY QUEUE
        const queueparam = {
            trackuri: block_data[0].spotify_id
        };
        const queueParameters = `?${querystring.stringify(queueparam)}`;
        const urlQueue = `${'http://localhost:5000/add/queue'}${queueParameters}`;
        const queueSong = await axios.post(urlQueue);
     
        setQueueID(block_data[0].spotify_id);
        //EMIT DATA CHANGE EVENT TO NON HOST USERS OF LISTENING PARTY
        socket.emit('queue change',{
            lid: lid,
            socketSong: block_data[0].spotify_id,
            socketImage: block_data[0].img,
            socketName: block_data[0].title
        })
        // refreshQueue();
    }
    setNewSong(false);
}
    async function refreshBlock2(){
        //console.log("in refresh function");
        const param = {
            id: lid
        };
        // //console.log(lid);
        const parameters = `?${querystring.stringify(param)}`;
        // //console.log("test in refresh function");
        // //console.log(parameters);
        const urlWithParameters = `${'http://localhost:5000/db/generate/votingblock'}${parameters}`;
        const response = await axios.get(urlWithParameters);
        // //console.log(response.data);
        // let block_data_dummy = [];
        // response.data.forEach(song =>{
        //     // //console.log("in loop!");
        //     // //console.log(song);
        //     block_data_dummy.push({
        //         title: song.title,
        //         img: song.img, 
        //         uri: song.spotify_uid,
        //         vote_total: song.total_votes,
        //         custom_id: song.song_id
        //     })
        // });
        console.log("RESPONSE DATA 2")
        console.log(response.data);
        setBlockData(response.data);
        console.log("Constant refresh")
        console.log(block_data);
        

    };
    React.useEffect(()=>{
    async function refreshQueue(){
        //console.log("in queue");
        const param = {
            id: lid
        };
        // //console.log(lid);
        const parameters = `?${querystring.stringify(param)}`;
        // //console.log("test in refresh function");
        // //console.log(parameters);
        const urlWithParameters = `${'http://localhost:5000/db/read/queue'}${parameters}`;
        const response = await axios.get(urlWithParameters);
        //console.log("READ QUEUE");
        //console.log(response.data);
        // setCurrentID(response.data.spotify_id)
        setQueueImg(response.data.img);
        setQueueName(response.data.title);
        setQueueID(response.data.spotify_id);
    };
    refreshQueue();
}, []);

    async function refreshQueue(){
        //console.log("in queue");
        const param = {
            id: lid
        };
        // //console.log(lid);
        const parameters = `?${querystring.stringify(param)}`;
        // //console.log("test in refresh function");
        // //console.log(parameters);
        const urlWithParameters = `${'http://localhost:5000/db/read/queue'}${parameters}`;
        const response = await axios.get(urlWithParameters);
        //console.log("READ QUEUE");
        //console.log(response.data);
        // setCurrentID(response.data.spotify_id)
        setQueueImg(response.data.img);
        setQueueName(response.data.title);
        setQueueID(response.data.spotify_id);
    };

    async function getSong(song,artist){
        console.log("made it here from search button")
        const parameterSong = {
            track: song,
        };
        console.log("the songs from search api", song);
        const parameters = `?${querystring.stringify(parameterSong)}`;
        const urlWithParameters = `${'http://localhost:5000/song/search'}${parameters}`;
        const response = await axios.get(urlWithParameters);
        if (setData != []) {
            setData([])
        }
        console.log("maybe", response.data);
    


        setData(response.data);
        socket.emit("new song", {data: response.data, id: lid});
        console.log("the songs from search api", dataB);
    }
    // React.useEffect(()=>{
    //     async function readFirstSong(){
    //         //console.log("song on block");
    //         const param = {
    //             id: lid
    //         };
    //         // //console.log(lid);
    //         const parameters = `?${querystring.stringify(param)}`;
    //         // //console.log("test in refresh function");
    //         // //console.log(parameters);
    //         const urlWithParameters = `${'http://localhost:5000/db/read/first_block'}${parameters}`;
    //         const response = await axios.get(urlWithParameters);

    //         dummyArray.push({
    //             title: response.data.title,
    //             img: response.data.img,
    //             uri: response.data.spotify_id,
    //             vote_total: 0,
    //             custom_id : response.data.song_id
    //         })
    //         setBlockData(dummyArray);
    //     };
    //     readFirstSong();
    // }, []);
    // async function getFirstSong(song_uri,song_img, song_title, custom_id){
    //     if (songnameArray.length == 0){
    //         //console.log("This is the first song being added")
    //         //console.log(song_img);
    //         let dummyArray = []
    //         dummyArray.push({
    //             title: song_title,
    //             img: song_img, 
    //             uri: song_uri,
    //             vote_total: 0,
    //             custom_id : custom_id
    //         })
    //         let parameterDB2 = {
    //             fname: uid,
    //             uid: lid,
    //             vote: 0,
    //             sid: custom_id
    //         };
    //         const parameters2 = `?${querystring.stringify(parameterDB2)}`;
    //         const dbSend2 = `${'http://localhost:5000/'}${'db/create/voterecord'}${parameters2}`
    //         const dbresponse2 = await axios.get(dbSend2);
    //         setBlockData(dummyArray);
    //         const tempArray = []
    //         tempArray.push(song_uri)
    //         let songs_formatted = []
    //         tempArray.forEach(id => songs_formatted.push({
    //             song: song_uri
    //         }))
    //         setSongsTerm([]);
    //         setData([]);
    //     }else{
    //         return;
    //     }
    // }
    async function addSongToBlock(song_uri, song_img, song_title){
        console.log("calling from add me");
        
        let parameterDB = {
            lid: lid,
            sid: song_uri,
            img: song_img,
            title: song_title,
            is_removed: 0,
            on_queue: 0

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
        console.log("check if song was added", block_data);
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
        //console.log(dbresponse2);
        const test = await refreshBlock2();

    }
    async function handleDelete(lid, spotify_id) {
        let parameterDB;
        //check if voting record exists
        
        let parameterDB_delete = {
            id: lid,
            songid: spotify_id
        };

        const parameters_delete= `?${querystring.stringify(parameterDB_delete)}`;
        const dbSend2 = `${'http://localhost:5000/'}${'db/delete/song_vote'}${parameters_delete}`;
        //console.log(dbSend2);
        const dbresponse2 = await axios.get(dbSend2);
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
        //console.log(dbSend2);
        const dbresponse2 = await axios.get(dbSend2);
        //console.log(dbresponse2.data);
        if(dbresponse2.data.exists === 1){
            updateExistingVote(uid, lid, custom_id, direction);
            return;
        }
        else{
            if(direction === "up"){
                // use react useState hook to increment votes and push to db
                // make sure to connect to the given song can use dom stuff to retrieve song name/id
                //console.log("vote +1");
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
                //console.log("vote -1");
                parameterDB = {
                    fname: uid,
                    uid: lid,
                    vote: -1,
                    sid: custom_id
                };
            }
        }
        
        //console.log("in helper");
        //console.log(lid);
        const parameters = `?${querystring.stringify(parameterDB)}`;
        //console.log(parameters)
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
                    <img class="sc-album-art" src={queue_img}/>
                    <p>{queue_name}</p>
               </div>
               <p>Next on the Queue!</p>
           </div>

           <React.Fragment>
            <ul id="q-list">
                {
                dataB.map(data => 
                <li class="vote-card" key = {data.id}> 
                    <img class ="q-image" src={data.picUrl} alt="Album Cover"/> 
                    <div class="song-data">
                        <p class ="title" > {data.title}</p>
                        <p class="artist">By: {data.artist}</p>
                    </div>
                    <button class="AddMe" onClick={()=>addSongToBlock(data.id, data.picUrl, data.title)}> Add me! </button>
                </li>)
}     
            </ul>
            </React.Fragment>

            <React.Fragment>
            <div id="polls">
            {block_data.map((data, index) => {
                if(utype === "host"){
                    return <div key={index}>
                        <img class="voter-album-art" src={data.img}/>
                            <p>{data.title}</p>
                            <div class="vote-tools">
                                <ArrowUpCircleOutline onClick={() => handleVote("up", data.spotify_uid, data.spotify_id)} color={'#00000'}  title={"upvote"} height="25px" width="25px"/>
                                <ArrowDownCircleOutline onClick={() => handleVote("down", data.spotify_uid, data.spotify_id)} color={'#00000'}  title={"downvote"} height="25px" width="25px"/>
                                <Trash onClick={() => handleDelete(lid, data.spotify_id)} color={'#00000'}  title={"trash"} height="25px" width="25px"/>
                            </div>
                        <div>
                            <p>total: {data.total_votes}</p>
                        </div> 
                        </div>   
                                                }else{
              return <div key={index}>
                        <img class="voter-album-art" src={data.img}/>
                            <p>{data.title}</p>
                            <div class="vote-tools">
                                <ArrowUpCircleOutline onClick={() => handleVote("up", data.spotify_uid, data.spotify_id)} color={'#00000'}  title={"upvote"} height="25px" width="25px"/>
                                <ArrowDownCircleOutline onClick={() => handleVote("down", data.spotify_uid, data.spotify_id)} color={'#00000'}  title={"downvote"} height="25px" width="25px"/>
                            </div>
                        <div>
                            <p>total: {data.total_votes}</p>
                        </div> 
                        </div>
}})}
          </div>
          </React.Fragment>

        </section>
    );
}


