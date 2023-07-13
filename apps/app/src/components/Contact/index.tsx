import SEO from '@components/utils/SEO'
import { NextPage } from 'next'
import { useState } from 'react'

const Contact: NextPage = () => {
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  return (
    <>
      <SEO title="Contact • BCharity VMS" />
      <h1 className="text-lg font-bold text-center pt-14">
        Contact us if you have any questions, feedback, or issues
      </h1>
      <div className="container mx-auto px-40 py-8">
        <form
          className="rounded-lg shadow-l flex flex-col px-8 py-8 
          bg-white dark:bg-blue-500 outline outline-1 outline-gray-200 outline-offset-2"
        >
          <h1 className="text-2xl font-bold dark:text-gray-50 text-center">
            Contact us
          </h1>
          <h1 className="text-lg font-medium text-center">
            Enter your email address and we will provide a person you can
            contact.
          </h1>

          <label
            htmlFor="Subject"
            className="text-gray-500 font-light mt-8 dark:text-gray-50"
          >
            Subject<span className="text-red-500 dark:text-gray-50">*</span>
          </label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => {
              setFullname(e.target.value)
            }}
            name="fullname"
            className="bg-transparent border-b py-2 pl-4 focus:outline-none focus:rounded-md focus:ring-1 ring-green-500 font-light text-gray-500"
          />

          <label
            htmlFor="email"
            className="text-gray-500 font-light mt-4 dark:text-gray-50"
          >
            E-mail<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            className="bg-transparent border-b py-2 pl-4 focus:outline-none focus:rounded-md focus:ring-1 ring-green-500 font-light text-gray-500"
          />

          <div className="flex flex-row items-center justify-start justify-between">
            <a href="../">
              <div
                className="px-10 mt-8 py-2 bg-[#9969FF] text-gray-50 font-light 
                float-right rounded-md text-lg flex flex-row items-center"
              >
                Cancel
              </div>
            </a>

            <button
              onClick={() =>
                (window.location.href = 'mailto:admin@bcharity.net')
              }
              type="submit"
              className="px-10 mt-8 py-2 bg-[#9969FF] text-gray-50
                font-light rounded-md text-lg flex flex-row float-right"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Contact
