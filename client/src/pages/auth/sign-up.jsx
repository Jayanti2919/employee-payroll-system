import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";

export function SignUp() {
  const nav = useNavigate();
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [contact, setContact] = useState(0)
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Clicked submit");

    const response = await fetch('http://localhost:8000/user/create', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'name': name,
        'email': email,
        'password': password,
        'contact': contact,
      })
    })

    const data = await response.json();
    if(data.message == 'user created') {
      nav('/sign-in');
    } else {
      alert(data.message);
    }
  }

  return (
    <>
      <img
        src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
        className="absolute inset-0 z-0 h-fit w-full object-cover"
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
      <div className="container mx-auto p-4">
        <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4 mt-28 mb-3">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Sign Up
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input label="Name" size="lg" onChange={(e) => {setName(e.target.value)}}/>
            <Input type="email" label="Email" size="lg" onChange={(e) => {setEmail(e.target.value)}}/>
            <Input type="password" label="Password" size="lg" onChange={(e) => {setPassword(e.target.value)}}/>
            <Input type="number" label="Contact Number" size="lg" onChange={(e) => {setContact(e.target.value)}}/>
            <div className="-ml-2.5">
              <Checkbox label="I agree the Terms and Conditions" />
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" fullWidth type="submit" onClick={handleSubmit}>
              Sign Up
            </Button>
            <Typography variant="small" className="mt-6 flex justify-center">
              Already have an account?
              <Link to="/auth/sign-in">
                <Typography
                  as="span"
                  variant="small"
                  color="blue"
                  className="ml-1 font-bold"
                >
                  Sign in
                </Typography>
              </Link>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default SignUp;
