const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origins: ["localhost:3000", "localhost:8089"]
  }
});
const {
  saveMessage, getNewMessages, getOldMessages, getTimeStampFromId
} = require('./db-utils');

const usersInRoom = [];
const usernamesToSocketIds = new Map();

io.on('connection', (socket) => {

  console.log('A user has connected')

  socket.on("disconnect", (reason) => {
    console.log("A user was disconnected due to: " + reason);
  });

  //Join chat, load 20 most recent messages from db
  socket.on("joinChat", username => {
    console.log(username + " has joined the chat");
    
    usersInRoom.push(username);
    usernamesToSocketIds.set(socket.id, username);
    
    socket.join('Main Room');
    
    getNewMessages(20).then(loadedMessages => {
      console.log(loadedMessages); 
      socket.emit(loadedMessages);
    });
    

    io.to('Main Room').emit('roomUsers', {
      room: 'Main Room',
      users: usersInRoom
    });
  });

  //Load 20 more messages from before the earliest message from db
  socket.on("loadMoreMessages", earliestLoadedMessage => {
    getOldMessages(20, earliestLoadedMessage)
    .then(earlierMessages => {
      console.log(earlierMessages); 
      socket.emit(earlierMessages);
    });
  });


  //Save new message to db
  socket.on("newMessage", message => {
    username = usernamesToSocketIds.get(socket.id);
    saveMessage(db, username, message)
    .then(savedMessage => {
      console.log(savedMessage); 
      io.broadcast.emit('message', savedMessage);
    });
  });

});

const PORT = 8089;
server.listen(PORT, () => console.log("Server running on port " + PORT));