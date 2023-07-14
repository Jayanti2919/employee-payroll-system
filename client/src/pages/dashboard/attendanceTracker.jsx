import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Button,
  CardBody,
  Input,
  CardFooter,
  Typography,
  Select,
  Menu,
  MenuItem,
} from "@material-tailwind/react";

export function AttendanceTracker() {
  const [designation, setDesignation] = useState("");
  const [company, setCompany] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const fetchCompanyDetails = async () => {
      if (!token) {
        nav("/auth/sign-in");
      }
      const response = await fetch(
        "http://localhost:8000/employee/fetchCompany",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );
      const data = await response.json();
      if (data.message === "Unauthorized access") {
        nav("/auth/sign-in");
      } else if (data.message === "None") {
        setCompany("");
      } else {
        setCompany(data.company);
        setDesignation(data.designation);
      }
    };
    fetchCompanyDetails();
  }, []);

  const [email, setEmail] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [attendance, setAttendance] = useState({
    present: "0",
    pending: "0",
  });

  const handleAttendanceFetch = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    const response = await fetch(
      "http://localhost:8000/employee/getAttendance",
      {
        method: "GET",
        headers: {
          token: token,
          email: email,
          month: selectedMonth,
        },
      }
    );
    const data = await response.json();
    console.log(data);
    if (!data.present) {
      setAttendance({ pending: data.pending.split(":")[2].slice(0, -1), present:"0" });
    } else if (!data.pending) {
      setAttendance({ present: data.present.split(":")[2].slice(0, -1), pending:"0" });
    } else {
      setAttendance({
        present: data.present.split(":")[2].slice(0, -1),
        pending: data.pending.split(":")[2].slice(0, -1),
      });
    }
  };

  return designation === "Owner" ? (
    <div className="mt-10 px-10">
      <div>
        <Typography variant="h2" className="text-blue-gray-600">
          {company}
        </Typography>
      </div>
      <form action="" onSubmit={handleAttendanceFetch}>
        <Card className="mt-14 mb-10 items-center">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid w-fit place-items-center py-5 px-10"
          >
            <Typography variant="h5" color="white">
              Track Employee Attendance
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input
              type="email"
              label="Email of Employee"
              size="lg"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required={true}
            />
            <Input
              type="number"
              label="Month"
              size="lg"
              onChange={(e) => {
                setSelectedMonth(e.target.value);
              }}
              required={true}
              max={12}
              min={1}
            />
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" fullWidth type="submit">
              Check
            </Button>
            <div className="flex gap-10 mt-5 ">
              <Typography className="font-bold">Present: {attendance.present}</Typography>
              <Typography className="font-bold">Pending: {attendance.pending}</Typography>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  ) : (
    <div>You do not have access to this page</div>
  );
}

export default AttendanceTracker;
