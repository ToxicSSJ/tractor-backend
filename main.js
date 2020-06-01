const ArrayList = require('arraylist');

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var portOpened = false;

var clients = new ArrayList
var proteus = new ArrayList

io.on('connection', (socket) => {

  console.log('[INFO] Connected!');

  // cuando se desconecta
  socket.on('disconnect', function (data) {
    if (proteus.contains(socket)) {
      proteus.removeElement(socket);
      console.log('[INFO] A proteus client was removed!');
    } else if (clients.contains(socket)) {
      clients.removeElement(socket);
      console.log('[INFO] A user client was removed!');
    }
  });

  // define socket as proteus
  socket.on('setproteus', function (data) {

    if (proteus.contains(socket)) {
      return;
    }

    // registrar cliente tipo proteus
    console.log('[INFO] New proteus client!')
    proteus.add(socket);

    socket.on('wheat', (data) => {
      broadcastClients('wheat', data)
    })

    socket.on('oil', (data) => {
      broadcastClients('oil', data);
    })

    socket.on('status', (data) => {
      console.log("[PROTEUS] Llegó información desde proteus, retransmitiendo a los usuarios...");
      broadcastClients('status', data);
    })

  });

  // define socket as client
  socket.on('setclient', (data) => {

    if (clients.contains(socket)) {
      return;
    }

    clients.add(socket);
    console.log('[INFO] New user client from ' + data + ' device!')

    // acelerar
    socket.on('speedup', (data) => {
      console.log("[ACCION] Llego la instrucción SPEEDUP desde el usuario.")
      broadcastClients('status', '[SERVER] Acelerando tractor...');
    });

    // frenos
    socket.on('brake', (data) => {
      console.log("[ACCION] Llego la instruccion BRAKE desde el usuario.");
      broadcastProteus('brake', undefined);
      broadcastClients('status', '[SERVER] Frenando tractor...');
    });

    // arado
    socket.on('plow', (data) => {
      console.log("[ACCION] Llego la instruccion PLOW desde el usuario.");
      broadcastProteus('plow', undefined);
      broadcastClients('status', '[SERVER] Cambiando de estado al arador...');
    });

    // tanque de heno
    socket.on('wheat', (data) => {
      console.log("[ACCION] Llego la instrucción WHEAT desde el usuario.")
      broadcastProteus('wheat', undefined)
      broadcastClients('status', '[SERVER] Obteniendo trigo actual del tractor...');
    });

    // vaciar el tanque
    socket.on('empty', (data) => {
      console.log("[ACCION] Llego la instrucción EMPTY desde el usuario.")
      broadcastProteus('empty', undefined);
      broadcastClients('status', '[SERVER] Vaciendo tanque del tractor...');
    });

    // gasolina
    socket.on('oil', (data) => {
      console.log("[ACCION] Llego la instrucción OIL desde el usuario.")
      broadcastProteus('oil', undefined);
      broadcastClients('status', '[SERVER] Obteniendo gasolina actual del tractor...');
    });

  });

});

function broadcastClients(key, data) {
  for (let socket of clients)
    socket.emit(key, data);
}

function broadcastProteus(key, data) {
  for (let socket of proteus)
    socket.emit(key, data);
}

http.listen(9000, function () {
  console.log('[SERVER] Listening on *:9000!');
});