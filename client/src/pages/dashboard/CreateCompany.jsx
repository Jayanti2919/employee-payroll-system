import React, { useState } from 'react'
import { Card, CardHeader, Button, CardBody, Input, Checkbox, CardFooter, Typography } from '@material-tailwind/react'
import axios from 'axios'
export function CreateCompany() {

  const [name, setName] = useState('')
  const [gst, setGst] = useState('')
  const [contact, setContact] = useState(0)
  const [logo, setLogo] = useState(null)
  const [salary, setSalary] = useState(null)

  const handleCreate = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch('http://localhost:8000/company/create', {
        method: 'POST',
        headers: {
          token: token,
          'Content-Type':'application/json',
        },
        body: JSON.stringify({
          'name': name,
          'gst': gst,
          'logo': logo,
          'contact': contact,
          'salary': salary,
        })
      })
      const data = await response.json()
      if(data.message==='Company created') {
        try{
          const formData = new FormData();
          formData.append('file', logo)
          const response2 = await axios.post(
            "http://localhost:8000/file/upload",
            formData,
          );

          const response3 = await fetch('http://localhost:8000/company/updateCompany', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: token,
            },
            body: {
              url: response2.data.url,
            }
          })

          const data3 = await response3.json()
          if(data3.message==='uploaded') {
            alert('Company Created');
          } else {
            alert('There was an error in uploading the image')
          }
        } catch(error) {
          alert(error)
        }
      }  
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
            <Input type="number" step={0.01} label="Your Salary" size="lg" onChange={(e)=>{setSalary(e.target.value)}}/>
            <Input type="file" label="Company Logo" size="lg" onChange={(e)=>{setLogo(e.target.files[0])}}/>
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