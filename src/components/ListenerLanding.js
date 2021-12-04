import React, { useEffect} from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { ExitOutline, PauseOutline, PlaySkipBackOutline, PlaySkipForwardOutline, MenuOutline, PeopleOutline, InformationCircleOutline } from 'react-ionicons'
import axios from 'axios';
import querystring from 'query-string'

import '../styles/ListenerLanding.css' // CSS imported
import * as io from 'socket.io-client';


// Javascript Zone
const socket = io.connect(`http://localhost:5000`);

// HTML Zone 
export default function ListenerLanding() {
    const [currentImage, setCurrentImage] = React.useState(null);
    const [currentSongID, setCurrentSong] = React.useState(null);
    const [songLength, setSongLength] = React.useState(0);
    const [currentSongName, setCurrentName] = React.useState(null);
    const location = useLocation();
    const history = useHistory();
    let {lid} = useParams();
    let {uid} = useParams();
    const utype = "listener";
    React.useEffect(() => {
        socket.emit('join', {uid, lid});
        
      }, []);
    socket.on("user kick", (data) => {
        handleUserLeave();
    });
    socket.on("receive code", (data) => {
            // console.log(data);
            setCurrentImage(data.socketImage);
            setCurrentSong(data.socketSong);
            setCurrentName(data.socketName);
            setSongLength(data.socketLength);
                });
    function handleSubmit(direction){
        if(direction === "queue"){
            // console.log(location.state.path_name)
            history.push(`/queue${'/'}${utype}${'/'}${lid}`);
        } else if(direction === "listeners"){
            history.push(`/listeners${'/'}${lid}`, {utype: "listener"});
        } else if(direction === "/details"){
            history.push("details");
        }
    }
    const handleUserLeave = async (event) =>{
        try{
            await UserLeave();
            alert("Hope you enjoyed the party!")
        } catch (e){
            alert(`Party leave failed! ${e.message}`)
        }
    }
    async function validUser(){
        const parameterDB = {
            fname: uid,
            id: lid
        };
        const parameters = `?${querystring.stringify(parameterDB)}`;
        console.log(parameters)
        const dbSend = `${'http://localhost:5000/'}${'db/check/user'}${parameters}`
        const dbresponse = await axios.get(dbSend);
        console.log(dbresponse);
        if(dbresponse.data.length == 0){
            alert("You have been kicked from the party!");
            history.push(`/`);
        }
}
    async function UserLeave(){
            const parameterDB = {
                fname: uid,
                id: parseInt(lid)
            };
            const parameters = `?${querystring.stringify(parameterDB)}`;
            console.log(parameters)
            const dbSend = `${'http://localhost:5000/'}${'db/delete/user'}${parameters}`
            const dbresponse = await axios.get(dbSend);
            console.log(dbresponse);
            history.push(`/`);
    }
    useEffect(() => {
        const interval = setInterval(() => {
          validUser();
        }, 1000);
        return () => clearInterval(interval);
      }, []);
    return (
        <section id="listen-landing">
            <div id="player">
                <img id="album-art" src={currentImage}/>
                <div id="song-name">
                    {currentSongName}
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
                <div class="u-action" onClick={() => handleUserLeave()}>
                <ExitOutline color={'#00000'}  title={"exit"} height="25px" width="25px"
/>

                    <p>Leave Party</p>
                </div>
            </div>
        </section>
    );
}
