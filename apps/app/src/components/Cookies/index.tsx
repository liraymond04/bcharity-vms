import SEO from '@components/utils/SEO'
import { NextPage } from 'next'
import React from 'react'

const Cookies: NextPage = () => {
  return (
    <>
      <SEO title="Cookies • BCharity VMS" />

      <div className="flex flex-col justify-center text-center border-b-8 border-indigo-700 border-dotted py-10 mx-32">
        <div>
          <div className="my-5 text-3xl font-bold">Cookies</div>
          <div>Updated May 18th, 2022</div>
        </div>
      </div>
      <div className="flex justify-left items-center border my-10 mx-20">
        <div className="flex my-8 mx-20 flex-col">
          <div className="space-y-3">
            <div>
              BCharity.xyz. (“BCharity” or “we”) respects and protects the
              privacy of Users (“you” or “users”).
            </div>

            <div>
              BCharity may use cookies to collect and utilize your Personal
              Information, in accordance with this Cookie Policy.
            </div>

            <div className="my-5 text-3xl font-bold">What are cookies?</div>

            <div>
              As is common practice with almost all professional websites this
              site uses cookies, which are tiny files that are downloaded to
              your computer, to improve your experience. This page describes
              what information they gather, how we use it and why we sometimes
              need to store these cookies. We will also share how you can
              prevent these cookies from being stored however this may downgrade
              or 'break' certain elements of the sites functionality.
            </div>

            <div className="my-5 text-3xl font-bold">
              Why do we use cookies?
            </div>

            <div>
              We use cookies for a variety of reasons detailed below.
              Unfortunately in most cases there are no industry standard options
              for disabling cookies without completely disabling the
              functionality and features they add to this site. It is
              recommended that you leave on all cookies if you are not sure
              whether you need them or not in case they are used to provide a
              service that you use.
            </div>

            <div className="my-5 text-3xl font-bold">
              How can I control these cookies?
            </div>

            <div>
              You can prevent the setting of cookies by adjusting the settings
              on your browser (see your browser Help for how to do this). Be
              aware that disabling cookies will affect the functionality of this
              and many other websites that you visit. Disabling cookies will
              usually result in also disabling certain functionality and
              features of the this site. Therefore it is recommended that you do
              not disable cookies.
            </div>

            <div className="my-5 text-3xl font-bold">
              Strictly necessary cookies:
            </div>

            <div className="my-5 text-1xl font-bold">Login related cookies</div>

            <div>
              We use cookies when you are logged in so that we can remember this
              fact. This prevents you from having to log in every single time
              you visit a new page. These cookies are typically removed or
              cleared when you log out to ensure that you can only access
              restricted features and areas when logged in.
            </div>

            <div className="my-5 text-1xl font-bold">
              Site preferences cookies
            </div>

            <div>
              In order to provide you with a great experience on this site we
              provide the functionality to set your preferences for how this
              site runs when you use it. In order to remember your preferences
              we need to set cookies so that this information can be called
              whenever you interact with a page is affected by your preferences.
            </div>
          </div>

          <div className="mt-20 mb-5 text-3xl font-bold">Contact Us</div>

          <div>
            If you have any questions about our Cookie Collection Policy, please
            do not hesitate to contact us at admin@bcharity.net.
          </div>
        </div>
      </div>
    </>
  )
}

export default Cookies
