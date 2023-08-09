import SEO from '@components/utils/SEO'
import { NextPage } from 'next'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import GradientWrapper from '../Shared/Gradient/GradientWrapper'

const Contact: NextPage = () => {
  const { t } = useTranslation('common', { keyPrefix: 'components.contact' })

  const [subject, setSubject] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  return (
    <>
      <SEO title="Contact • BCharity VMS" />
      <GradientWrapper>
        <h1
          className="text-lg font-bold text-center pt-14"
          suppressHydrationWarning
        >
          {t('title')}
        </h1>
        <div className="container mx-auto px-40 py-8">
          <form
            className="rounded-lg shadow-l flex flex-col px-8 py-8 
          bg-white dark:bg-black outline outline-1 outline-gray-200 outline-offset-2"
          >
            <h1
              className="text-2xl font-bold dark:text-gray-50 text-center"
              suppressHydrationWarning
            >
              {t('form.title')}
            </h1>
            <h1
              className="text-lg font-medium text-center"
              suppressHydrationWarning
            >
              {t('form.email')}
            </h1>

            <label
              htmlFor="Subject"
              className="text-gray-500 font-light mt-8 dark:text-gray-50"
              suppressHydrationWarning
            >
              {t('form.subject')}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value)
              }}
              name="subject"
              className="bg-transparent border-b py-2 pl-4 focus:outline-none focus:rounded-md focus:ring-1 ring-green-500 font-light text-black dark:text-white"
            />

            <label
              htmlFor="message"
              className="text-gray-500 font-light mt-4 dark:text-gray-50"
              suppressHydrationWarning
            >
              {t('form.message')}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
              }}
              className="bg-transparent border-b py-2 pl-4 focus:outline-none focus:rounded-md focus:ring-1 ring-green-500 font-light text-black dark:text-white"
            />

            <div className="flex flex-row items-center justify-between">
              <a href="../">
                <div
                  className="px-10 mt-8 py-2 bg-[#9969FF] text-gray-50 font-light 
                float-right rounded-md text-lg flex flex-row items-center"
                  suppressHydrationWarning
                >
                  {t('form.cancel')}
                </div>
              </a>

              <a
                href={`mailto:example@gmail.com?subject=${subject}&body=${message}`}
                className="px-10 mt-8 py-2 bg-[#9969FF] text-gray-50
            font-light rounded-md text-lg flex flex-row float-right"
                suppressHydrationWarning
              >
                {t('form.submit')}
              </a>
            </div>
          </form>
        </div>
      </GradientWrapper>
    </>
  )
}

export default Contact
