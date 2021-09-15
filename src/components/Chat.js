import { useState, useEffect } from 'react';

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Offcanvas from "react-bootstrap/Offcanvas";

import socket from '../socketConfig'

var listItems;

const Chat = () => {

    const [messages, setMessages] = useState(listItems);
    const [newMessage, setNewMessage] = useState("");
    const [showUserList, setShowUserList] = useState(false);
    const [userName, setUserName] = useState("");
    const [activeUsers, setActiveUsers] = useState(userName);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        socket.emit("loadMessages", 0);
    }, [])

    socket.on("roomUsers", users => {
        const usersMap = users.users.map((u) => <li>{u}</li>);
        setActiveUsers(usersMap);
    });

    socket.on("freshMessages", messages => {
        listItems = messagesToList(messages);
        setMessages(listItems);
    });

    const messagesToList = (messages) => {
        return messages.map((m) =>
        <Card className="mt-2 mb-2">
            <Card.Header>{m.nickName}</Card.Header>
            <Card.Body>
                <blockquote className="blockquote mb-0">
                    <p>
                        {' '}{m.message}{' '}
                    </p>
                    <footer className="blockquote-footer">
                        <cite title="Source Title">{
                            new Date(parseInt(m._id.substring(0, 8), 16) * 1000).toString()
                        }</cite>
                    </footer>
                </blockquote>
            </Card.Body>
        </Card>
    );
    }

    const handleNewMessage = (event) => {
        event.preventDefault();
        socket.emit("newMessage", newMessage);
        socket.emit("loadMessages", 1);
        
    }

    const handleUserNameUpdate = (event) => {
        event.preventDefault();
        setUserName(userName);
        socket.emit("updateUserName", userName);

    }


    const handleScroll = (e) => {
        if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
            socket.emit("loadMessages", messages.length);
        }

    }
    
    return (
        <Container fluid="md">
            <h3 className="m-5">Üdv a chat szobában!</h3>
            <Row>
                <Col>
                    <div style={{ overflow: 'scroll', height: '400px' }} onScroll={(e) => handleScroll(e)}>
                        {messages}
                    </div>
                    <Container fluid="md" className="m-5">
                        <Form onSubmit={(e) => handleNewMessage(e)} className="m-5">
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
                    </Container>
                </Col>
                <Col>
                    <Container fluid="md" className="m-5">
                        <Form onSubmit={(e) => handleUserNameUpdate(e)} className="m-5">
                            <Form.Group size="lg" controlId="newUserName">
                                <Form.Label>becenév megváltoztatása:</Form.Label>
                                <Form.Control
                                    autoFocus
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </Form.Group>
                            <Button block size="lg" type="submit">
                                Küldés
                            </Button>
                        </Form>
                        <Button onClick={() => { handleShow(); setShowUserList(!showUserList); console.log(showUserList); }} >
                            Aktív felhasználók mutatása
                        </Button>
                    </Container>
                </Col>
            </Row>
            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Aktív felhasználók:</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {activeUsers}
                </Offcanvas.Body>
            </Offcanvas>
        </Container >
    );


}


export default Chat