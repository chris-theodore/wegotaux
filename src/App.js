import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Landing,Code, Create, Details, HostLanding, ListenerLanding, Queue, Search, SignIn } from "./components";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={() => <Landing />} />
          <Route path="/code" exact component={() => <Code />} />
          <Route path="/create" exact component={() => <Create />} />
          <Route path="/details" exact component={() => <Details />} />
          <Route path="/host" exact component={() => <HostLanding />} />
          <Route path="/listener" exact component={() => <ListenerLanding />} />
          <Route path="/queue" exact component={() => <Queue />} />
          <Route path="/search" exact component={() => <Search />} />
          <Route path="/signIn" exact component={() => <SignIn />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
