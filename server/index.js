const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const employee_router = require("./routes/Employee.js");
const company_router = require("./routes/Company.js");
const connection = require("./utils/Connection.js");
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());
app.get("/", (req, res) => {
  res.status(200).send(JSON.stringify({ message: "server running" }));
});

app.use("/employee", employee_router);
app.use("/company", company_router);

app.listen(8000, function () {
  connection.connect(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log(`Server running and MySQL connected at 8000`);
    }
    connection.query(
      "CREATE DATABASE IF NOT EXISTS payroll",
      function (err, result) {
        if (err) throw err;
        console.log("Database created");
      }
    );

    connection.query("USE payroll", (err) => {
      if (err) throw err;
      console.log("using payroll db");
    });

    connection.query(
      "CREATE TABLE IF NOT EXISTS companies ( id BIGINT PRIMARY KEY, name VARCHAR(255), image VARCHAR(255), email VARCHAR(255) UNIQUE, contact_number BIGINT, started_on DATETIME, gstno VARCHAR(50), team_ids JSON, status ENUM('verified', 'not verified'));",
      function (err, result) {
        if (err) throw err;
        console.log("Table created companies");
      }
    );

    connection.query(
      "CREATE TABLE IF NOT EXISTS employee ( id BIGINT PRIMARY KEY, name VARCHAR(255), password VARCHAR(255), image VARCHAR(255), email VARCHAR(255) UNIQUE, contact_number BIGINT, designation VARCHAR(255), salary DOUBLE, joining_date DATETIME, company_id BIGINT, status ENUM('verified', 'not verified'), FOREIGN KEY (company_id) REFERENCES companies(id));",
      function (err, result) {
        if (err) throw err;
        console.log("Table created employee ");
      }
    );

    connection.query(
      "CREATE TABLE IF NOT EXISTS teams ( id BIGINT PRIMARY KEY, name VARCHAR(255), description LONGTEXT,  status ENUM('verified', 'not verified'));",
      function (err, result) {
        if (err) throw err;
        console.log("Table created teams ");
      }
    );
  });
});