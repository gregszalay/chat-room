import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import  {useState, useContext, useCallback, useEffect, useRef} from 'react';
//import {SocketContext, socket} from '../context/socket';
//const socket = useContext(SocketContext);
import { Redirect, useLocation } from 'react-router'

import io from "socket.io-client";
import socket from '../socketConfig'


const Users = () => {

    const [activeUsers, setActiveUsers] = useState("");


    socket.on("roomUsers", users => {
        console.log("typeof users: " + typeof users);
        const usersMap = users.users.map((u) => <li> {u}</li>);
        setActiveUsers(usersMap);
        console.log("users event fired: " + usersMap);
    });

    return (
        <div>
                <ul>
                    {activeUsers}
                </ul>
            </div>

        )
    
}
export default Users