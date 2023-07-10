const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const connection = require("../utils/Connection.js");
const bcrypt = require('bcrypt')

router.route("/create").post(async (req, res) => {
  const body = req.body;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  const currentDateTimeIST = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  const password = await bcrypt.hash(body.password, 10);

  const contact = parseInt(body.contact);
  connection.query("SELECT COUNT(*) AS num FROM employee;", (err, result) => {
    if (err) {
        console.log(err);
        res.send(JSON.stringify({'message': 'Unable to register at the moment'}));
    }
    connection.query(
      `INSERT IGNORE INTO employee(id,name,email,password,contact_number,joining_date) VALUES(${result[0].num},'${body.name}','${body.email}','${password}',${contact},'${currentDateTimeIST}');`,
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

router.route('/authorize').post( (req, res) => {
    const body = req.body;

    connection.query(`SELECT * FROM employee WHERE email='${body.email}'`, async (err, result) => {
        if(err) {
            console.log(err);
            res.send(JSON.stringify({'message': 'Unable to authenticate'}))
        } 
        const isCorrectPassword = await bcrypt.compare(body.password, result[0].password);
        res.send(JSON.stringify({'message': isCorrectPassword})); 
    })
})

router.route('/fetchCompany').get((req, res) => {
  const email = req.header.email
  try{
    connection.query(`SELECT company_id FROM employee WHERE email = '${email}';`, async (err, result) => {
      if(err) {
        res.send(JSON.stringify({'message': 'None'}))
      } else {
        if(!result[0]){
          res.send(JSON.stringify({'message': 'None'}))
        } else {
          connection.query(`SELECT name FROM companies WHERE id=${result[0].id};`, async(error, result_2) => {
            if(error) {
              res.send(JSON.stringify({'message': 'None'}))
            } else {
              res.send(JSON.stringify({'message': result_2[0].name}))
            }
          })
        }
      }
    })
  } catch(error) {
    console.log(error);
  }
})

module.exports = router;