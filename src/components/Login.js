import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import  {useState, useContext, useCallback, useEffect, useRef} from 'react';
//import {SocketContext, socket} from '../context/socket';
//const socket = useContext(SocketContext);

import io from "socket.io-client";


const Login = () => {

    const [nickname, setNickname] = useState("");

    const socket = io("ws://localhost:8089", {
        reconnectionDelayMax: 10000,
        auth: {
            token: "123"
        },
        query: {
            "my-key": "my-value"
        }
    });

    function validateForm() {
        return nickname.length > 0;
    
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log("fired submit ");
        //console.log(socket.id);
        socket.emit("joinChat", nickname);
        console.log("fired submit 2");

    }

    return (
        <div className="Login">
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