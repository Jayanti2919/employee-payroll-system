const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Employee = require("../models/employee.model.js");
const Companies = require("../models/companies.model.js");
const getDate = require("../utils/GetDate.js");

router.route("/create").post(async (req, res) => {
  const body = req.body;
  const password = await bcrypt.hash(body.password, 10);

  const contact = parseInt(body.contact);
  const currentDateTimeIST = getDate();
  try {
    const emp = await Employee.create({
      name: body.name,
      email: body.email,
      password: password,
      contact_number: contact,
      joining_date: currentDateTimeIST,
    });
    await emp.save();
    res.send(JSON.stringify({ message: "user created" }));
  } catch (error) {
    console.log(error);
    res.send(JSON.stringify({ message: "An error occurred" }));
  }
});

router.route("/authorize").post(async (req, res) => {
  const body = req.body;

  const emp = await Employee.findOne({ where: { email: body.email } });
  if (!emp) {
    res.send(JSON.stringify({ message: "Unable to authenticate" }));
  } else {
    const isCorrectPassword = await bcrypt.compare(body.password, emp.password);
    res.send(JSON.stringify({ message: isCorrectPassword }));
  }
});

router.route("/fetchCompany").get(async (req, res) => {
  const email = req.headers.email;

  const emp = await Employee.findOne({ where: { email: email } });
  if (!emp) {
    res.send(JSON.stringify({ message: "No such user" }));
  } else {
    const company = await Companies.findOne({ where: { email: email } });
    if (!company) {
      res.send(JSON.stringify({ message: "None" }));
    } else {
      res.send(JSON.stringify({ message: company.name }));
    }
  }
});

module.exports = router;
