import { Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/chats" component={Chat} />
        <Route path="" component={() => <div>NOT FOUND</div>} />
      </Switch>
    </div>
  );
};

export default App;
