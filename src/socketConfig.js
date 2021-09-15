import openSocket from 'socket.io-client';

const socket = openSocket("ws://localhost:8089");

export default socket;