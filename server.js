//This is the lowest level networking we are able to do with node.
const net = require("net");
const PORT = 3000;
const HOST_ADDR = "127.0.0.1";
let connectedClients = [];

//Create a new server instance
const server = net.createServer();

//Fired whenever a new connection is made to the server
server.on("connection", (client) => {
  //The client is a duplex stream, which means that it can read and write data.
  server.getConnections((err, count) => {
    const serverMessage = generateServerMessage(
      "Server",
      `Welcome to the chat room! Connected Users : ${count}`,
      null
    );
    client.write(JSON.stringify(serverMessage));
  });

  client.on("data", (data) => {
    console.log("Data : ", data.toString("utf-8"));
    const decodedData = JSON.parse(data.toString("utf-8"));
    parseMessage(decodedData, client);
  });

  client.on("close", () => {
    let userName;
    connectedClients = connectedClients.filter((clientObj) => {
      if (clientObj["client"] == client) userName = clientObj["user"];
      return clientObj["client"] != client;
    });
    parseMessage({ type: "leave", user: userName }, client);
  });
});

//Bind the server and start listening on a particular port and host address
server.listen(PORT, HOST_ADDR, () => {
  console.log("Server is running on port 3000");
  console.log(server.address());
});

function broadCastData(data) {
  const encodedMessage = JSON.stringify(data);
  connectedClients.forEach((clientObj) => {
    if (clientObj["user"] != data.user) {
      const clientSocket = clientObj["client"];
      clientSocket.write(encodedMessage);
    }
  });
}

function parseMessage(data, client) {
  if (data["type"] == "join") {
    connectedClients.push({ user: data["user"], client: client });

    const serverMessage = generateServerMessage(
      "Server",
      `${data["user"]} has joined the chat room!`,
      null
    );

    broadCastData(serverMessage);
  } else if (data["type"] == "msg") {
    const serverMessage = generateServerMessage(
      "User",
      data["msg"],
      data["user"]
    );
    broadCastData(serverMessage);
  } else if (data["type"] == "leave") {
    const serverMessage = generateServerMessage(
      "Server",
      `${data["user"]} has left the chat room!`,
      null
    );
    broadCastData(serverMessage);
  }
}

function generateServerMessage(type, message, user) {
  return { type, message, user };
}
