const express = require("express");
const router = express.Router();
const getDate = require("../utils/GetDate.js");
const Employee = require("../models/employee.model.js");
const Companies = require("../models/companies.model.js");
const { validateJWT } = require("../utils/Token.js");
const jwt = require("jsonwebtoken");

router.route("/create").post(async (req, res) => {
  const token = req.headers.token;
  const valid = validateJWT(token)
  if(!valid) {
    res.send(JSON.stringify({ message: "Unauthorized access" }));
  } else {
    const body = req.body;
    const email = jwt.decode(token, process.env.JWT_SECRET_KEY).email;
  
    const emp = await Employee.findOne({ where: { email: email } });
    if (emp) {
      if (emp.company_id === null) {
        const currentDate = getDate();
        try {
          const company = await Companies.create({
            name: body.name,
            email: email,
            contact_number: body.contact,
            started_on: currentDate,
            gstno: body.gst,
            status: "active",
          });
          await company.save();
          emp.company_id = company.id;
          emp.designation = 'Owner';
          emp.joining_date = currentDate;
          emp.salary = body.salary;
          await emp.save();
          res.send(JSON.stringify({ message: "Company created" }));
        } catch (error) {
          console.log(error);
          res.send(JSON.stringify({ message: "Error creating company" }));
        }
      } else {
        res.send(
          JSON.stringify({
            message: "Could not create company as you already have a company",
          })
        );
      }
    } else {
      res.send(JSON.stringify({ message: "Employee not found" }));
  }
  }
});


module.exports = router;
