import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Switch,
  Tooltip,
  Button,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { useEffect, useState } from "react";

export function Profile() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [teams, setTeams] = useState([]);
  const [contact, setContact] = useState(0);
  const [company, setCompany] = useState("None");
  const [designation, setDesignation] = useState("User");
  const [joining_date, setJoiningDate] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const getProfileData = async () => {
      const response = await fetch(
        "http://localhost:8000/employee/fetchProfile",
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
      } else {
        console.log(data);
        setName(data.name);
        setEmail(data.email);
        setContact(data.contact);
        setJoiningDate(data.joining_date.substring(0, 10))
        if (data.designation) {
          setDesignation(data.designation);
        }
      }
    };
    getProfileData();
  }, []);
  console.log(designation);
  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url(https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-blue-500/50" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src="/img/bruce-mars.jpeg"
                alt="bruce-mars"
                size="xl"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {name}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  {designation}
                </Typography>
              </div>
            </div>
          </div>
          <div className="px-4">
          <ProfileInfoCard
            title="Profile Information"
            description={`Member of the platform since ${joining_date}`}
            details={{
              "Name": name,
              mobile: contact,
              email: email,
              company: company,
            }}
          />
          </div>
          <div className="gird-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3 mt-12">
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Platform Settings
              </Typography>
              <div className="flex flex-col gap-12">
                <div>
                  <Typography className="mb-4 block text-xs font-semibold uppercase text-blue-gray-500">
                    Profile Settings
                  </Typography>
                  <div className="flex flex-col gap-6">
                    <Switch
                      label="Deactivate my Account"
                      labelProps={{
                        className: "text-sm font-normal text-red-400",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default Profile;
