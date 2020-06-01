const app = require('express')();
const ArrayList = require('arraylist');
const http = require('http').Server(app);
const io = require('socket.io')(http);

var portOpened = false;

var clients = new ArrayList
var proteus = new ArrayList

io.on('connection', function (socket) {

  console.log('[INFO] Connected!');

  // cuando se desconecta
  socket.on('disconnect', function (data) {
    if (proteus.contains(socket)) {
      proteus.removeElement(socket);
      console.log('[INFO] A proteus client was removed!');
    } else if (clients.contains(socket)) {
      clients.removeElement(socket);
      console.log('[INFO] A client was removed!');
    }
  });

  // define socket as proteus
  socket.on('setproteus', function (data) {

    // registrar cliente tipo proteus
    console.log('[INFO] New proteus client!')
    proteus.add(socket);

    socket.emit('speedup', undefined);

    // acelerar
    socket.on('speedup', function (data) {
      console.log("Acelerar");
    });

    // frenos
    socket.on('brake', function (data) {
      console.log("Acelerar");
    });

    // arado
    socket.on('plow', function (data) {
      console.log("Acelerar");
    });

    // tanque de heno
    socket.on('wheat', function (data) {
      console.log("Trigo: 10")
      socket.emit('wheat', '10')
    });

    // vaciar el tanque
    socket.on('empty', function (data) {
      console.log("Vaciar el Tanque")
    });

    // gasolina
    socket.on('oil', function (data) {
      console.log("Oil")
      socket.emit('oil', '10');
    });

  });

  // define socket as client
  socket.on('setclient', function (data) {
    console.log('[INFO] New client!')
    clients.add(socket);

  });

});

function broadcastClients(key, data) {
  for (socket in clients)
    socket.emit(key, data);
}

function broadcastProteus(key, data) {
  for (socket in proteus)
    socket.emit(key, data);
}

http.listen(8080, function () {
  console.log('listening on *:8080');
});