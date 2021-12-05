import React, {useState} from "react";
import '../styles/Queue.css' // CSS imported
import { ArrowBackCircleOutline, ArrowUpCircleOutline,ArrowDownCircleOutline, ReturnUpBackOutline } from 'react-ionicons'
import { useHistory, useParams, useLocation } from "react-router-dom";
import {Form, Button} from "react-bootstrap";

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
        socket.emit('queue room', "queue");
        console.log("upon init!!");
        getPlaybackOnOpen();
        // getFirstSong();
        // console.log(location.state.song_id, location.state.song_pic, location.state.song_name)
        // if (utype === "listener"){
        //     socket.on("receive qdata", (data) => {
        //         console.log("receieved data");
        //         console.log(data);
        //             });
        // } else {
        //     setQueueImg(location.state.second.song_pic);
        //     setQueueName(location.state.second.song_name);
        //     console.log(location.state.third);
        //     getFirstSong(location.state.third.song_id, location.state.third.song_pic, location.state.third.song_name, location.state.third.custom_id);
        // }
        const interval = setInterval(() => {
            refreshBlock2();
            getPlayback();
           }, 3000);
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
            console.log("output from database");
            console.log(response.data);
            console.log(response.data.length);
            // let block_data_dummy = [];
            // if(response.data.length === 1){
            //     block_data_dummy.push({
            //         title: response.data.title,
            //         img: response.data.img, 
            //         uri: response.data.spotify_uid,
            //         vote_total: response.data.total_votes,
            //         custom_id: response.data.song_id
            //     })
            // }
            // else{
            //     response.data.forEach(song =>{
            //         console.log(song);
            //         block_data_dummy.push({
            //             title: song.title,
            //             img: song.img, 
            //             uri: song.spotify_uid,
            //             vote_total: song.total_votes,
            //             custom_id: song.song_id
            //         })
            //     });
            // }
            
            setBlockData(response.data);
            // console.log(block_data);
            
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
    console.log("ID CHECK");
    oldincoming = response.data.item.id;
    console.log(oldincoming);
}

