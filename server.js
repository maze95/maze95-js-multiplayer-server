//Credits to https://github.com/juniorxsound/THREE.Multiplayer for the base code, I gotta credit them for the work they did.
'use strict'

//Port and server setup
const port = 3000
const clientPath = "http://localhost:8080"

//Console the port
console.log('Server is running locally on port: ' + port )

const io = require('socket.io')(port, { cors: { origin: [clientPath] } })
const twoPlayerLimit = false
let clients = {}

io.on('connection', client=>{
  console.log('User ' + client.id + ' connected, there are ' + io.engine.clientsCount + ' clients connected')
  if(io.engine.clientsCount == 3 && twoPlayerLimit) {
    //client.disconnect()
    client.emit('selfDisconnect', client.id)
}

  //Add a new client indexed by their id
  clients[client.id] = {
    position: [0, -7, -23],
    rotation: [0, 0, 0]
  }

  //Make sure to send the client their ID
  client.emit('introduction', client.id, io.engine.clientsCount, Object.keys(clients))

  //Update everyone that the number of users has changed
  io.sockets.emit('newUserConnected', io.engine.clientsCount, client.id, Object.keys(clients))

  client.on('move', (pack)=>{

    clients[client.id].position = pack.pos
    clients[client.id].rotation = pack.rot
    io.sockets.emit('userPositions', clients)

  })

  //Handle the disconnection
  client.on('disconnect', ()=>{

    //Delete this client from the object
    delete clients[client.id]

    io.sockets.emit('userDisconnected', io.engine.clientsCount, client.id, Object.keys(clients))

    console.log('User ' + client.id + ' disconnected, there are ' + io.engine.clientsCount + ' clients connected')

  })

})