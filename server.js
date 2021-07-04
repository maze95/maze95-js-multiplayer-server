//Many thanks to https://github.com/juniorxsound/THREE.Multiplayer for the base code, I gotta credit them for the work they did.
'use strict'

//Port and server setup
const port = 3000;
const clientPath = "http://localhost:8080"

//Console the port
console.log('Server is running localhost on port: ' + port );

/////SOCKET.IO///////
const io = require('socket.io')(port, { cors: { origin: [clientPath] } })

let clients = {}

//Socket setup
io.on('connection', client=>{

  console.log('User ' + client.id + ' connected, there are ' + io.engine.clientsCount + ' clients connected');

  //Add a new client indexed by his id
  clients[client.id] = {
    position: [0, 0, 0],
    rotation: [0, 0, 0]
  }

  //Make sure to send the client it's ID
  client.emit('introduction', client.id, io.engine.clientsCount, Object.keys(clients));

  //Update everyone that the number of users has changed
  io.sockets.emit('newUserConnected', io.engine.clientsCount, client.id, Object.keys(clients));

  client.on('move', (pos)=>{

    clients[client.id].position = pos;
    io.sockets.emit('userPositions', clients);

  });

  //Handle the disconnection
  client.on('disconnect', ()=>{

    //Delete this client from the object
    delete clients[client.id];

    io.sockets.emit('userDisconnected', io.engine.clientsCount, client.id, Object.keys(clients));

    console.log('User ' + client.id + ' disconnected, there are ' + io.engine.clientsCount + ' clients connected');

  });

});