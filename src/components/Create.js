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


    const [deviceName, setDeviceName] = React.useState(null);
    const [codeB, setCode] = React.useState(null);
    const [deviceB, setDevice] = React.useState([]);
    const [values, setValues] = useState({
        party_name:'', party_host_name:''})
    const set = name => {
        return({target: {value}}) => {
            setValues(oldValues => ({...oldValues, [name]: value}));
        }
    };
    const history = useHistory();
    const handlePartySubmit = async (event) =>{
        event.preventDefault();
        try{
            await sendPlaylist();
            alert("Let's get this party started!")
            setValues({
                party_name:'', party_host_name:''});
        } catch (e){
            alert(`Party registration failed! ${e.message}`)
        }
        // send
        if(true) { // replace true with back end check to validate code
            history.push("/host");
        }
    }
    async function sendPlaylist(){
        const description = 'this is a test '
        const request = await axios.get(`http://localhost:5000/new/playlist${'?name='}${values.party_name}&${'descrip='}${description}`)
        console.log(request)
        console.log(request.data)
    }
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
            // const request = await axios.post(`http://localhost:5000/chosen/device${'?device_id='}${device_id}&${'party_id='}${party_id}`)
            // console.log(request)
            // console.log(request.data)
        }
    if (!codeB) return "No chris!"
    if (!deviceB) return "No devices!"
    return (
        <section id="create">
            <h1>Party Code: {codeB.code}</h1>
            <React.Fragment>
            <ul>
                {
                deviceB.map(data => <li key = {data.id}> Device Name: {data.name} <Button id="device-button" onClick={()=>sendDevice(codeB.code, data.id, data.name)}> Use me! </Button></li>)
}
            </ul>
            </React.Fragment>
            <h1 id="device-selected"> Device Selected: {deviceName}</h1>
                <form onSubmit={handlePartySubmit}>
                    <label htmlFor="party-name-input"></label>
                <input id="party-name-input" required value={values.party_name} onChange={set('party_name')} placeholder="Enter Party Name..."/>
                <label htmlFor="party-host-input"></label>
                <input id="party-host-input" type="text" required value={values.party_host_name} onChange={set('party_host_name')} placeholder="Enter Host Name..."/>
                <button type="submit" class="start-button glow-on-hover">Let's Start The Party</button>
                </form>
                {/* <button onClick={getCode()}>Test</button> */}
                {/* <a class="sign-in-button change-on-hover" href="http://localhost:5000/create/party"> Code</a> */}
                <button onClick={history.goBack}>Go Back</button>

        </section>
    );
}
