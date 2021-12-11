import React, {useState} from "react";
import { useHistory, useParams, useLocation} from "react-router-dom";
import styles from '../styles/Code.module.css' // CSS imported
import axios from 'axios';
import querystring from 'querystring';
import io from "socket.io-client";
import { exit, listenerCount } from "process";
// Javascript Zone


// HTML Zone 
export default function Code() {
    const history = useHistory();
    const location = useLocation();
    const codecheck = false;
    const [values, setValues] = useState({
        party_code:'', party_listener:''})
    const set = name => {
        return({target: {value}}) => {
            setValues(oldValues => ({...oldValues, [name]: value}));
        }
    };
    const handleCodeSubmit = async (event) =>{
        event.preventDefault();
        try{
            await checkID();
            console.log(codecheck);
            alert("Time to Party!");
            setValues({
                party_code:''});
        } catch (e){
            alert(`Party join failed! ${e.message}`)
        }
        // send
        // if(codecheck) { // replace true with back end check to validate code
        //     history.push(`/listener${'/'}${values.party_code}`);
        // }
    }
    async function checkID() {
        const parameterDB = {
            id: values.party_code
        };
        const parameters = `?${querystring.stringify(parameterDB)}`;
        console.log(parameters)
        const dbSend = `${'https://we-got-aux.herokuapp.com/'}${'db/read/listening_party'}${parameters}`
        const dbresponse = await axios.get(dbSend);
        console.log(dbresponse.data.id);
        if (typeof(dbresponse.data.id) == "undefined"){

        }
        if (dbresponse.data.id = values.party_code){
            // history.push(`/listener${'/'}${values.party_code}`);
            const userCreateDB = {
                fname: values.party_listener,
                utype: "attendee",
                uid: dbresponse.data.id
            };
            const parameters = `?${querystring.stringify(userCreateDB)}`;
            console.log(parameters)
            const dbSend = `${'https://we-got-aux.herokuapp.com/'}${'db/create/user'}${parameters}`
            const createDBResponse = await axios.get(dbSend);
            history.push(`/listener${'/'}${values.party_listener}${'/'}${values.party_code}`);
        }

    }
    return (
        <section className={styles.code}>
            <form onSubmit={handleCodeSubmit}>
                <input className={styles.idInput} required value={values.party_listener} onChange={set('party_listener')} placeholder="Enter Your Name..."/>
                <input className={styles.idInput} pattern="[0-9]*" required value={values.party_code} maxLength="5" onChange={set('party_code')} placeholder="Enter Party Code..."/>
                <button className={styles.joinButtons} type="submit">Join</button>
            </form>
            
        </section>
    );
    }
