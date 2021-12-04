import React, { useEffect} from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { ExitOutline, PauseOutline, PlaySkipBackOutline, PlaySkipForwardOutline, MenuOutline, PeopleOutline, InformationCircleOutline } from 'react-ionicons'
import axios from 'axios';

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
    let {uid, lid} = useParams();
    const utype = "listener";
    React.useEffect(() => {
        socket.emit('join', lid);

        return () => {
            socket.emit('leave room', 
              lid
            )
        }
      }, []);
    socket.on("receive code", (data) => {
            console.log(data);
            setCurrentImage(data.socketImage);
            setCurrentSong(data.socketSong);
            setCurrentName(data.socketName);
            setSongLength(data.socketLength);
                });
    socket.on("song update", (data) => {
        console.log(data);
        setCurrentImage(data.data.socketImage);
        setCurrentSong(data.data.socketSong);
        setCurrentName(data.data.socketName);
        setSongLength(data.data.socketLength);
            });
    
    function handleSubmit(direction){
        if(direction === "queue"){
            // console.log(location.state.path_name)
            history.push(`/queue${'/'}${utype}${'/'}${uid}${'/'}${lid}`);
        } else if(direction === "listeners"){
            history.push(`/listeners${'/'}${lid}`);
        } else if(direction === "/details"){
            history.push("details");
        } else if(direction === "/leave"){
            history.push("/");
            // need to do an api call here to remove the user from the database.
        } 
    }
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
                <div class="u-action" onClick={() => handleSubmit("leave")}>
                <ExitOutline color={'#00000'}  title={"exit"} height="25px" width="25px"/>
                    <p>Leave Party</p>
                </div>
            </div>
        </section>
    );
}