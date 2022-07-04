import { Route, Switch } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={HomePage} />
        <ProtectedRoute path="/chats" component={ChatPage} />
        <Route component={() => <div>NOT FOUND</div>} />
      </Switch>
    </div>
  );
};

export default App;
