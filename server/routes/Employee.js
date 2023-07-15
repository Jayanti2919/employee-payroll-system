const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Employee = require("../models/employee.model.js");
const Companies = require("../models/companies.model.js");
const teamCode = require("../models/teamCode.model.js");
const getDate = require("../utils/GetDate.js");
const { validateJWT, generateJWT } = require("../utils/Token.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const Teams = require("../models/teams.model.js");
const Attendance = require("../models/attendance.model.js");
const { connection } = require("../utils/Connection.js");

const Sequelize = require("sequelize");
const Salary = require("../models/salary.models.js");
const e = require("express");
const Op = Sequelize.Op;
const fn = Sequelize.fn;

dotenv.config();

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
      status: "active",
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
    if (!isCorrectPassword) {
      res.send(JSON.stringify({ message: "Wrong Password" }));
    } else {
      const token = generateJWT(body.email);
      res.send(JSON.stringify({ token: token }));
    }
  }
});

router.route("/validate").post((req, res) => {
  const token = req.body.token;
  res.send(validateJWT(token));
});

router.route("/fetchCompany").get(async (req, res) => {
  const token = req.headers.token;
  const valid = validateJWT(token);

  if (!valid) {
    res.send(JSON.stringify({ message: "Unauthorized access" }));
  } else {
    const email = jwt.decode(token, process.env.JWT_SECRET_KEY).email;
    const emp = await Employee.findOne({ where: { email: email } });
    if (!emp) {
      res.send(JSON.stringify({ message: "No such user" }));
    } else {
      const company = await Companies.findOne({
        where: { id: emp.company_id },
      });
      if (!company) {
        res.send(JSON.stringify({ message: "None" }));
      } else {
        const teams = await Teams.findAll({
          where: { company_id: company.id },
        });
        const att = await Attendance.findOne({
          order: [["createdAt", "DESC"]],
          where: { emp_id: emp.id },
        });
        res.send(
          JSON.stringify({
            company: company.name,
            designation: emp.designation,
            joining_date: emp.joining_date,
            salary: emp.salary,
            teams: teams,
            attendance: att.attendance,
          })
        );
      }
    }
  }
});

router.route("/fetchProfile").get(async (req, res) => {
  const token = req.headers.token;
  const valid = validateJWT(token);

  if (!valid) {
    res.send(JSON.stringify({ message: "Unauthorized access" }));
  } else {
    const email = jwt.decode(token, process.env.JWT_SECRET_KEY).email;
    const emp = await Employee.findOne({ where: { email: email } });
    if (!emp) {
      res.send(JSON.stringify({ message: "No such user" }));
    } else {
      const company = await Companies.findOne({
        where: { id: emp.company_id },
      });
      if (!company) {
        res.send(
          JSON.stringify({
            name: emp.name,
            salary: emp.salary,
            email: emp.email,
            contact: emp.contact_number,
            joining_date: emp.joining_date,
            image: emp.image,
            status: emp.status,
          })
          );
        } else {
          const teams = await Teams.findAll({
            where: { company_id: company.id },
          });
          res.send(
            JSON.stringify({
              name: emp.name,
              salary: emp.salary,
              email: emp.email,
              contact: emp.contact_number,
              joining_date: emp.joining_date,
              company_name: company.name,
              designation: emp.designation,
              salary: emp.salary,
              status: emp.status,
              image: emp.image,
          })
        );
      }
    }
  }
});

router.route("/profilePhoto").post(async (req, res) => {
  const email = jwt.decode(req.headers.token, process.env.JWT_SECRET_KEY).email
  const emp = await Employee.findOne({where: {email: email}})
  if(!emp) {
    res.send(JSON.stringify({message: 'Error Occurred'}))
  } else {
    try{
      emp.image = req.body.url;
      await emp.save();
      res.send(JSON.stringify({message: "Uploaded successfully"}))
    } catch(error) {
      res.send(JSON.stringify({message: "Error Occured"}))
    }
  }
});

