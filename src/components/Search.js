import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useHistory } from "react-router-dom";

import axios from 'axios';
import querystring from 'querystring';
import '../styles/Search.css' // CSS imported
import Queue from "./Queue";
let songnamearray = [];
export default function Search (){
  var globalqueue = [];
    const[dataB, setData] = React.useState([]);
  const [songsName, setSongsTerm] = React.useState([]);
  const [queueSongName, setSongQueue] = React.useState([]);
  const [songsURI, setSongsURI] = React.useState([]);
  const [artistsName, setArtistsTerm] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  
    // const handleSongInputChange = (event) => {
    // const songName = event.target.value;
    // setSearchTerm(searchTerm);
    // }
    // const handleArtistInputChange = (event) => {
    //     const artistName = event.target.value;
    //     setSearchTerm(searchTerm);
    //     }
  function handleSearch(){
    if(true) { // replace true with back end check to validate code
        // history.push("/queue");
    }
}
//   const handleSearch = (event) => {
//     event.preventDefault();
//     if (songName.trim() !== '') {
//       setErrorMsg('');
//       props.handleSearch(songName);
//     } 
//     else {
//       setErrorMsg('Please enter a song name.');
//     }
//   };
   
    async function getSong(song,artist){
        const parameterSong = {
            track: song, artist,
            // artist: artist
        };
        const parameters = `?${querystring.stringify(parameterSong)}`;
        const urlWithParameters = `${'http://localhost:5000/song/search'}${parameters}`;
        console.log(urlWithParameters);
        const response = await axios.get(urlWithParameters);
        console.log(response)
        console.log(response.data)
        if (setData != []) {
            setData([])
        }
        setData(response.data);
        console.log(setData);
    }
  function addSong(song_uri, song_img, song_title){
      console.log("HERE");
      console.log(song_uri);
      songnamearray.push(song_title);
      console.log(songnamearray);
      handleSubmit()
      
  }
  const history = useHistory();

  function handleSubmit(){
      if(true) {
          history.push("/queue");
      }
  }
  return (
    <div>
        <div className = "search-inputs">
        < input
        type="song"
        value={songsName}
        onChange={e => setSongsTerm(e.target.value)}
        placeholder="Search Song or Artist Name"
      />
    </div>
        <Button onClick={()=>getSong(songsName,artistsName)} variant="info" type="submit">
          Search!
        </Button>
        <React.Fragment>
            <ul>
                {
                dataB.map(data => <li key = {data.id}> <img src={data.picUrl} alt="Album Cover"/> Song Name: {data.title} {"\n"} Artist: {data.artist} <Button onClick={()=>addSong(data.id, data.picUrl, data.title)}> Add me! </Button></li>)
}     
            </ul>
            </React.Fragment>
    </div>
  );
}