const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const employee_router = require("./routes/Employee.js");
const company_router = require("./routes/Company.js");
const connection = require("./utils/Connection.js");
const cors = require("cors");
const Employee = require("./models/employee.model.js");
const Companies = require("./models/companies.model.js");
const teamCode = require("./models/teamCode.model.js");
const Teams = require("./models/teams.model.js");
const { Sequelize } = require("sequelize");
const Attendance = require("./models/attendance.model.js");
const getDate=require("./utils/GetDate.js")

app.use(bodyParser.json());
app.use(cors());
app.get("/", (req, res) => {
  res.status(200).send(JSON.stringify({ message: "server running" }));
});

app.use("/employee", employee_router);
app.use("/company", company_router);

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
  console.log("Created all tables");

  async function callFunction() {
    // This is the function you want to call every 24 hours
    const emp = await Employee.findAll();
    emp.map(async (e) => {
      try {
        const att = await Attendance.create({
          emp_id: e.id,
          company_id: e.company_id,
          date: getDate(),
          attendance: "pending",
        });
        await att.save();
        console.log("created attendance for " + getDate());
      } catch (error) {
        console.log(error);
      }
    });

    // Add your function code here
  }

  function scheduleNextCall() {
    const now = new Date();
    const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours in milliseconds
    callFunction()
    const timeUntilNextCall = nextDay.getTime() - now.getTime();
    setTimeout(() => {
      callFunction();
      scheduleNextCall(); // Schedule the next call after the current one has finished
    }, timeUntilNextCall);
  }

  // Start the initial scheduling
  scheduleNextCall();
});
