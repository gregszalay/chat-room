import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";


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
       
        <Container fluid="md">
            <div className="Login">
                {console.log("rendered")}
            <Form onSubmit={handleSubmit} className="m-5" >
                <Form.Group size="lg" controlId="nickname">
                    <Form.Label>Kérlek, add meg a beceneved:</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        />
                </Form.Group>
                <Button block size="lg" type="submit" disabled={!validateForm()}>
                Csatlakozás
                </Button>
            </Form>
            </div>
                        </Container>
    );
                }



//socket.emit('join', this.nickname.value)

export default Login