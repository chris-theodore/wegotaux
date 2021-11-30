import React, { useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { ExitOutline, PauseOutline, PlaySkipBackOutline, PlaySkipForwardOutline, MenuOutline, PeopleOutline, InformationCircleOutline } from 'react-ionicons'
import '../styles/HostLanding.css' // CSS imported
import axios from 'axios';
import * as io from 'socket.io-client';
// Javascript Zone

let playbackState =[];
const socket = io.connect(`http://localhost:5000`);

// HTML Zone 
export default function HostLanding() {
    const location = useLocation();
    const pathname = "host";
    const [currentImage, setCurrentImage] = React.useState(null);
    const [currentSongID, setCurrentSong] = React.useState(null);
    const [songLength, setSongLength] = React.useState(0);
    const [currentSongName, setCurrentName] = React.useState(null);
   const history = useHistory();
   let {lid} = useParams();
   const utype = "host";
   React.useEffect(() => {
       socket.emit('join', lid);
       return () => {
           socket.emit('leave room', 
             lid
           )
       }
     }, []);
     async function skipSong(){
         //need to post this with unique id of the listening party as query parameter
         const response = await axios.post("http://localhost:5000/skip/song")
     }
    function handleSubmit(direction){
        if(direction === "queue"){
            // console.log(location.state.dummy);
            // console.log(location.state.song);
            history.push(`/queue${'/'}${utype}${'/'}${lid}`, {path: location.state.pathname, song_id: location.state.song_id, song_name: location.state.song_name, song_pic : location.state.song_pic, song_length: location.state.song_length});
        } else if(direction === "listeners"){
            history.push("listeners");
        } else if(direction === "details"){
            history.push("details");
        } else if(direction === "leave"){
            history.push("/");
            // need to do an api call here to remove the user from the database.
        } 
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
            setSongLength(response.data.item.duration_ms);
            // currentlength = response.data.item.duration_ms;
            setCurrentName(response.data.item.name);
        
        socket.emit('song event', {
            room: lid,
            socketSong: incoming_songid,
            socketImage: response.data.item.album.images[1].url,
            socketLength: response.data.item.duration_ms,
            socketName: response.data.item.name
        })
        
    }
        

        
    }
    React.useEffect(()=>{
        
        async function getPlayback(){
            const response = await axios.get("http://localhost:5000/currently/playing");
            console.log(response);
            setSongLength(response.data.item.duration_ms);
            setCurrentSong(response.data.item.id);
            setCurrentImage(response.data.item.album.images[1].url);
            setCurrentName(response.data.item.name);
            socket.emit('song event', {
                room: lid,
                socketSong: response.data.item.id,
                socketImage: response.data.item.album.images[1].url,
                socketLength: response.data.item.duration_ms,
                socketName: response.data.item.name
            })
        }
        
        getPlayback();
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
          getPlayback2();
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
                <div class="u-action" onClick={() => handleSubmit("leave")}>
                <ExitOutline color={'#00000'}  title={"exit"} height="25px" width="25px"
/>

                    <p>Leave Party</p>
                </div>
            </div>
        </section>
    );
}
