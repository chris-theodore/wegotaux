import React, {useState} from "react";
import { useHistory, useParams } from "react-router-dom";
import '../styles/Code.css' // CSS imported
import io from "socket.io-client";
// Javascript Zone


// HTML Zone 
export default function Code() {
    const history = useHistory();
    const [values, setValues] = useState({
        party_code:'', party_listener:''})
    const set = name => {
        return({target: {value}}) => {
            setValues(oldValues => ({...oldValues, [name]: value}));
        }
    };
    function handleSubmit(){
        if(true) { // replace true with back end check to validate code
            history.push(`/listener${'/'}${values.party_code}`);
            
        }
    }
    return (
        <section id="code">
            <form onSubmit={handleSubmit}>
                <input id="id-input" required value={values.party_listener} onChange={set('party_listener')} placeholder="Enter Name..."/>
                <input id="code-input" type="text" required value={values.party_code} onChange={set('party_code')} placeholder="Enter Party Code..."/>
                <button class="join-buttons glow-on-hover">Join</button>
            </form>
            
        </section>
    );
}