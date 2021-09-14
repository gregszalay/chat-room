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

    getNewMessages(20)
      .then(loadedMessages => {
        console.log(loadedMessages);
        socket.emit("freshMessages", loadedMessages);
      })
      .catch(error => { console.log(error) });


    io.to('Main Room').emit('roomUsers', {
      room: 'Main Room',
      users: usersInRoom
    });
  });

  socket.on("loadFreshMessages", () => {
    getNewMessages(20)
      .then(loadedMessages => {
        console.log(loadedMessages);
        socket.emit("freshMessages", loadedMessages);
      })
      .catch(error => { console.log(error) });
  });

  //Load 20 more messages from before the earliest message from db
  socket.on("loadMoreMessages", earliestLoadedMessage => {
    getOldMessages(20, earliestLoadedMessage)
      .then(earlierMessages => {
        console.log(earlierMessages);
        socket.emit(earlierMessages);
      })
      .catch(error => { console.log(error) });
  });


  //Save new message to db
  socket.on("newMessage", message => {
    username = usernamesToSocketIds.get(socket.id);
    saveMessage(username, message)
      .then(savedMessage => {
        console.log("A new mewssage was saved: " + savedMessage);
        socket.broadcast.emit('savedMessage', savedMessage);
        getNewMessages(20)
          .then(loadedMessages => {
            console.log(loadedMessages);
            socket.broadcast.emit("freshMessages", loadedMessages);
          })
          .catch(error => { console.log(error) });
      })
      .catch(error => { console.log(error) });
  });

});

const PORT = 8089;
server.listen(PORT, () => console.log("Server running on port " + PORT));