const User = require("../models/userModel");
const logger = require("../utils/logger");

let users = {}; // username → socket.id
let callLogs = []; // store call history in memory

const handleSocketConnection = (io, socket) => {
  logger.info(`User connected: ${socket.id}`);

  socket.on("register", (username) => {
    users[username] = socket.id;
    User.add(username, socket.id);
    logger.info(`${username} registered`);
  });

  socket.on("call-user", ({ from, to, offer }) => {
    const targetSocket = users[to];
    if (targetSocket) {
      io.to(targetSocket).emit("incoming-call", { from, offer });
    }
  });

  socket.on("answer-call", ({ from, to, answer }) => {
    const targetSocket = users[to];
    if (targetSocket) {
      io.to(targetSocket).emit("call-answered", { from, answer });
    }
  });

  socket.on("call-rejected", ({ from, to }) => {
    const targetSocket = users[to];
    if (targetSocket) {
      io.to(targetSocket).emit("call-rejected", { from });
    }
  });

  socket.on("ice-candidate", ({ from, to, candidate }) => {
    const targetSocket = users[to];
    if (targetSocket) {
      io.to(targetSocket).emit("ice-candidate", { from, candidate });
    }
  });

socket.on("end-call", ({ from, to }) => {
  const targetSocket = users[to];
  if (targetSocket) {
    io.to(targetSocket).emit("end-call", { from });
  }
});

  socket.on("disconnect", () => {
    logger.info(`User disconnected: ${socket.id}`);
    for (let username in users) {
      if (users[username] === socket.id) {
        User.remove(username);
        delete users[username];
      }
    }
  });
};

// REST API controllers
const getUsers = (req, res) => {
  res.json({ onlineUsers: Object.keys(users) });
};

const saveCallLog = (req, res) => {
  const { caller, receiver, status } = req.body;
  callLogs.push({ caller, receiver, status, time: new Date() });
  res.json({ success: true, callLogs });
};

module.exports = { handleSocketConnection, getUsers, saveCallLog };
