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
      status:'active'
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
      const company = await Companies.findOne({ where: { id: emp.company_id } });
      if (!company) {
        res.send(JSON.stringify({ message: "None" }));
      } else {
        const teams = await Teams.findAll({
          where: { company_id: company.id },
        });
        res.send(
          JSON.stringify({
            company: company.name,
            designation: emp.designation,
            joining_date: emp.joining_date,
            salary: emp.salary,
            teams: teams,
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
            status: emp.status,
          })
        );
      } else {
        console.log("helleooo");
        const teams = await Teams.findAll({
          where: { company_id: company.id },
        });
        await console.log(teams);
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
          })
        );
      }
    }
  }
});

router.route("/profilePhoto").post(async (req, res) => {
  // const s3 = new S3Client({
  //   region: process.env.S3_BUCKET_REGION,
  //   credentials:{
  //     secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  //     accessKeyId: process.env.S3_ACCESS_KEY,
  //   }
  // });

  const file = req.file;
  console.log(file);
  // const stream = fs.createReadStream(file.path);

  // const params = {
  //   Bucket: process.env.S3_BUCKET_NAME,
  //   Key: file.name,
  //   Body: stream,
  // };

  // try {
  //   const upload = new PutObjectCommand(params);
  //   const promise = await s3.send(upload);
  //   console.log(promise);
  //   console.log("Uploaded!");
  //   res.send(JSON.stringify({'message':"Uploaded"}))
  // } catch (error) {
  //   console.log(error);
  //   res.send(JSON.stringify({'message':"Error"}))
  // }
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
    console.log(t_code)
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
          emp.salary=t_code.salary
          emp.designation=t_code.designation
          emp.team_id=t_code.team_id
          emp.company_id=t_code.company_id
          emp.designation=t_code.designation
          
          emp.joining_date=getDate()
          await emp.save()
          res.send("ok")
        }
      }
    }
  }
});

module.exports = router;
