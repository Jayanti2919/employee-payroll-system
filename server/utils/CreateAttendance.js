const Attendance = require("../models/attendance.model.js");
const Employee = require("../models/employee.model.js");


async function callFunction() {
    const emp = await Employee.findAll();
    emp.map(async (e) => {
      try {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        const [att, created] = await Attendance.findOrCreate({
          where: {
            emp_id: e.id,
            date: date,
          },
          defaults: {
            company_id: e.company_id,
            attendance: "pending",
            date: date,
          },
        });

        if (created) {
          await att.save();
          console.log(
            "Attendance created for " + date.toISOString().split("T")[0]
          );
        } else {
          console.log(
            "Attendance already exists for " + date.toISOString().split("T")[0]
          );
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  module.exports = callFunction;