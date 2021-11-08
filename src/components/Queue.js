import React from "react";
import '../styles/Queue.css' // CSS imported
import { ArrowBackCircleOutline, ArrowUpCircleOutline,ArrowDownCircleOutline } from 'react-ionicons'
import { useHistory } from "react-router-dom";


// Javascript Zone


// HTML Zone 
export default function Queue() {

    const history = useHistory();

    function handlePageChange(direction){
        if(direction === "back"){
            history.push("listener");
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
                <button id="q-song" onClick={() => handlePageChange("q")}>Queue Song</button>
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
           <div id="polls">
                <div class="vote-card">
                    <img class="voter-album-art" src="../data/images/albumcover-placeholder.jpg"/>
                    <p>Song Name</p>
                    <div class="vote-tools">
                        <ArrowUpCircleOutline onClick={() => handleVote("up")} color={'#00000'}  title={"upvote"} height="25px" width="25px"/>
                        <ArrowDownCircleOutline onClick={() => handleVote("down")} color={'#00000'}  title={"downvote"} height="25px" width="25px"/>
                    </div>
               </div>
               <div class="vote-card">
                    <img class="voter-album-art" src="../data/images/albumcover-placeholder.jpg"/>
                    <p>Song Name</p>
                    <div class="vote-tools">
                        <ArrowUpCircleOutline onClick={() => handleVote("up")} color={'#00000'}  title={"upvote"} height="25px" width="25px"/>
                        <ArrowDownCircleOutline onClick={() => handleVote("down")} color={'#00000'}  title={"downvote"} height="25px" width="25px"/>
                    </div>
               </div>
               <div class="vote-card">
                    <img class="voter-album-art" src="../data/images/albumcover-placeholder.jpg"/>
                    <p>Song Name</p>
                    <div class="vote-tools">
                        <ArrowUpCircleOutline onClick={() => handleVote("up")} color={'#00000'}  title={"upvote"} height="25px" width="25px"/>
                        <ArrowDownCircleOutline onClick={() => handleVote("down")} color={'#00000'}  title={"downvote"} height="25px" width="25px"/>
                    </div>
                </div>
               <div class="vote-card">
                    <img class="voter-album-art" src="../data/images/albumcover-placeholder.jpg"/>
                    <p>Song Name</p>
                    <div class="vote-tools">
                        <ArrowUpCircleOutline onClick={() => handleVote("up")} color={'#00000'}  title={"upvote"} height="25px" width="25px"/>
                        <ArrowDownCircleOutline onClick={() => handleVote("down")} color={'#00000'}  title={"downvote"} height="25px" width="25px"/>
                    </div>
                </div>
               <div class="vote-card">
                    <img class="voter-album-art" src="../data/images/albumcover-placeholder.jpg"/>
                    <p>Song Name</p>
                    <div class="vote-tools">
                        <ArrowUpCircleOutline onClick={() => handleVote("up")} color={'#00000'}  title={"upvote"} height="25px" width="25px"/>
                        <ArrowDownCircleOutline onClick={() => handleVote("down")} color={'#00000'}  title={"downvote"} height="25px" width="25px"/>
                    </div>
        </div>
           </div>

        </section>
    );
}
