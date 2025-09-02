const express = require("express");
const router = express.Router();
const { getUsers, saveCallLog } = require("../controllers/signalingController");

// Example APIs
router.get("/users", getUsers);
router.post("/call-log", saveCallLog);

module.exports = router;
