const express = require("express");
const router = express.Router();
const getDate = require("../utils/GetDate.js");
const Employee = require("../models/employee.model.js");
const Companies = require("../models/companies.model.js");
const Teams = require("../models/teams.model.js");
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


router.route('/addTeam').post(async (req, res) => {
  const token = req.headers.token;
  // console.log(token)
  const email = jwt.decode(token, process.env.JWT_SECRET_KEY).email;
  console.log(email)
  const emp = await Employee.findOne({where: {email: email}})
  if(!emp) {
    res.send(JSON.stringify({'message': 'Error'}));
  } else {
    try{
      const team = await Teams.create({
        name: req.body.name,
        description: req.body.description,
        company_id: emp.company_id,
        status: 'active',
      })
      await team.save();
      const company = await Companies.findOne({where: {id: emp.company_id}})
      var teams=company.teamids?company.teamids:{}
      const t_id=team.dataValues.id
      teams[t_id] = (team.dataValues.name)
      company.teamids = JSON.stringify(teams)
      await company.save()
      res.send(JSON.stringify({message: "Created Team"}))
    } catch(error) {
      console.log(error)
      res.send(JSON.stringify({message: 'Error'}))
    }
  }
})

module.exports = router;