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

  const [salaryDetails, setSalaryDetails] = useState({
    email: '',
    basic_pay: 0,
    total_allowance: 0,
    total_deduction: 0,
    salary_slip: null,
  })

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalaryDetails({ ...salaryDetails, [name]: value });
  };

  const handleFileChange = (e) => {
    setSalaryDetails({ ...salaryDetails, salary_slip: e.target.files[0] });
  };

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
              name="email"
              value={salaryDetails.email}
              onChange={(e) => {
                handleChange
              }}
              required={true}
            />
            <Input
              type="number"
              step={0.01}
              label="Basic Pay"
              size="lg"
              name="basic_pay"
              value={salaryDetails.basic_pay}
              onChange={(e) => {
                handleChange
              }}
              required={true}
            />
            <Input
              type="number"
              step={0.01}
              label="Total Allowance"
              size="lg"
              name="total_allowance"
              value={salaryDetails.total_allowance}
              onChange={(e) => {
                handleChange
              }}
              required={true}
            />
            <Input
              type="number"
              step={0.01}
              label="Total Deduction"
              size="lg"
              name="total_deduction"
              value={salaryDetails.total_deduction}
              onChange={(e) => {
                handleChange
              }}
              required={true}
            />
            <Input
              type="file"
              label="Salary Slip"
              size="lg"
              name="email"
              value={salaryDetails.salary_slip}
              onChange={(e) => {
                handleFileChange
              }}
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
