import { render } from "@testing-library/react";
import React, {useState, useEffect} from "react";
import { useHistory } from "react-router";
import {Button} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
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
    const [deviceName, setDeviceName] = React.useState(null);
    const [codeB, setCode] = React.useState(null);
    const [deviceB, setDevice] = React.useState([]);

    React.useEffect(()=>{
        
        async function getCode(){
            const response = await axios.get("http://localhost:5000/create/party");
            console.log(response)
            console.log(response.data)
            setCode(response.data);
        }
        
        getCode();
    }, []);    
    React.useEffect(()=>{
        async function getDevice(){
            const response = await axios.get("http://localhost:5000/find/device");
            console.log(response)
            console.log(response.data)
            if (setDevice != []) {
                setDevice([])
            }
            setDevice(response.data.devices);
            console.log(setDevice);
        }
        getDevice();
    }, []);    
        async function sendDevice(party_id, device_id,device_name){
            setDeviceName(device_name);
            const request = await axios.post(`http://localhost:5000/chosen/device${'?device_id='}${device_id}&${'party_id='}${party_id}`)
            console.log(request)
            console.log(request.data)
        }
    if (!codeB) return "No chris!"
    if (!deviceB) return "No devices!"
    return (
        <section id="create">
            <h1>Party Code: {codeB.code}</h1>
            {/* <Button onClick={()=>getDevice()} variant="info" type="submit">
          Select Device for Party!
        </Button> */}
            <React.Fragment>
            <ul>
                {
                deviceB.map(data => <li key = {data.id}> Device Name: {data.name} <Button id="device-button" onClick={()=>sendDevice(codeB.code, data.id, data.name)}> Use me! </Button></li>)
}
            </ul>
            </React.Fragment>
            <h1 id="device-selected"> Device Selected: {deviceName}</h1>
                <form onSubmit={handlePartyNameSubmit}>
                <input id="party-name-input" placeholder="Enter Party Name..."/>
                </form>
                <form>
                <input id="party-host-input" placeholder="Enter Host Name..."/>
                </form>
                {/* <label style={{marginRight: '10px'}}>Number of Attendees:</label> */}
                <Link class="start-button glow-on-hover"to="/host">Let's Start The Party</Link>
                {/* <button onClick={getCode()}>Test</button> */}
                {/* <a class="sign-in-button change-on-hover" href="http://localhost:5000/create/party"> Code</a> */}
                <button onClick={history.goBack}>Go Back</button>

        </section>
    );
}
