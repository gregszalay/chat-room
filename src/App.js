import logo from './logo.svg';
import './App.css';
import Login from './components/Login'
import Chat from './components/Chat'
import Users from './components/Users'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { history } from 'history';

//import {SocketContext, socket} from './context/socket';

function App() {
  return (
    <BrowserRouter >
      <div>
        <Switch>
          <Route exact path="/">
            <Login></Login>
          </Route>
          <Route path="/chat">
            <Chat />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
