import React from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import '../styles/Create.css' // CSS imported

// Javascript Zone


// HTML Zone 
export default function Create() {
    const history = useHistory();

    function handlePartyNameSubmit(){
        if(true) { // replace true with back end check to validate code
            history.push("/host");
        }
    }
    return (
        <section id="create">
                <form onSubmit={handlePartyNameSubmit}>
                <input id="party-name-input" placeholder="Enter Party Name..."/>
                </form>
                <form>
                <input id="party-host-input" placeholder="Enter Host Name..."/>
                </form>
                {/* <label style={{marginRight: '10px'}}>Number of Attendees:</label> */}

                <Link class="start-button glow-on-hover"to="/host">Let's Start The Party</Link>
                <button onClick={history.goBack}>Go Back</button>

        </section>
    );
}