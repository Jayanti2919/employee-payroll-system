import React, { useState } from 'react'
import { Card, CardHeader, Button, CardBody, Input, Checkbox, CardFooter, Typography } from '@material-tailwind/react'

export function CreateCompany() {

  const [name, setName] = useState('')
  const [gst, setGst] = useState('')
  const [contact, setContact] = useState(0)
  const [logo, setLogo] = useState(null)

  const handleCreate = async (e) => {
    e.preventDefault();
    const email = sessionStorage.getItem('email')
    try {
      const response = await fetch('http://localhost:8000/company/create', {
        method: 'POST',
        headers: {
          email: email,
        },
        body: JSON.stringify({
          name: name,
          gst: gst,
          logo: logo,
          contact: contact,
        })
      })
      const data = await response.json()
      alert(data.message);
    } catch(error) {
      console.log(error)
    }
  }


  return (
    <div className='px-10'>
      <form action="" onSubmit={handleCreate}>
      <Card className='mt-14 items-center mb-10'>
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid py-5 w-fit px-10 place-items-center"
          >
            <Typography variant="h3" color="white">
              Create a Company
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input type="text" label="Name" size="lg" onChange={(e)=>{setName(e.target.value)}} required={true} />
            <Input type="text" label="GST Number" size="lg" onChange={(e)=>{setGst(e.target.value)}} required={true} />
            <Input type="number" label="Contact Number" size="lg" onChange={(e)=>{setContact(e.target.value)}} required={true} />
            <Input type="file" label="Company Logo" size="lg" onChange={(e)=>{setLogo(e.target.value)}}/>
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" fullWidth type="submit">
              Create
            </Button>
            <Typography variant="small" className="mt-6 flex justify-center">
              Your email will be the primary email for this company
              </Typography>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

export default CreateCompany;