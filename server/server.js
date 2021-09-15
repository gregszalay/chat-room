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
  saveMessage, getNewMessages, getOldMessages, getTimeStampFromId, getSocketConnectionsMap
} = require('./db-utils');

function logMapElements(value, key, map) {
  console.log(`m[${key}] = ${value}`);
}

let usersInRoom = [];


io.on('connection', (socket) => {

  console.log('A user has connected')

  /*
  getSocketConnectionsMap().set(socket.id, "Névtelen felhasználó");
  io.emit('roomUsers', {
    users:  [ ...getSocketConnectionsMap().values() ]
  });

  */

  socket.on("disconnect", (reason) => {
    console.log("A user was disconnected due to: " + reason);
    getSocketConnectionsMap().delete(socket.id);
    io.emit('roomUsers', {
      users: /*usersInRoom*/ [ ...getSocketConnectionsMap().values() ]
    });
    //usersInRoom=[];
  });

  //Join chat, load 20 most recent messages from db
  socket.on("joinChat", username => {
    console.log(username + " has joined the chat");

    usersInRoom.push(username);
    getSocketConnectionsMap().set(socket.id, username);

    socket.join('Main Room');

    getNewMessages(20)
      .then(loadedMessages => {
        console.log(loadedMessages);
        socket.emit("freshMessages", loadedMessages);
      })
      .catch(error => { console.log(error) });


    io.emit('roomUsers', {
      users: /*usersInRoom*/ [ ...getSocketConnectionsMap().values() ]
    });
  });

  socket.on("updateUserName", newUserName => {
    usersInRoom.push(newUserName);
    getSocketConnectionsMap().set(socket.id, newUserName);
    io.emit('roomUsers', {
      users: [ ...getSocketConnectionsMap().values() ]
    });
  });

  //maybe have promises onyl ehere not in dbutils
  socket.on("loadFreshMessages", () => {
    getNewMessages(20)
      .then(loadedMessages => {
        console.log(loadedMessages);
        socket.emit("freshMessages", loadedMessages);
      })
      .catch(error => { console.log(error) });
  });

  //Load 20 more messages from before the earliest message from db
  socket.on("loadMoreMessages", numberOfLoadedMessages => {
    getNewMessages(numberOfLoadedMessages + 20)
      .then(loadedMessages => {
        console.log(loadedMessages);
        socket.emit("freshMessages", loadedMessages);
      })
      .catch(error => { console.log(error) });
  });


  //Save new message to db
  socket.on("newMessage", message => {
    username = getSocketConnectionsMap().get(socket.id);
    saveMessage(username, message)
      .then(savedMessage => {
        console.log("A new mewssage was saved: " + savedMessage);
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