import logo from './logo.svg';
import './App.css';
import Login from './components/Login'
import Chat from './components/Chat'
import Users from './components/Users'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { history } from 'history';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";

//import {SocketContext, socket} from './context/socket';

function App() {
  return (
      <div>

      <Nav className="flex-column bg-primary text-white">
      <h1 className="header">Chat-room app</h1>
      
</Nav>
    <Container fluid="md">
    <BrowserRouter >
      <div>
        <Switch>
          <Route exact path="/">
            <Login></Login>
          </Route>
          <Route path="/chat">
            <Chat />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  </Container>
      </div>

  );
}

export default App;
