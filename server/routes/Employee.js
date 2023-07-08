const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const connection = require("../utils/Connection.js");

router.route("/create").post((req, res) => {
  const body = req.body;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  const currentDateTimeIST = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  const contact = parseInt(body.contact);
  connection.query("SELECT COUNT(*) AS num FROM employee;", (err, result) => {
    if (err) {
        console.log(err);
        res.send(JSON.stringify({'message': 'Unable to register at the moment'}));
    }
    connection.query(
      `INSERT IGNORE INTO employee(id,name,email,password,contact_number,joining_date) VALUES(${result[0].num},'${body.name}','${body.email}','${body.password}',${contact},'${currentDateTimeIST}');`,
      (error) => {
        if (error) {
            console.log(error);
            res.send(JSON.stringify({'message': 'Unable to register at the moment'}));
        } 
        console.log("Employee created");
        res.send(JSON.stringify({'message': 'user created'}))
      }
    );
  });
});

module.exports = router;