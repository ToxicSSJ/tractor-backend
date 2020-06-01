const config = require("./config/config.json");
const io = require("socket.io-client");
const client = io.connect(config['server']);

const literalport = 'COM2';

const SerialPort = require('serialport');
const port = new SerialPort(literalport, 9600);

var opened = false;

// When serialport is opened
port.on('open', () => {
  console.log("[PROTEUS] Serial port " + literalport + " opened!");
  opened = true;
});

// When data is received
port.on('data', (data) => {

  console.log("[PROTEUS] Data received % " + data);
  let received = data.split("#");

  let key = received[0];
  let value = received[1];

  client.emit(key, value);

});

// When speedup is received
client.on('speedup', (data) => {
  console.log("[SOCKET] Acelerando tractor...");
  port.write('speedup');
});

// When brake is received
client.on('brake', (data) => {
  console.log("[SOCKET] Frenando tractor...");
  port.write('brake');
});

// When plow is received
client.on('plow', (data) => {
  console.log("[SOCKET] Arando terreno...");
  port.write('plow');
});

// When wheat is received
client.on('wheat', (data) => {
  console.log("[SOCKET] Obteniendo datos del trigo...");
  port.write('wheat');
});

// When empty is received
client.on('empty', (data) => {
  console.log("[SOCKET] Vaciendo tanque...");
  port.write('empty');
});

// When oil is received
client.on('oil', (data) => {
  console.log("[SOCKET] Obteniendo datos de la gasolina...");
  port.write('oil');
});

client.emit('setproteus', undefined); // Set this client as proteus
client.on("test", (msg) => console.info(msg));