import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import { useState } from 'react';
import { Redirect } from 'react-router-dom';

import socket from '../socketConfig'


const Login = () => {

    const [nickname, setNickname] = useState("");
    const [redirect, setRedirect] = useState("");

    function validateForm() {
        return nickname.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();
        socket.emit("joinChat", nickname);
        setRedirect(true);

    }

    if (redirect) {
        return (<Redirect to='/chat' />);
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