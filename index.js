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
console.log(socket.request.headers['x-forwarded-for'] || socket.request.socket.remoteAddress);
  var info = {
    id: socket.client.id,
    timeSend: Date.now(),
    // ipClient: socket.request?.,
  };

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("send-chat-message", (msg) => {
    msg = {...info, ...msg}
    io.emit('send-chat-message', msg);
    console.log("Sủa:", msg);
  });
  setInterval(()=>{  
    socket.broadcast.emit("phatTinHieu", 'iu iu');
  }, 5000);
});

server.listen(1025, () => {
  console.log("listening on *:1025");
});
