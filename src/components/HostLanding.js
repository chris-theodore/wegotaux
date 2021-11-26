import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ExitOutline, PauseOutline, PlaySkipBackOutline, PlaySkipForwardOutline, MenuOutline, PeopleOutline, InformationCircleOutline } from 'react-ionicons'
import '../styles/HostLanding.css' // CSS imported
import axios from 'axios';

// Javascript Zone

let playbackState =[];
let currentsongname= '';
// let currentartist = '';
let currentlength= 0;
// HTML Zone 
export default function HostLanding() {
    const [currentImage, setCurrentImage] = React.useState(null);
    const [currentSongID, setCurrentSong] = React.useState(null);
    const [songLength, setSongLength] = React.useState(0);
    const [currentSongName, setCurrentName] = React.useState(null);
   const history = useHistory();

    function handleSubmit(direction){
        if(direction === "queue"){
            history.push("queue");
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
        if(currentSongID != incoming_songid){
            setCurrentSong(incoming_songid);
            setCurrentImage(response.data.item.album.images[1].url);
            setSongLength(response.data.item.duration_ms);
            // currentlength = response.data.item.duration_ms;
            setCurrentName(response.data.item.name);
        }
        

        
    }
    React.useEffect(()=>{
        
        async function getPlayback(){
            const response = await axios.get("http://localhost:5000/currently/playing");
            // console.log(response)
            // console.log(response.data)
            // console.log(response);
            setSongLength(response.data.item.duration_ms);
            // console.log(response.data.item.duration_ms);
            // currentlength = response.data.item.duration_ms;
            // currentsongname = response.data.item.name;
            // console.log(currentlength);
            // console.log(songLength);
            setCurrentSong(response.data.item.id);
            setCurrentImage(response.data.item.album.images[1].url);
            setCurrentName(response.data.item.name);
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
            <div id="player">
                <img id="album-art" src={currentImage}/>
                <div id="song-name">
                    {currentSongName}
                </div>
                <div id="player-actions">
                    <PlaySkipBackOutline class="p-action" color={'#00000'} title={"back"} height="25px" width="25px"/>
                    <PauseOutline  class="p-action" color={'#00000'} title={"pause"} height="25px" width="25px"/>
                    <PlaySkipForwardOutline  class="p-action" color={'#00000'} title={"forwards"} height="25px" width="25px"/>
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
