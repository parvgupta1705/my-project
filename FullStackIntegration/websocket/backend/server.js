// backend/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("Socket.io Chat Server is running");
});

io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

const PORT = 5001;
server.listen(PORT, () => console.log(`✅ WebSocket Server running on port ${PORT}`));
