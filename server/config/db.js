const mysql = require("mysql2/promise");

// Create connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "your_password",
  database: "webrtc_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection()
  .then(() => console.log("✅ MySQL Connected"))
  .catch(err => console.error("❌ MySQL Connection Error:", err));

module.exports = pool;
