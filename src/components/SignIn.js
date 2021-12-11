import React from "react";
import { Link, withRouter } from "react-router-dom";
import '../styles/SignIn.css' // CSS imported
import gif from '../assets/WeGotAux.gif';

// Javascript Zone
export default function SignIn(){
// HTML Zone 
    return (
        <section id="sign-in">
        <img src={gif} alt="We Got Aux!"/>
        {/* <img src='../assets/wegotauxSignIn.png'/> */}
        <a class="sign-in-button change-on-hover" href="https://we-got-aux.herokuapp.com/auth/Spotify"> Login to Spotify</a>
        </section>
    );
}