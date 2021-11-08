import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import querystring from 'querystring';
import '../styles/Search.css' // CSS imported
export default function Search (){
    const[dataB, setData] = React.useState([]);
  const [songsName, setSongsTerm] = React.useState([]);
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
  return (
    <div>
        <div className = "search-inputs">
        < input
        type="song"
        value={songsName}
        onChange={e => setSongsTerm(e.target.value)}
        placeholder="Search Song or Artist Name"
      />
      {/* <input
        type="artist"
        value={artistsName}
        onChange={e => setArtistsTerm(e.target.value)}
        placeholder="Search Artist Name"
      /> */}
    </div>
        <Button onClick={()=>getSong(songsName,artistsName)} variant="info" type="submit">
          Search!
        </Button>
        <React.Fragment>
            <ul>
                {
                dataB.map(data => <li key = {data.id}> <img src={data.picUrl} alt="Album Cover"/> Song Name: {data.title} {"\n"} Artist: {data.artist} <Button> Add me! </Button></li>)
}     
            </ul>
            </React.Fragment>
    </div>
  );
}