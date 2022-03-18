const { response } = require("express");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));

app.get("/room", (req, res) => {
  res.send(
    '<h1>Bảo cutevl</h1><p>bấm vô <a href="http://localhost:1025/room"><b>đây</b></a> để chat...</p>'
  );
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/index.html");
});

io.on("connection", (socket) => {

  console.log("a user connected");
  var fullname = "";
  socket.on('send-name', (response)=>{
    fullname = response;
    socket.nsp.emit("send-chat-message-admin", {
      fullname: 'FROM ADMIN:',
      text: `User ${socket.client.id}||${fullname} connected!!!`
    });
  })

  const sha_last_index_colon = socket.handshake.address.lastIndexOf(":");
  if (sha_last_index_colon > -1) {
    if (socket.handshake.address.lastIndexOf(".") > -1) {
      socket.getIp = {
        ipv4: socket.handshake.address.slice(sha_last_index_colon + 1),
        ipv6: socket.handshake.address.slice(0, sha_last_index_colon),
      };
    } else {
      socket.getIp = {
        ipv6: socket.handshake.address,
      };
    }
  } else {
    socket.getIp = {
      ipv4: socket.handshake.address,
    };
  }

  var info = {
    id: socket.client.id,
    timeSend: Date.now(),
    ipClientV4: socket.getIp.ipv4,
    ipClientV6: socket.getIp.ipv6,
  };

  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.broadcast.emit("send-chat-message-admin", {
      fullname: 'ADMIN:',
      text: `User ${socket.client.id}||${fullname} disconnected!!!`
    });
  });
  socket.on("send-chat-message", (msg) => {
    msg = { ...info, ...msg };
    io.emit("send-chat-message", msg);
    console.log("Sủa:", msg);
  });

});

server.listen(1025, () => {
  console.log("listening on *:1025");
});
