import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { useState, useContext, useCallback, useEffect, useRef } from 'react';
//import {SocketContext, socket} from '../context/socket';
//const socket = useContext(SocketContext);
import { Redirect, useLocation } from 'react-router'

import io from "socket.io-client";
import socket from '../socketConfig'

var listItems;


const Chat = () => {

    const [messages, setMessages] = useState(listItems);
    const [newMessage, setNewMessage] = useState("");
    //const socket = io("ws://localhost:8089");

    useEffect(async () => {
        socket.emit("loadFreshMessages");
        
    }, [])

    socket.on("freshMessages", messages => {
        console.log("typeof messages: " + typeof messages);
        listItems = messages.map((m) => <li> {m.nickName} {m.message} {m._id}</li>);
        setMessages(listItems);
        console.log("event fired: " + messages);
    });

    function handleNewMessage() {
        //setNewMessage(e.target.value);
        socket.emit("newMessage", newMessage);
        //socket.emit("loadFreshMessages");
        setMessages(listItems);
    }

    return (
        <div className="container">
            <h1>Üdv a chat szobában!</h1>
            <Form onSubmit={handleNewMessage}>
                <Form.Group size="lg" controlId="newMessage">
                    <Form.Label>Új üzenet:</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                   
                    />
                </Form.Group>
                <Button block size="lg" type="submit">
                    Küldés
                </Button>
            </Form>
            <div>
                <ul>
                    {messages}
                </ul>
            </div>
        </div>
    );


}


export default Chat