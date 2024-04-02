const net = require("net");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const socket = net.createConnection({ host: "127.0.0.1", port: 3000 }, () => {
  console.log("connected to server!");
  rl.on("line", (input) => {
    socket.write(input);
  });
});

socket.on("data", (data) => {
  console.log("data received: ", data.toString("utf-8"));
});
