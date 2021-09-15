const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origins: ["localhost:3000", "localhost:8089"]
  }
});
const { saveMessage, getNewMessages } = require('./db-utils');

const usernamesToSocketIds = new Map();

//Handle new connection
io.on('connection', (socket) => {

  console.log('A websocket connection has been made')

  //Handle disconnect
  socket.on("disconnect", (reason) => {
    console.log("A user was disconnected due to: " + reason);
    usernamesToSocketIds.delete(socket.id);
    io.emit('roomUsers', {
      users: [ ...usernamesToSocketIds.values() ]
    });
  });

  //Handle user join
  socket.on("joinChat", username => {
    console.log(username + " has joined the chat");
    usernamesToSocketIds.set(socket.id, username);
    socket.join('Main Room');
    getNewMessages(20)
      .then(loadedMessages => {
        socket.emit("freshMessages", loadedMessages);
      })
      .catch(error => { console.log(error) });
    io.emit('roomUsers', {
      users: [ ...usernamesToSocketIds.values() ]
    });
  });

  //Handle change of username
  socket.on("updateUserName", newUserName => {
    usernamesToSocketIds.set(socket.id, newUserName);
    io.emit('roomUsers', {
      users: [ ...usernamesToSocketIds.values() ]
    });
  });

  //Load messages from db
  socket.on("loadMessages", numberOfLoadedMessages => {
    getNewMessages(numberOfLoadedMessages + 20)
      .then(loadedMessages => {
        socket.emit("freshMessages", loadedMessages);
      })
      .catch(error => { console.log(error) });
  });

  //Save new message to db
  socket.on("newMessage", message => {
    username = usernamesToSocketIds.get(socket.id);
    saveMessage(username, message)
      .then(savedMessage => {
        console.log("A new message was saved: " + savedMessage);
        socket.broadcast.emit('savedMessage', savedMessage);
        getNewMessages(20)
          .then(loadedMessages => {
            socket.broadcast.emit("freshMessages", loadedMessages);
          })
          .catch(error => { console.log(error) });
      })
      .catch(error => { console.log(error) });
  });

});

const PORT = 8089;
server.listen(PORT, () => console.log("Server running on port " + PORT));