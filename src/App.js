import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Landing,Code, Create, Details, HostLanding, HostSongSelect, ListenerLanding, Queue, Search, SignIn } from "./components";

function App() {
  
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={() => <Landing />} />
          <Route path="/code/" exact component={() => <Code />} />
          <Route path="/create/" exact component={() => <Create />} />
          <Route path="/details" exact component={() => <Details />} />
          <Route path="/host/:lid" exact component={() => <HostLanding />} />
          <Route path="/listener/:lid" exact component={() => <ListenerLanding />} />
          <Route path="/queue/:utype/:lid" exact component={() => <Queue />} />
          <Route path="/search" exact component={() => <Search />} />
          <Route path="/signIn" exact component={() => <SignIn />} />
          <Route path="/hostselect/:lid" exact component={() => <HostSongSelect/>}/>
          <Route path="*" exact component={() => <Landing />} /> </Switch>
      </Router>
    </div>
  );
}

export default App;
