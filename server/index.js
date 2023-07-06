const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = require("./routes/Employee.js");
const connection = require("./utils/Connection.js");
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).send(JSON.stringify({ message: "server running" }));
});

app.use("/employee", router);

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
      "CREATE TABLE IF NOT EXISTS companies ( id BIGINT PRIMARY KEY, name VARCHAR(255), image VARCHAR(255), email VARCHAR(255), contact_number INT, started_on DATETIME, gstno VARCHAR(50), team_ids JSON, status ENUM('verified', 'not verified'));",
      function (err, result) {
        if (err) throw err;
        console.log("Table created companies");
      }
    );

    connection.query(
      "CREATE TABLE IF NOT EXISTS employee ( id BIGINT PRIMARY KEY, name VARCHAR(255), image VARCHAR(255), email VARCHAR(255), contact_number INT, designation VARCHAR(255), salary DOUBLE, joining_date DATETIME, company_id BIGINT, status ENUM('verified', 'not verified'), FOREIGN KEY (company_id) REFERENCES companies(id));",
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
