import { render } from "@testing-library/react";
import React, {useState, useEffect, createContext, useLayoutEffect} from "react";
import { useHistory, useParams, useLocation } from "react-router";
import {Button} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import querystring from "query-string";
import { ArrowBackCircleOutline, Exit} from 'react-ionicons'
import '../styles/Listeners.css' // CSS imported

// Javascript Zone

// HTML Zone 
export default function Listeners() {
    const [users, setUsers] = React.useState([]);
    const history = useHistory();
    let {lid} = useParams();
    const location = useLocation();
    
    async function getUsers2(){
        const parameterDB = {
            id: parseInt(lid)
        };
        const parameters = `?${querystring.stringify(parameterDB)}`;
        console.log(parameters)
        const dbSend = `${'http://localhost:5000/'}${'db/read/users'}${parameters}`
        const dbresponse = await axios.get(dbSend);
        console.log(dbresponse);
        setUsers(dbresponse.data);
    }
    function handlePageChange(direction){
        if(direction === "back"){
            history.goBack();
    }
}
    async function kickUser(uid, lid, utype){
        if(utype == "host"){
            alert("You can't kick yourself!")
            return;
        }
        const parameterDB = {
            fname: uid,
            id: lid
        };
        const parameters = `?${querystring.stringify(parameterDB)}`;
        console.log(parameters)
        const dbSend = `${'http://localhost:5000/'}${'db/delete/user'}${parameters}`
        const dbresponse = await axios.get(dbSend);
        console.log(dbresponse);
        //need to kick off the user with their socket also.
    }
    React.useEffect(()=>{
        
        async function getUsers(){
            const parameterDB = {
                id: parseInt(lid)
            };
            const parameters = `?${querystring.stringify(parameterDB)}`;
            console.log(parameters)
            const dbSend = `${'http://localhost:5000/'}${'db/read/users'}${parameters}`
            const dbresponse = await axios.get(dbSend);
            console.log(dbresponse);
            setUsers(dbresponse.data);
        }
        
        getUsers();
    }, []); 
    useEffect(() => {
        const interval = setInterval(() => {
          getUsers2();
        }, 1000);
        return () => clearInterval(interval);
      }, []);
    return (
        <section id="listeners">
            <ArrowBackCircleOutline onClick={() => handlePageChange("back")}color={'#00000'}  title={"back"} height="40px" width="40px"/>
                {users ? users.fun_name: 'Loading Users...'}
                <h1>
                Active Listeners:
                </h1>
                {users.map(user => {
                    if(location.state.utype !== "host"){
  return <h2 key={user.id}>{user.fun_name} ({user.user_type})</h2>
                }else {
                    return <h2 key={user.id}>{user.fun_name} ({user.user_type}) <Button onClick={()=>kickUser(user.fun_name, user.id, user.user_type)}> Kick User! </Button></h2>
                }})}
        </section>
    );
}
