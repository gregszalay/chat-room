import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import  {useState, useContext, useCallback, useEffect, useRef} from 'react';
//import {SocketContext, socket} from '../context/socket';
//const socket = useContext(SocketContext);
import { BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import Chat from './Chat'

import io from "socket.io-client";
import socket from '../socketConfig'


const Login = () => {

    const [nickname, setNickname] = useState("");
    const [redirect, setRedirect] = useState("");
    //const socket = io("ws://localhost:8089");

    function validateForm() {
        return nickname.length > 0;
    }

    const state = {
        redirect: false
      }
    

    function handleSubmit(event) {
        event.preventDefault();
        console.log("fired submit ");
        //console.log(socket.id);
        socket.emit("joinChat", nickname);
        console.log("fired submit 2");
        setRedirect(true);
       console.log("state: " + redirect);

    }


     if (redirect) {
       return (<Redirect to='/chat'/>);
     } 

    return (
        
        
            <div className="Login">
                {console.log("rendered")}
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="nickname">
                    <Form.Label>Becenév</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                </Form.Group>
                <Button block size="lg" type="submit" disabled={!validateForm()}>
                Login
                </Button>
            </Form>
            </div>
    );
                }



//socket.emit('join', this.nickname.value)

export default Login