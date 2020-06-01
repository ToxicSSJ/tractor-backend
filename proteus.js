const { StringStream } = require("scramjet");
const Readline = require('@serialport/parser-readline');
const SerialPort = require('serialport');

const config = require("./config/config.json");
const io = require("socket.io-client");
const client = io.connect(config['server']);

const literalport = 'COM2';
const port = new SerialPort(literalport, 9600);
const parser = port.pipe(new Readline({ delimiter: '\n' }))

var opened = false;

// When serialport is opened
port.on('open', () => {
  opened = true;
  console.log("[PROTEUS] Puerto serial " + literalport + " abierto y conectado!");
});

parser.on('data', (data) => {
  let splitted = data.split("#");
  let key = splitted[0];
  let value = splitted[1];
  console.log("[PROTEUS] Enviando instruccion " + key + " al servidor!")
  client.emit(key, value);
})

// When data is received
port.on('data', (data) => console.log("[DATA] Se recibió un tick!"));

port.on('close', () => {
  opened = false;
  console.log("[PROTEUS] Se ha cerrado el puente.")
})

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