//This is the lowest level networking we are able to do with node.
const net = require("net");

//The socket is a duplex stream, which means that it can read and write data.
const connectedClients = [];
const server = net.createServer((client) => {
  client.on("data", (data) => {
    console.log("Data :  ", data.toString("utf-8"));
  });
  client.write("Hello from server!");
  connectedClients.push(client);

  //client.pipe("Hello from server!");
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Server is running on port 3000");
  console.log(server.address());
});
