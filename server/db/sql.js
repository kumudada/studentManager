const mysql = require("mysql");

const db = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "15612168583",
    database: "student_manage",
});

module.exports = db;
