const io = require("socket.io-client");
const ioClient = io.connect("http://localhost:8080");

ioClient.emit('speedup', '30')
ioClient.on("test", (msg) => console.info(msg));