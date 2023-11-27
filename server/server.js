// const http = require('http');
// const express = require('express');
// const app = express();
// const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server({cors: {
  origin: "http://localhost:3000"
}});

let rooms = [];
let waitingRoom = null;

io.on('connection', (socket) => {
  if(waitingRoom === null) {
    let newRoom = {id: 'testRoom', activePlayers: [socket.id]};
    rooms.push(newRoom);
    socket.join(newRoom.id);
    waitingRoom = newRoom;
  } else {
    socket.join(waitingRoom.id);
    waitingRoom.activePlayers.push(socket.id);
    waitingRoom = null;
  } 

  console.log('a user connected');
  
  socket.on('turn', (msg) => {
    console.log('message: ', msg);
    // extract room
    let room = rooms.find(r => r.activePlayers.includes(socket.id));
    // send "hi" to other players in room.
    let otherPlayers = room.activePlayers.filter(p => p !== socket.id);
    otherPlayers.forEach(p => {
      io.to(p).emit('turn', msg);
    });
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  
});


io.listen(8080);
console.log('WebSocket server started on ws://localhost:8080');