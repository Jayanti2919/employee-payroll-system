const express = require("express");
const router = express.Router();
const getDate = require("../utils/GetDate.js");
const Employee = require("../models/employee.model.js");
const Companies = require("../models/companies.model.js");

router.route("/create").post(async (req, res) => {
  const email = req.headers.email;
  const body = req.body;

  const emp = await Employee.findOne({ where: { email: email } });
  if (emp.company_id) {
    res.send(
      JSON.stringify({
        message: "Could not create company as you already have a company",
      })
    );
  } else {
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
      res.send(JSON.stringify({ message: "Company created" }));
    } catch (error) {
      console.log(error);
      res.send(JSON.stringify({ message: "Error creating comapany" }));
    }
  }
});

module.exports = router;
