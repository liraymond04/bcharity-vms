import React from 'react'

interface IErrorProps {
  message: string
}

const Error: React.FC<IErrorProps> = ({ message }) => {
  return (
    <div className="text-red-500 border-2 border-red-500 rounded-md mt-6">
      <p className="my-2 mx-4">{message}</p>
    </div>
  )
}

export default Error
