const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const connection = require("../utils/Connection.js");
const bcrypt = require('bcrypt');
const getDate = require('../utils/GetDate.js');

router.route('/create').post((req, res) => {
    const email = req.headers.email;
    connection.query(`SELECT company_id FROM employee WHERE email='${email}'`, (error, result)=>{
        if(error) {
            console.log(error)
            res.send(JSON.stringify({'message': 'An error occurred 1'}))
        } else {
            if(!result[0]){
                res.send(JSON.stringify({'message': 'Could not create company as you already have a company'}))
            } else {
                const data = req.body;
                const currentDate = getDate();
                connection.query(`SELECT COUNT(*) AS count FROM companies;`, (err, result) => {
                    if(err) {
                        res.send(JSON.stringify({'message': 'An error occurred 2'}))
                    } else {
                        let url = null
                        if(req.body.logo) {
                            // upload to AWS
                        }
                        connection.query(`INSERT INTO companies(id, name, image, email, contact_number, started_on, gstno, status) VALUES (${result[0].count}, '${data.name}', '${url}', '${email}', ${data.contact}, '${currentDate}', '${data.gst}', 'verified')`, (error, result_2)=>{
                            if(error) {
                                if(error.errno===1062){
                                    res.send(JSON.stringify({message:"Company already exists with this email"}))
                                } else {
                                    console.log(error)
                                    res.send(JSON.stringify({message:"Error creating comapany"}))
                                }
                            } else {
                                connection.query(`UPDATE employee SET company_id=${result[0].count} WHERE email='${email}'`, (error2)=>{
                                    if(error2) {
                                        console.log(error2)
                                        res.send(JSON.stringify({message:"Error creating comapany"}))
                                    } else {
                                        res.send(JSON.stringify({message:"Company created"}));
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }
    })
})


module.exports = router;