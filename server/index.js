const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

let users = {}; // username -> socketId

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("register", (username) => {
      users[username] = socket.id;
      console.log(`${username} registered: ${socket.id}`);
      io.emit("userList", Object.keys(users));
  });

  socket.on("call-user", ({ from, to, offer }) => {
    const target = users[to];
    if (target) {
      io.to(target).emit("incoming-call", { from, offer });
    }
  });

  socket.on("answer-call", ({ from, to, answer }) => {
    const target = users[to];
    if (target) {
      io.to(target).emit("call-answered", { from, answer });
    }
  });

  socket.on("call-rejected", ({ from, to }) => {
    const target = users[to];
    if (target) {
      io.to(target).emit("call-rejected", { from });
    }
  });

  socket.on("ice-candidate", ({ from, to, candidate }) => {
    const target = users[to];
    if (target) {
      io.to(target).emit("ice-candidate", { from, candidate });
    }
  });

  socket.on("disconnect", () => {
    for (let name in users) {
      if (users[name] === socket.id) delete users[name];
    }
    console.log("Disconnected:", socket.id);
  });
});

server.listen(5000, () => console.log("Signaling server running on 5000"));
