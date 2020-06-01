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

    socket.emit('speedup', undefined); // test

  });

  // define socket as client
  socket.on('setclient', function (data) {

    clients.add(socket);
    console.log('[INFO] New user client from ' + data + ' device!')

    // acelerar
    socket.on('speedup', function (data) {
      console.log("[ACCION] Llego la instrucción SPEEDUP desde el usuario.")
    });

    // frenos
    socket.on('brake', function (data) {
      console.log("[ACCION] Llego la instruccion BRAKE desde el usuario.");
      broadcastProteus('brake', undefined);
    });

    // arado
    socket.on('plow', function (data) {
      console.log("[ACCION] Llego la instruccion PLOW desde el usuario.");
      broadcastProteus('plow', undefined);
    });

    // tanque de heno
    socket.on('wheat', function (data) {
      console.log("Trigo: 10")
      broadcastProteus('wheat', '10')
    });

    // vaciar el tanque
    socket.on('empty', function (data) {
      console.log("Vaciar el Tanque")
      broadcastProteus('empty', undefined);
    });

    // gasolina
    socket.on('oil', function (data) {
      console.log("Oil")
      broadcastProteus('oil', '10');
    });

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
  console.log('[SERVER] Listening on *:8080!');
});