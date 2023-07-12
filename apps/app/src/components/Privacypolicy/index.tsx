import SEO from '@components/utils/SEO'
import { NextPage } from 'next'
import React from 'react'

const Privacypolicy: NextPage = () => {
  return (
    <>
      <SEO title="Privacy Policy • BCharity VMS" />

      {/* Title + update the date here */}
      <div className="flex flex-col justify-center text-center border-b-8 border-indigo-700 border-dotted py-10 mx-32">
        <div className="my-5 text-3xl font-bold">Privacy Policy</div>
        <div className="flex justify-center m-4 text-1 text-gray-400 font-bold">
          Updated July 12th, 2023
        </div>
      </div>

      {/* The Private Policy is written here: */}
      <div className="flex justify-left items-center border my-10 mx-32">
        <div className="flex my-8 mx-20 flex-col">
          <div className="space-y-10"></div>
          <div className="mb-2 text-base">
            BCharity.xyz. (“BCharity” or “we”) respects and protects the privacy
            of Users (“you” or “users”). BCharity will collect and use your
            Personal Information, generated from your use of BCharity, in
            accordance with this Privacy Policy (“Policy”).
          </div>
          <div className="mb-2 text-3xl font-bold">
            What information do we collect
          </div>
          <div className="mb-2 text-base">
            We get information about you in a range of ways.
          </div>
          <div className="mb-2 text-base">
            Information you give us. Information we collect from you includes:
          </div>
          <ul className="mx-8 mb-5 list-disc">
            <li>Network information regarding transactions;</li>
            <li>Contact information, like username and email;</li>
            <li>
              Feedback and correspondence, such as information you provide in
              your responses to surveys, when you participate in market research
              activities, report a problem with Service, receive customer
              support or otherwise correspond with us;
            </li>
            <li>
              Usage information, such as information about how you interact with
              us, and it is anonymous;
            </li>
          </ul>
          <div className="mb-2 text-3xl font-bold">
            How we use the information we collect
          </div>
          <div className="mb-2 text-base">
            Our primary purpose in collecting information is to to help us
            operate, provide, improve, customize, support, and market our
            Services.
          </div>
          <ul className="mx-8 mb-5 list-disc">
            <li>Provide the Services and customer support you request;</li>
            <li>Resolve disputes and troubleshoot problems;</li>
          </ul>
          <div className="mb-2 text-3xl font-bold">
            How we update our policy
          </div>
          <div className="mb-2 text-base">
            We reserve the right to update this Policy online from time to time,
            and the new policy will immediately replace the older one once
            posted.
          </div>
          <div className="mb-2 text-base">
            We will notify you of material changes to this policy by updating
            the last updated date at the top of this page.
          </div>
          <div className="mb-2 text-base">
            In particular, if you do not accept the revised policies, please
            immediately stop your use of BCharity.
          </div>
          <div className="mb-2 text-base">
            In particular, if you do not accept the revised policies, please
            immediately stop your use of BCharity.
          </div>
          <div className="mb-2 text-base">
            Your continued use of our Services confirms your acceptance of our
            Privacy Policy, as amended. If you do not agree to our Privacy
            Policy, as amended, you must stop using our Services. We recommend
            that you visit this page frequently to check for changes.
          </div>
          <div className="mb-2 text-3xl font-bold">Contact Us</div>
          <div className="mb-2 text-base">
            If you have any questions about our Privacy Policy, please do not
            hesitate to contact us at admin@bcharity.net.
          </div>
        </div>
      </div>
    </>
  )
}

export default Privacypolicy
