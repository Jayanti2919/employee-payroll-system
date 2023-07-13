import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
  Input,
} from "@material-tailwind/react";
import {
  ClockIcon,
  CheckIcon,
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
} from "@/data";
import { useNavigate } from "react-router-dom";
import {
  BanknotesIcon,
  UserPlusIcon,
  UserIcon,
  ChartBarIcon,
  XCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";

export function Home() {
  const nav = useNavigate();
  const [company, setCompany] = useState("");
  const [salary, setSalary] = useState("");
  const [attendance, setAttendance] = useState("Pending");
  const [date, setDate] = useState("");
  const [designation, setDesignation] = useState("");
  const [addTeam, setAddTeam] = useState(false);
  const [removeTeam, setRemoveTeam] = useState(false);
  const [addMember, setAddMember] = useState(false);
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");

  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [code, setCode] = useState("");
  const [empSalary, setempSalary] = useState(0);

  const handleCopyClick = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(code);
  };

  const handleChange = () => {
    console.log("Changing")
  }

  const handleAddTeam = async (e) => {
    const token = sessionStorage.getItem("token");
    e.preventDefault();
    const response = await fetch("http://localhost:8000/company/addTeam", {
      method: "POST",
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: teamName,
        description: description,
      }),
    });
    const data = await response.json();
    if (data.message === "Created Team") {
      location.reload();
    } else {
      alert(data.message);
    }
  };

  const statisticsCardsData = [
    {
      color: "blue",
      icon: BanknotesIcon,
      title: "Your Salary",
      value: salary,
      footer: {
        label: "",
      },
    },
    {
      color: "pink",
      icon: UserIcon,
      title: "Attendance",
      value: attendance,
      footer: {
        label: new Date().toLocaleDateString(),
      },
    },
    {
      color: "green",
      icon: UserPlusIcon,
      title: "Company",
      value: company,
      footer: {
        label: "Joined on " + date,
      },
    },
    {
      color: "orange",
      icon: ChartBarIcon,
      title: "Role",
      value: designation,
      footer: {
        label: "",
      },
    },
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
        setSalary(data.salary);
        setDate(data.joining_date.substring(0, 10));
        setTeams(data.teams);
      }
    };
    fetchCompanyDetails();
  }, []);

  async function getTeamData(id, name) {
    setSelectedTeam({
      id: id,
      name: name,
    });

    const token = sessionStorage.getItem("token");
    const response = await fetch(
      "http://localhost:8000/company/fetchTeamData",
      {
        method: "GET",
        headers: {
          token: token,
          team: id,
        },
      }
    );
    const data = await response.json();
    if (data.message) {
      nav("/auth/sign-in");
    } else {
      setMembers(data.members);
      console.log(members);
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    const response = await fetch("http://localhost:8000/employee/addEmployee", {
      method: "POST",
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        designation: role,
        salary: empSalary,
        t_id: selectedTeam.id,
      }),
    });

    const data = await response.json();
    alert(data.message);
    if (data.message === "user created") {
      setempSalary(0);
      setEmail("");
      setRole("");
    }
  };

  return company === "" ? (
    <div className="flex min-h-[80vh] min-w-full flex-col items-center justify-center gap-10">
      <Button
        size="lg"
        onClick={(e) => {
          e.preventDefault();
          nav("/dashboard/create-company");
        }}
      >
        Create a Company
      </Button>

      <Typography>OR</Typography>

      <Button size="lg">Join a Company</Button>
    </div>
  ) : (
    <div className="relative mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Teams
              </Typography>
              <div
                className={`${designation === "Owner" ? "block" : "hidden"}`}
              >
                <Typography
                  variant="small"
                  className="flex items-center gap-1 font-normal text-blue-gray-600"
                >
                  <CheckIcon
                    strokeWidth={3}
                    className="h-4 w-4 text-blue-500"
                  />
                  <strong>{teams.length} teams</strong>
                </Typography>
              </div>
            </div>
            <div className={`${designation === "Owner" ? "block" : "hidden"}`}>
              <Menu placement="left-start">
                <MenuHandler>
                  <IconButton size="sm" variant="text" color="blue-gray">
                    <EllipsisVerticalIcon
                      strokeWidth={3}
                      fill="currenColor"
                      className="h-6 w-6"
                    />
                  </IconButton>
                </MenuHandler>
                <MenuList>
                  <MenuItem
                    onClick={(e) => {
                      setAddTeam(true);
                    }}
                  >
                    Add a Team
                  </MenuItem>
                  <MenuItem>Remove a Team</MenuItem>
                </MenuList>
              </Menu>
            </div>
            <div className={`${addTeam ? "block" : "hidden"}`}>
              <Card>
                <XCircleIcon
                  strokeWidth={3}
                  className="h-6 w-6 cursor-pointer text-blue-gray-500"
                  onClick={(e) => {
                    setAddTeam(false);
                  }}
                />
                <form
                  action=""
                  className="flex flex-col gap-2 p-4"
                  onSubmit={handleAddTeam}
                >
                  <Input
                    type="text"
                    required={true}
                    label="Team Name"
                    onChange={(e) => {
                      setTeamName(e.target.value);
                    }}
                  />
                  <Input
                    type="text"
                    required={true}
                    label="Team Description"
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                  <Button type="submit">Add</Button>
                </form>
              </Card>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["team id", "team", "description", "status"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-6 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-medium uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teams.map(({ id, name, description, status }, key) => {
                  const className = `py-3 px-5 ${
                    key === teams.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={id}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            {id}
                          </Typography>
                        </div>
                      </td>
                      <td
                        className={`${className} cursor-pointer`}
                        onClick={() => {
                          getTeamData(id, name);
                        }}
                      >
                        {name}
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          className="text-xs font-medium text-blue-gray-600"
                        >
                          {description}
                        </Typography>
                      </td>
                      <td className={className}>{status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Members of {selectedTeam.name}
            </Typography>
            <div
              className={`${
                designation === "Owner" ? "block" : "hidden"
              } flex cursor-pointer items-center gap-2`}
              onClick={(e) => {
                setAddMember(!addMember);
              }}
            >
              <PlusCircleIcon className="h-4 w-4" />
              <Typography className="text-xs">Add Members</Typography>
            </div>
            <div className={`${addMember ? "block" : "hidden"} mt-5`}>
              <form
                action=""
                className="flex flex-col gap-2"
                onSubmit={handleAddMember}
              >
                <Input
                  label="Email"
                  type="email"
                  required={true}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="Designation"
                  type="text"
                  required={true}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
                <Input
                  label="Salary"
                  type="number"
                  step={0.01}
                  value={empSalary}
                  onClick={(e) => setempSalary(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button type="submit">Add</Button>
                  <Button
                    variant="outlined"
                    onClick={(e) => {
                      e.preventDefault();
                      setAddMember(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
                <Input
                  label="Text"
                  value={code}
                  onChange={handleChange}
                  readOnly // Add the readOnly attribute
                />
              </form>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            {ordersOverviewData.map(
              ({ icon, color, title, description }, key) => (
                <div key={title} className="flex items-start gap-4 py-3">
                  <div
                    className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                      key === ordersOverviewData.length - 1
                        ? "after:h-0"
                        : "after:h-4/6"
                    }`}
                  >
                    {React.createElement(icon, {
                      className: `!w-5 !h-5 ${color}`,
                    })}
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-medium"
                    >
                      {title}
                    </Typography>
                    <Typography
                      as="span"
                      variant="small"
                      className="text-xs font-medium text-blue-gray-500"
                    >
                      {description}
                    </Typography>
                  </div>
                </div>
              )
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;
