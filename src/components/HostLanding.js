import React from "react";
import { useHistory } from "react-router-dom";
import { ExitOutline, PauseOutline, PlaySkipBackOutline, PlaySkipForwardOutline, MenuOutline, PeopleOutline, InformationCircleOutline } from 'react-ionicons'
import '../styles/HostLanding.css' // CSS imported

// Javascript Zone


// HTML Zone 
export default function HostLanding() {
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


    return (
        <section id="listener-landing">
            <div id="player">
                <img id="album-art" src="../data/images/albumcover-placeholder.jpg"/>
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
