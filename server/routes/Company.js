const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const connection = require("../utils/Connection.js");
const bcrypt = require('bcrypt');
const getDate = require('../utils/GetDate.js');

router.route('/create').post((req, res) => {
    const data = req.body;
    const email = req.header.email;

    if(req.body.logo) {
        // upload to AWS
        const url = 'url'
    }
    const currentDate = getDate();
    connection.query(`SELECT COUNT(*) AS count FROM companies;`, (err, result) => {
        if(err) {
            throw err;
        } else {
            connection.query(`INSERT INTO companies(id, name, image, email, contact_number, started_on, gstno, status) VALUES (${result[0].count}, '${data.name}', '${url}', '${email}', ${data.contact}, '${currentDate}', '${data.gst}', 'verified')`, (error, result_2)=>{
                if(error) {
                    res.send(error)
                } else {
                    res.send(result_2);
                }
            })
        }
    })
})


module.exports = router;