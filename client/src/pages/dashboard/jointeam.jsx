import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  CardFooter,
} from "@material-tailwind/react";
import { useState } from "react";

export function JoinTeam() {
  const [code, setCode] = useState("");

  const handleJoin = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    const response = await fetch("http://localhost:8000/employee/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        code: code,
      }),
    });

    const data = await response.json();

    alert(data.message)
  };
  return (
    <div className="px-10">
      <form action="" onSubmit={handleJoin}>
        <Card className="mt-14 mb-10 items-center">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid w-fit place-items-center py-5 px-10"
          >
            <Typography variant="h3" color="white">
              Join a Company
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input
              type="text"
              label="Invite Code"
              size="lg"
              onChange={(e) => {
                setCode(e.target.value);
              }}
              required={true}
            />
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" fullWidth type="submit">
              Submit
            </Button>
            <Typography variant="small" className="mt-6 flex justify-center">
              Ask your employer for an invite code to join the company
            </Typography>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default JoinTeam;