router.route("/addEmployee").post(async (req, res) => {
  const token = req.headers.token;
  const valid = validateJWT(token);

  if (!valid) {
    res.send(JSON.stringify({ message: "Unauthorized access" }));
  } else {
    console.log(req.body);
    const e_email = req.body.email;
    const designation = req.body.designation;
    const salary = req.body.salary;
    const team_id = req.body.t_id;
    const team = await Teams.findByPk(team_id);
    const c_id = team.company_id;
    const now = new Date();
    const payload = {
      team_id: team_id,
      company_id: c_id,
      email: e_email,
      designation: designation,
      salary: salary,
      exp: now.getTime() + 30 * 24 * 60 * 60 * 1000, // expires in 30 days
    };
    const code = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      algorithm: "HS256",
    });
    try {
      const t = await teamCode.create({
        team_id: team_id,
        company_id: c_id,
        email: e_email,
        code: code,
        designation: designation,
        salary: salary,
      });
      await t.save();
      res.send(JSON.stringify({ message: "user created", code: code }));
    } catch (e) {
      res.send(e);
    }
  }
});

router.route("/join").post(async (req, res) => {
  const token = req.headers.token;
  const valid = validateJWT(token);

  if (!valid) {
    res.send(JSON.stringify({ message: "Unauthorized access" }));
  } else {
    const code = req.body.code;
    const t_code = await teamCode.findOne({ where: { code: code } });
    console.log(t_code);
    if (!t_code) {
      res.send(JSON.stringify({ message: "Invalid Code1" }));
    } else {
      if (!validateJWT(code))
        res.send(JSON.stringify({ message: "Invalid Code" }));
      else {
        const data = jwt.decode(code, process.env.JWT_SECRET_KEY);
        if (
          data.email === jwt.decode(token, process.env.JWT_SECRET_KEY).email
        ) {
          const emp = await Employee.findOne({ where: { email: data.email } });
          emp.salary = t_code.salary;
          emp.designation = t_code.designation;
          emp.team_id = t_code.team_id;
          emp.company_id = t_code.company_id;
          emp.designation = t_code.designation;

          emp.joining_date = getDate();
          await emp.save();
          res.send("ok");
        }
      }
    }
  }
});

router.route("/attendance").get(async (req, res) => {
  const token = req.headers.token;
  const valid = validateJWT(token);

  if (!valid) {
    res.send(JSON.stringify({ message: "Unauthorized access" }));
  } else {
    const email = jwt.decode(token, process.env.JWT_SECRET_KEY).email;
    try {
      const emp = await Employee.findOne({ where: { email: email } });
      const att = await Attendance.findOne({
        where: { emp_id: emp.id },
        order: [["createdAt", "DESC"]],
      });
      att.attendance = "Present";
      att.save();
      res.send(JSON.stringify({ message: "attendance updated" }));
    } catch (error) {
      console.log(error);
      res.send(JSON.stringify({ message: "An error occurred" }));
    }
  }
});

router.route("/getAttendance").get(async (req, res) => {
  const token = req.headers.token;
  const valid = validateJWT(token);

  if (!valid) {
    res.send(JSON.stringify({ message: "Unauthorized access" }));
  } else {
    const owner = await Employee.findOne({
      where: { email: jwt.decode(token, process.env.JWT_SECRET_KEY).email },
    });
    if (!owner) {
      res.send(JSON.stringify({ message: "Unauthorized access" }));
    } else if (owner.designation != "Owner") {
      res.send(JSON.stringify({ message: "Unauthorized access" }));
    } else {
      const emp = await Employee.findOne({
        where: { email: req.headers.email },
      });
      if (!emp) {
        res.send(JSON.stringify({ message: "Employee not found" }));
      } else if (emp.company_id != owner.company_id) {
        res.send(JSON.stringify({ message: "Employee not found" }));
      } else {
        try {
          const emp_present = await Attendance.findAll({
            attributes: [
              [
                Sequelize.fn(
                  "DATE_FORMAT",
                  Sequelize.col("createdAt"),
                  "%Y-%m"
                ),
                "month",
              ],
              [Sequelize.fn("COUNT", Sequelize.col("emp_id")), "Count"],
            ],
            group: [
              Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m"),
            ],
            where: {
              emp_id: emp.id,
              attendance: "Present",
              createdAt: {
                [Sequelize.Op.and]: [
                  Sequelize.where(
                    Sequelize.fn("MONTH", Sequelize.col("createdAt")),
                    req.headers.month
                  ),
                ],
              },
            },
          });
          const emp_absent = await Attendance.findAll({
            attributes: [
              [
                Sequelize.fn(
                  "DATE_FORMAT",
                  Sequelize.col("createdAt"),
                  "%Y-%m"
                ),
                "month",
              ],
              [Sequelize.fn("COUNT", Sequelize.col("emp_id")), "Count"],
            ],
            group: [
              Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m"),
            ],
            where: {
              emp_id: emp.id,
              attendance: "Pending",
              createdAt: {
                [Sequelize.Op.and]: [
                  Sequelize.where(
                    Sequelize.fn("MONTH", Sequelize.col("createdAt")),
                    req.headers.month
                  ),
                ],
              },
            },
          });
          const absent = emp_absent[0];
          const present = emp_present[0];
          res.send(
            JSON.stringify({
              present: JSON.stringify(present),
              pending: JSON.stringify(absent),
              joining: emp.joining_date,
            })
          );
        } catch (error) {
          console.log(error);
          res.send(JSON.stringify({ message: "Error Occurred" }));
        }
      }
    }
  }
});

