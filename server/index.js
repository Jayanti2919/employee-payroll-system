const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const employee_router = require("./routes/Employee.js");
const company_router = require("./routes/Company.js");
const connection = require("./utils/Connection.js");
const cors = require('cors');
const Employee = require('./models/employee.model.js');
const Companies = require('./models/companies.model.js');
const Teams = require('./models/teams.model.js');
const { Sequelize } = require("sequelize");

app.use(bodyParser.json());
app.use(cors());
app.get("/", (req, res) => {
  res.status(200).send(JSON.stringify({ message: "server running" }));
});

app.use("/employee", employee_router);
app.use("/company", company_router);



app.listen(8000, async function() {
  const sequelize = new Sequelize('mysql://root:@localhost:3306/', { logging: false });

  await sequelize.query('CREATE DATABASE IF NOT EXISTS payroll');
  console.log('Database created or successfully connected to an existing database.');
  connection.authenticate().then(()=>{
    console.log('Connected to Payroll DB and listening to port 8000')
  }).catch((error)=>{
    console.log(error)
  })
  await Companies.sync();
  await Employee.sync();
  await Teams.sync();
  console.log("Created all tables");
})