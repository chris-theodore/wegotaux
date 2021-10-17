import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Landing, Create, Code } from "./components";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={() => <Landing />} />
          <Route path="/create" exact component={() => <Create />} />
          <Route path="/code" exact component={() => <Code />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
