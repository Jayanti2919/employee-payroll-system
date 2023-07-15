const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const employee_router = require("./routes/Employee.js");
const company_router = require("./routes/Company.js");
const file_router = require("./routes/Files.js");
const connection = require("./utils/Connection.js");
const cors = require("cors");
const Employee = require("./models/employee.model.js");
const Companies = require("./models/companies.model.js");
const teamCode = require("./models/teamCode.model.js");
const Teams = require("./models/teams.model.js");
const { Sequelize } = require("sequelize");
const Attendance = require("./models/attendance.model.js");
const Salary = require("./models/salary.models.js");
const callFunction = require('./utils/CreateAttendance.js')

app.use(bodyParser.json());
app.use(cors());
app.get("/", (req, res) => {
  res.status(200).send(JSON.stringify({ message: "server running" }));
});

app.use("/employee", employee_router);
app.use("/company", company_router);
app.use("/file", file_router);

app.listen(8000, async function () {
  const sequelize = new Sequelize("mysql://root:@localhost:3306/", {
    logging: false,
  });

  await sequelize.query("CREATE DATABASE IF NOT EXISTS payroll");
  console.log(
    "Database created or successfully connected to an existing database."
  );
  connection
    .authenticate()
    .then(() => {
      console.log("Connected to Payroll DB and listening to port 8000");
    })
    .catch((error) => {
      console.log(error);
    });
  await Companies.sync();
  await Teams.sync();
  await Employee.sync();
  await Attendance.sync();
  await teamCode.sync();
  await Salary.sync();
  console.log("Created all tables");
  

  function scheduleNextCall() {
    const now = new Date();
    const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    callFunction();
    const timeUntilNextCall = nextDay.getTime() - now.getTime();
    setTimeout(() => {
      callFunction();
      scheduleNextCall();
    }, timeUntilNextCall);
  }

  scheduleNextCall();
});
