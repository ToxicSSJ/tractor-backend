const io = require("socket.io-client");
const client = io.connect("http://localhost:8080");

const literalport = 'COM2'

const SerialPort = require('serialport');
const port = new SerialPort(literalport, 9600);

var opened = false

port.on('open', () => {
  console.log("[PROTEUS] Serial port " + literalport + " opened!");
  opened = true;
});

port.on('data', (data) => {
  console.log("[PROTEUS] Data received % " + data);
});

client.on('speedup', (data) => {
  console.log("Acelerar!");
});

client.emit('setproteus', undefined);
client.emit('speedup', '30');
client.on("test", (msg) => console.info(msg));