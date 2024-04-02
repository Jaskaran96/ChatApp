const net = require("net");
const { argv } = require("process");
const readline = require("readline");

const userName = argv[2].split("=")[1];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: `${userName} > `,
});

const socket = net.createConnection({ host: "127.0.0.1", port: 3000 }, () => {
  console.log("Connected to server!");

  const obj = { type: "join", user: userName };
  socket.write(encodedMessage(obj));

  rl.on("line", (input) => {
    const obj = { type: "msg", user: userName, msg: input };
    socket.write(encodedMessage(obj));
    rl.prompt();
  });
});

socket.on("data", (data) => {
  const decodedData = JSON.parse(data.toString("utf-8"));
  let prompt = decodedData.user ? `${decodedData.user} > ` : "Server > ";
  rl.setPrompt(prompt);
  rl.prompt();
  console.log(decodedData.message);
  rl.setPrompt(`${userName} > `);
  rl.prompt();
});

socket.on("end", () => {
  console.log("Disconnected from server!");
  rl.close();
});

function encodedMessage(obj) {
  return JSON.stringify(obj);
}
