import React, {useState, useEffect} from "react";
import {
  Typography,
  Input,
  Button,
  CardFooter,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";

export function Salary() {
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

  return designation === 'Owner' ? (
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
              Salary Management
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input
              type="email"
              label="Employee Email"
              size="lg"
              // onChange={(e) => {
              //   setEmail(e.target.value);
              // }}
              required={true}
            />
            <Input
              type="number"
              step={0.01}
              label="Basic Pay"
              size="lg"
              // onChange={(e) => {
              //   setSelectedMonth(e.target.value);
              // }}
              required={true}
            />
            <Input
              type="number"
              step={0.01}
              label="Basic Pay"
              size="lg"
              // onChange={(e) => {
              //   setSelectedMonth(e.target.value);
              // }}
              required={true}
            />
            <Input
              type="number"
              step={0.01}
              label="Total Allowance"
              size="lg"
              // onChange={(e) => {
              //   setSelectedMonth(e.target.value);
              // }}
              required={true}
            />
            <Input
              type="number"
              step={0.01}
              label="Total Deduction"
              size="lg"
              // onChange={(e) => {
              //   setSelectedMonth(e.target.value);
              // }}
              required={true}
            />
            <Input
              type="file"
              label="Salary Slip"
              size="lg"
              // onChange={(e) => {
              //   setSelectedMonth(e.target.value);
              // }}
            />
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" fullWidth type="submit">
              Record
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  ) : (
    <div>
      Your Salary Details
    </div>
  );
}

export default Salary;
