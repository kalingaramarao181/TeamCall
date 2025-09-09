const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { 
    origin: "*", 
    methods: ["GET", "POST"] 
  },
});

let users = {};

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  // Register a user
  socket.on("register", (username) => {
    if (!username) return; 
    users[username] = socket.id;
    console.log(`${username} registered: ${socket.id}`);
    io.emit("userList", Object.keys(users));
  });

  // Call initiation
  socket.on("call-user", ({ from, to, offer }) => {
    const target = users[to];
    if (target) {
      io.to(target).emit("incoming-call", { from, offer });
    }
  });

  // Answer call
  socket.on("answer-call", ({ from, to, answer }) => {
    const target = users[to];
    if (target) {
      io.to(target).emit("call-answered", { from, answer });
    }
  });

  // Reject call
  socket.on("call-rejected", ({ from, to }) => {
    const target = users[to];
    if (target) {
      io.to(target).emit("call-rejected", { from });
    }
  });

  // Exchange ICE candidates
  socket.on("ice-candidate", ({ from, to, candidate }) => {
    const target = users[to];
    if (target) {
      io.to(target).emit("ice-candidate", { from, candidate });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    for (let name in users) {
      if (users[name] === socket.id) {
        delete users[name];
      }
    }
    io.emit("userList", Object.keys(users)); // notify remaining users
    console.log("Disconnected:", socket.id);
  });
});

// Use dynamic port for production hosting (Heroku, AWS, etc.)
const PORT = process.env.PORT || 4022;
server.listen(PORT, () => console.log(`Signaling server running on ${PORT}`));
