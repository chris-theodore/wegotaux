import React from "react";
import { Link, withRouter } from "react-router-dom";
import '../styles/Landing.css' // CSS imported

// Javascript Zone


// HTML Zone 
export default function Landing() {
    return (
        <section id="landing">
           <Link class="join-buttons glow-on-hover" to="/code">Join Exisiting Party</Link>
           <Link class="join-buttons glow-on-hover"to="/signIn">Create New Party</Link>
        </section>
    );
}
