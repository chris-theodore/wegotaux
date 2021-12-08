import React, { useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { ExitOutline, PauseOutline, PlaySkipBackOutline, PlaySkipForwardOutline, MenuOutline, PeopleOutline, InformationCircleOutline } from 'react-ionicons'
import '../styles/HostLanding.css' // CSS imported
import axios from 'axios';
import querystring from "query-string"
import * as io from 'socket.io-client';
// Javascript Zone

let playbackState =[];
const socket = io.connect(`http://localhost:5000`);
let oldincoming='';
// HTML Zone 
export default function HostLanding() {
    const location = useLocation();
    const pathname = "host";
    const [currentImage, setCurrentImage] = React.useState(null);
    const [currentSongID, setCurrentSong] = React.useState(null);
    const [currentSongName, setCurrentName] = React.useState(null);
    const [newSong, setNewSong] = React.useState(false);
    const [queue_img, setQueueImg] = React.useState([]);
    const [queue_name, setQueueName] = React.useState([]);
    const [queue_id, setQueueID] = React.useState([]);
    const [block_data, setBlockData] = React.useState([]);
    const [current_id, setCurrentID] = React.useState(null);
   const history = useHistory();
   let {lid} = useParams();
   let {uid} = useParams();
   const utype = "host";
   React.useEffect(() => {
       socket.emit('join', {uid, lid});
     }, []);
     async function skipSong(){
         //need to post this with unique id of the listening party as query parameter
         const response = await axios.post("http://localhost:5000/skip/song")
     }
     function handleSubmit(direction){
        if(direction === "queue"){
            history.push(`/queue${'/'}${utype}${'/'}${uid}${'/'}${lid}`, 
                 {path: location.state.pathname, 
                    second: {
                        song_id: location.state.second.song_id,
                        song_name: location.state.second.song_name, 
                        song_pic : location.state.second.song_pic,
                        song_length: location.state.second.song_length
                    },
                    third: {
                        song_id: location.state.third.song_id,
                        song_name: location.state.third.song_name, 
                        song_pic : location.state.third.song_pic,
                        song_length: location.state.third.song_length,
                        custom_id: location.state.third.custom_id
                    }
                    }
            );
        } else if(direction === "listeners"){
            history.push(`/listeners${'/'}${lid}`, {utype: "host"});
        } else if(direction === "details"){
            history.push("details");
        } else if(direction === "leave"){
            history.push("/");
            // need to do an api call here to remove the user from the database.
        } 
    }
    const handleHostLeave = async (event) =>{
        try{
            await HostLeave();
            //need to have socket emit message to everyone that party is over?
            alert("Hope you enjoyed the party!")
        } catch (e){
            alert(`Party leave failed! ${e.message}`)
        }
    }
    async function HostLeave(){
            const parameterDB = {
                id: parseInt(lid)
            };
            const parameters = `?${querystring.stringify(parameterDB)}`;
            console.log(parameters)
            const dbSend = `${'http://localhost:5000/'}${'db/delete/listening_party'}${parameters}`
            const dbresponse = await axios.get(dbSend);
            console.log(dbresponse);
            history.push(`/`);
    }
    async function getPlayback2(){
        let incoming_songid = {}
        const response = await axios.get("http://localhost:5000/currently/playing");
        // console.log(response)
        // console.log(response.data)
        // console.log(response);
        incoming_songid = response.data.item.id;
        if(currentSongID !== incoming_songid){
            setCurrentSong(incoming_songid);
            setCurrentImage(response.data.item.album.images[1].url);
            // currentlength = response.data.item.duration_ms;
            setCurrentName(response.data.item.name);
        socket.emit('song change', {
            lid: lid,
            socketSong: incoming_songid,
            socketImage: response.data.item.album.images[1].url,
            socketName: response.data.item.name
        })
        
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
        }
    }
}
useEffect(() => {
    if(newSong){
    bigBoyTime();
    }
},[newSong]);

        async function bigBoyTime(){
            if (utype === "host"){
            //GET LISTENING PARTY PLAYLIST ID
            const param = {
                id: lid
            };
            const parameters = `?${querystring.stringify(param)}`;
            //console.log("test in refresh function");
            //console.log(parameters);
            const urlWithParameters = `${'http://localhost:5000/db/read/listening_party'}${parameters}`;
            const response = await axios.get(urlWithParameters);
            // //console.log(response.data);
            let playlist_id = response.data.playlist_id;
            //REMOVE QUEUE SONG FROM DB
            const deleteParameters = `?${querystring.stringify(param)}`;
            const urlSongDelete = `${'http://localhost:5000/db/delete/song'}${parameters}`;
            console.log(urlSongDelete);
            const deleteSong = await axios.get(urlSongDelete);
            console.log(deleteSong);
            //GET SONG OFF VOTING BLOCK
            //console.log("block check")
            if (block_data.length == 0){
                alert("queue is empty! Add songs!")
                setNewSong(false);
                return;
            }
            console.log("CLARARAAARARAARARA")
            console.log(block_data);
            console.log(block_data[0]);
            // //console.log(block_data[0].uri);
            const blockparam = {
                sid: block_data[0].spotify_id,
                id: lid
            };
            //console.log("BLOCK SONG ID");
            //console.log(block_data[0].song_id);
            const blockParameters = `?${querystring.stringify(blockparam)}`;
            const urlSongOffBlock = `${'http://localhost:5000/db/alter/song'}${blockParameters}`;
            const songOffBlock = await axios.get(urlSongOffBlock);
            //console.log(songOffBlock)
            //console.log("song changing in alter");       
            setQueueName(block_data[0].title);
            setQueueImg(block_data[0].img);
            //ADD SONG TO PLAYLIST HERE
            const tempArray = []
            tempArray.push(block_data[0].spotify_id)
            let songs_formatted = []
            tempArray.forEach(id => songs_formatted.push({
                song: block_data[0].spotify_id
            }))
            let req_body = {songs: songs_formatted}
            // //console.log(req_body);
            const urlOther = `${'http://localhost:5000/add/playlist?playlist_id='}${playlist_id}`;
            let addSong = await axios.post(urlOther, req_body);
            //console.log("adding to queue")
                    //ADD SONG TO QUEUE
                    const queueparam = {
                        trackuri: block_data[0].spotify_id
                    };
                    const queueParameters = `?${querystring.stringify(queueparam)}`;
                    const urlQueue = `${'http://localhost:5000/add/queue'}${queueParameters}`;
                    const queueSong = await axios.post(urlQueue);
                    //console.log(queueSong);
            setQueueID(block_data[0].spotify_id);
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
        
        async function getPlayback(){
            const response = await axios.get("http://localhost:5000/currently/playing");
            console.log("response from getPlayback", response);
            // setSongLength(response.data.item.duration_ms);
            setCurrentSong(response.data.item.id);
            setCurrentImage(response.data.item.album.images[1].url);
            setCurrentName(response.data.item.name);
            socket.emit('song event', {
                room: lid,
                socketSong: response.data.item.id,
                socketImage: response.data.item.album.images[1].url,
                socketName: response.data.item.name
            })
            oldincoming = response.data.item.id;
        }
        
        getPlayback();
    }, []);

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
    useEffect(() => {
        const interval = setInterval(() => {
          getPlayback2();
          refreshBlock2();
        }, 1000);
        return () => clearInterval(interval);
      }, []);
    return (
        
        <section id="host-landing">
            Party Code: {lid}
            <div id="player">
                <img id="album-art" src={currentImage}/>
                <div id="song-name">
                    {currentSongName}
                </div>
                <div id="player-actions">
                    <PlaySkipBackOutline class="p-action" color={'#00000'} title={"back"} height="25px" width="25px"/>
                    <PauseOutline  class="p-action" color={'#00000'} title={"pause"} height="25px" width="25px"/>
                    <button name= 'skip' onClick={() => skipSong() } >
                    <PlaySkipForwardOutline  class="p-action" color={'#00000'} title={"forwards"} onClick={() => skipSong() } height="25px" width="25px"/>
                    </button>
                </div>
            </div>

            <div id="user-actions">
                <div class="u-action" onClick={() => handleSubmit("queue")}>
                    <MenuOutline class="a-icon" color={'#00000'} title={"view-queue"} height="25px" width="25px"/>
                    <p>View Queue</p>
                </div>
                <div class="u-action" onClick={() => handleSubmit("listeners")}>
                    <PeopleOutline color={'#00000'} title={"view-listeners"} height="25px" width="25px"/>
                    <p>Listeners</p>
                </div>
                <div class="u-action" onClick={() => handleSubmit("details")}>
                    <InformationCircleOutline color={'#00000'}  title={"party-details"} height="25px" width="25px"/>                    
                    <p>Party Details</p>
                </div>
                <div class="u-action" onClick={() => handleHostLeave()}>
                <ExitOutline color={'#00000'}  title={"exit"} height="25px" width="25px"
/>

                    <p>Leave Party</p>
                </div>
            </div>
        </section>
    );
}
