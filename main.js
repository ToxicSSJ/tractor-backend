const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const SerialPort = require('serialport');
const port = new SerialPort("COM2", 9600);

var portOpened = false;

port.on('open', showPortOpen);
port.on('data', readSerialData);

function showPortOpen() {
  console.log("Port opened");
  portOpened = true;
  port.write("TEST")
}

function readSerialData(data) {
  console.log("data received " + data);
}

io.on('connection', function (socket) {

  console.log('[INFO] Connected!');

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

http.listen(8080, function () {
  console.log('listening on *:8080');
});