router.route("/getSelfAttendance").get(async (req, res) => {
  const token = req.headers.token;
  const valid = validateJWT(token);

  if (!valid) {
    res.send(JSON.stringify({ message: "Unauthorized access 1" }));
  } else {
    const email = jwt.decode(token, process.env.JWT_SECRET_KEY).email;
    const owner = await Employee.findOne({
      where: { email: email },
    });
    if (!owner) {
      res.send(JSON.stringify({ message: "Unauthorized access 2" }));
    } else {
      try {
        const emp_present = await Attendance.findAll({
          attributes: [
            [
              Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m"),
              "month",
            ],
            [Sequelize.fn("COUNT", Sequelize.col("emp_id")), "Count"],
          ],
          group: [
            Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m"),
          ],
          where: {
            emp_id: owner.id,
            attendance: "Present",
            createdAt: {
              [Sequelize.Op.and]: [
                Sequelize.where(
                  Sequelize.fn("MONTH", Sequelize.col("createdAt")),
                  req.headers.month
                ),
              ],
            },
          },
        });
        const emp_absent = await Attendance.findAll({
          attributes: [
            [
              Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m"),
              "month",
            ],
            [Sequelize.fn("COUNT", Sequelize.col("emp_id")), "Count"],
          ],
          group: [
            Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m"),
          ],
          where: {
            emp_id: owner.id,
            attendance: "Pending",
            createdAt: {
              [Sequelize.Op.and]: [
                Sequelize.where(
                  Sequelize.fn("MONTH", Sequelize.col("createdAt")),
                  req.headers.month
                ),
              ],
            },
          },
        });
        const absent = emp_absent[0];
        const present = emp_present[0];
        res.send(
          JSON.stringify({
            present: JSON.stringify(present),
            pending: JSON.stringify(absent),
            joining: owner.joining_date,
          })
        );
      } catch (error) {
        console.log(error);
        res.send(JSON.stringify({ message: "Error Occurred" }));
      }
    }
  }
});

router.route("/giveSalary").post(async (req, res) => {
  const token = req.headers.token;
  const valid = validateJWT(token);

  if (!valid) {
    res.send(JSON.stringify({ message: "Unauthorized access 1" }));
  } else {
    const owner_email = jwt.decode(token, process.env.JWT_SECRET_KEY).email;
    const owner = await Employee.findOne({ where: { email: owner_email } });
    const emp = await Employee.findOne({ where: { email: req.body.email } });
    if (owner.company_id == emp.company_id) {
      try {
        const salary = await Salary.create({
          emp_id: emp.id,
          company_id: emp.company_id,
          basic_pay: req.body.basic_pay,
          total_allowance: req.body.total_allowance,
          total_deduction: req.body.total_deduction,
          gross_salary: req.body.basic_pay + req.body.total_allowance,
          net_pay:
            req.body.basic_pay +
            req.body.total_allowance -
            req.body.total_deductions,
        });
        salary.save();
        res.send("Salary Updated");
      } catch (e) {
        console.log(e);
        res.send("Error Occured");
      }
    } else res.send("cannot send Salary");
  }
});

router.route("/getSelfSalary").get(async (req, res) => {
  const token = req.headers.token;
  const valid = validateJWT(token);

  if (!valid) {
    res.send(JSON.stringify({ message: "Unauthorized access 1" }));
  } else {
    const email = jwt.decode(token, process.env.JWT_SECRET_KEY).email;
    const emp = await Employee.findOne({ where: { email: email } });
    if (!emp.company_id) {
      res.send("Employee not in company");
    } else {
      try{
        const salary=await Salary.findAll({where:{emp_id:emp.id}})
        res.send(salary)
      }catch(e){
        res.send("An error Occured")
      }
      
    }
  }
});

module.exports = router;