async function getPlayback(){
    const response = await axios.get("http://localhost:5000/currently/playing");
    incoming_songid = response.data.item.id; 
    console.log(incoming_songid)
    setCurrentID(response.data.song_id)
    // console.log("ALL BLOCK DATA")
    // console.log(block_data)
    // console.log("BLOCK DATA 0")
    // console.log(block_data[0].uri);
    socket.emit('song change', {
        lid: lid,
        socketSong: incoming_songid,
        socketImage: response.data.item.album.images[1].url,
        socketName: response.data.item.name
    })
    if(incoming_songid !== oldincoming){
        
        oldincoming = incoming_songid;
        setNewSong(true);
    }
  
}
    //IF THE SONG CHANGED, WE NEED TO CHANGE THE QUEUE FORM AND CALL UP THE VOTE
    async function bigBoyTime(){

        //GET LISTENING PARTY PLAYLIST ID
        const param = {
            id: lid
        };
        const parameters = `?${querystring.stringify(param)}`;
        console.log("test in refresh function");
        console.log(parameters);
        const urlWithParameters = `${'http://localhost:5000/db/read/listening_party'}${parameters}`;
        const response = await axios.get(urlWithParameters);
        // console.log(response.data);
        let playlist_id = response.data.playlist_id;
        //REMOVE QUEUE SONG FROM DB
        const deleteparam = {
            sid: current_id
        };
        const deleteParameters = `?${querystring.stringify(deleteparam)}`;
        const urlSongDelete = `${'http://localhost:5000/db/delete/song'}${deleteParameters}`;
        const deleteSong = await axios.get(urlSongDelete);
        //GET SONG OFF VOTING BLOCK
        console.log("block check")
        if (block_data.length == 0){
            alert("queue is empty! Add songs!")
            setNewSong(false);
            return;
        }
        console.log("CLARARAAARARAARARA")
        console.log(block_data);
        // console.log(block_data[0].);
        // console.log(block_data[0].uri);
        const blockparam = {
            sid: block_data[0].song_id
        };
        console.log("BLOCK SONG ID");
        console.log(block_data[0].song_id);
        const blockParameters = `?${querystring.stringify(blockparam)}`;
        const urlSongOffBlock = `${'http://localhost:5000/db/alter/song'}${blockParameters}`;
        const songOffBlock = await axios.get(urlSongOffBlock);
        console.log(songOffBlock)
        console.log("song changing in alter");       
        setQueueName(block_data[0].title);
        setQueueImg(block_data[0].img);
        //ADD SONG TO PLAYLIST HERE
        const tempArray = []
        tempArray.push(block_data[0].spotify_uid)
        let songs_formatted = []
        tempArray.forEach(id => songs_formatted.push({
            song: block_data[0].spotify_uid
        }))
        let req_body = {songs: songs_formatted}
        // console.log(req_body);
        const urlOther = `${'http://localhost:5000/add/playlist?playlist_id='}${playlist_id}`;
        let addSong = await axios.post(urlOther, req_body);
        console.log("adding to queue")
                //ADD SONG TO QUEUE
                const queueparam = {
                    trackuri: block_data[0].spotify_uid
                };
                const queueParameters = `?${querystring.stringify(queueparam)}`;
                const urlQueue = `${'http://localhost:5000/add/queue'}${queueParameters}`;
                const queueSong = await axios.post(urlQueue);
                console.log(queueSong);
        setQueueID(block_data[0].spotify_uid);
        setNewSong(false);


    }
    
    async function refreshBlock2(){
        console.log("in refresh function");
        const param = {
            id: lid
        };
        // console.log(lid);
        const parameters = `?${querystring.stringify(param)}`;
        // console.log("test in refresh function");
        // console.log(parameters);
        const urlWithParameters = `${'http://localhost:5000/db/generate/votingblock'}${parameters}`;
        const response = await axios.get(urlWithParameters);
        // console.log(response.data);
        // let block_data_dummy = [];
        // response.data.forEach(song =>{
        //     // console.log("in loop!");
        //     // console.log(song);
        //     block_data_dummy.push({
        //         title: song.title,
        //         img: song.img, 
        //         uri: song.spotify_uid,
        //         vote_total: song.total_votes,
        //         custom_id: song.song_id
        //     })
        // });
        setBlockData(response.data);
        // console.log(block_data);
        

    };
    React.useEffect(()=>{
    async function refreshQueue(){
        console.log("in queue");
        const param = {
            id: lid
        };
        // console.log(lid);
        const parameters = `?${querystring.stringify(param)}`;
        // console.log("test in refresh function");
        // console.log(parameters);
        const urlWithParameters = `${'http://localhost:5000/db/read/queue'}${parameters}`;
        const response = await axios.get(urlWithParameters);
        console.log("READ QUEUE");
        console.log(response.data);
        setCurrentID(response.data.song_id)
        setQueueImg(response.data.img);
        setQueueName(response.data.title);
        setQueueID(response.data.spotify_id);
    };
    refreshQueue();
}, []);

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
    // React.useEffect(()=>{
    //     async function readFirstSong(){
    //         console.log("song on block");
    //         const param = {
    //             id: lid
    //         };
    //         // console.log(lid);
    //         const parameters = `?${querystring.stringify(param)}`;
    //         // console.log("test in refresh function");
    //         // console.log(parameters);
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
    //         console.log("This is the first song being added")
    //         console.log(song_img);
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
                    <img class="sc-album-art" src={queue_img}/>
                    <p>{queue_name}</p>
               </div>
               <p>Next on the Queue!</p>
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
                                <ArrowUpCircleOutline onClick={() => handleVote("up", data.spotify_uid, data.song_id)} color={'#00000'}  title={"upvote"} height="25px" width="25px"/>
                                <ArrowDownCircleOutline onClick={() => handleVote("down", data.spotify_uid, data.song_id)} color={'#00000'}  title={"downvote"} height="25px" width="25px"/>
                            </div>
                        <div>
                            <p>total: {data.total_votes}</p>
                        </div> 
                        </div>
            })}
          </div>
          </React.Fragment>

        </section>
    );
}


