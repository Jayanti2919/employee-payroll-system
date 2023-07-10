import React from 'react'
import { Card, CardHeader, Button, CardBody, Input, Checkbox, CardFooter, Typography } from '@material-tailwind/react'

export function CreateCompany() {
  return (
    <div className='px-10'>
      <form action="">
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
            <Input type="text" label="Name" size="lg" />
            <Input type="text" label="GST Number" size="lg" />
            <Input type="file" label="Company Logo" size="lg" />
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" fullWidth type="submit" >
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