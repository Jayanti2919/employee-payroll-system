import React from 'react'

const ServerDown = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-5'>
        <h1 className='text-3xl font-semibold'>
            500 Server Error
        </h1>
        <p>
            Unfortunately, the server crashed!
        </p>
    </div>
  )
}

export default ServerDown