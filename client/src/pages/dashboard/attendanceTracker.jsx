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
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];
  

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

  return designation === "Owner" ? (
    <div className="mt-10 px-10">
      <div>
        <Typography variant="h2" className="text-blue-gray-600">
          {company}
        </Typography>
      </div>
      <form action="">
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
                setName(e.target.value);
              }}
              required={true}
            />
            <Select label="Month">
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" fullWidth type="submit">
              Check
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  ) : (
    <div>You do not have access to this page</div>
  );
}

export default AttendanceTracker;
