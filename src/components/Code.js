import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import '../styles/Code.css' // CSS imported

// Javascript Zone


// HTML Zone 
export default function Code() {

    const history = useHistory();

    function handleSubmit(){
        if(true) { // replace true with back end check to validate code
            history.push("/listener");
        } else {
            alert("The code you entered is invalid, please try again.");
        }
    }
    return (
        <section id="code">
            <form onSubmit={handleSubmit}>
                <input id="code-input" placeholder="Enter Party Code..."/>
                <button class="join-buttons glow-on-hover">Join</button>
            </form>
            
        </section>
    );
}