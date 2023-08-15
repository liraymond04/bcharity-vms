import SEO from '@components/utils/SEO'
import { NextPage } from 'next'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const TOS: NextPage = () => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.tos'
  })

  return (
    <>
      <SEO title="Terms of Service • BCharity VMS" />
      <div>
        <section className="flex flex-col justify-center text-center border-b-8 border-indigo-700 dark:border-sky-200 border-dotted py-10 mx-32">
          <div
            suppressHydrationWarning
            className="m-4 flex justify-center text-4xl font-bold"
          >
            {t('tos')}
          </div>
          <div
            suppressHydrationWarning
            className="flex justify-center m-4 text-1 text-gray-400 font-bold"
          >
            {t('updated')}
          </div>
        </section>
        <section className="flex justify-left items-center border rounded-lg my-10 mx-20 dark:bg-Card">
          <div className="flex m-8 flex-col space-y-5">
            <div suppressHydrationWarning className="mb-2 text-3xl font-bold">
              {t('table-of-contents')}
            </div>
            <ul className="mx-5 mb-5 list-decimal">
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#Agreement"
                >
                  {t('agreement')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#Services"
                >
                  {t('services')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#IP"
                >
                  {t('property-rights')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#User representations"
                >
                  {t('user-rep')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#User registration"
                >
                  {t('user-reg')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#Prohibited"
                >
                  {t('prohibited')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#User generated"
                >
                  {t('user-contrib')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#Contribution"
                >
                  {t('contrib-license')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#Guidelines"
                >
                  {t('guidelines')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#Social"
                >
                  {t('social-media')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#Third-party"
                >
                  {t('third-party')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#Services management"
                >
                  {t('services-management')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#Privacy"
                >
                  {t('privacy-policy')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#Copyright"
                >
                  {t('copyright')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#Term"
                >
                  {t('termination')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#Modifications"
                >
                  {t('modifications')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#Governing"
                >
                  {t('governing-law')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#Dispute"
                >
                  {t('dispute')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#Corrections"
                >
                  {t('corrections')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#Disclaimer"
                >
                  {t('disclaimer')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#Limitations"
                >
                  {t('liability')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#Indemnification"
                >
                  {t('indemnification')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#User data"
                >
                  {t('user-data')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#Electronic"
                >
                  {t('electronics')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#California"
                >
                  {t('california')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#Miscellaneous"
                >
                  {t('misc')}
                </Link>
              </li>
              <li>
                <Link
                  suppressHydrationWarning
                  className="text-blue-400"
                  href="#Contact"
                >
                  {t('contact')}
                </Link>
              </li>
            </ul>
            <div
              suppressHydrationWarning
              className="-mt-20 mb-5 text-3xl font-bold"
              id="Agreement"
            >
              {t('agreement')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p0')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="Services"
            >
              {t('services')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p1')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="IP"
            >
              {t('property-rights')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p2')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="User representations"
            >
              {t('user-rep')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p3')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="User registration"
            >
              {t('user-reg')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p4')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="Prohibited"
            >
              {t('prohibited')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p5')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="User generated"
            >
              {t('user-contrib')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p6')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="Contribution"
            >
              {t('contrib-license')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p7')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="Guidelines"
            >
              {t('guidelines')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p8')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="Social"
            >
              {t('social-media')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p9')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="Third-party"
            >
              {t('third-party')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p10')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="Services management"
            >
              {t('services-management')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p11')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="Privacy"
            >
              {t('privacy-policy')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p12')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="Copyright"
            >
              {t('copyright')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p13')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="Term"
            >
              {t('termination')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p14')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="Modifications"
            >
              {t('modifications')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p15')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="Governing"
            >
              {t('governing-law')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p16')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="Dispute"
            >
              {t('dispute')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p17')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="Corrections"
            >
              {t('corrections')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p18')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="Disclaimer"
            >
              {t('disclaimer')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p19')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="Limitations"
            >
              {t('liability')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p20')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="Indemnification"
            >
              {t('indemnification')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p21')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="User data"
            >
              {t('user-data')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p22')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="Electronic"
            >
              {t('electronics')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p23')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="California"
            >
              {t('california')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p24')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="Miscellaneous"
            >
              {t('misc')}
            </div>
            <p suppressHydrationWarning className="mb-5">
              {t('p25')}
            </p>
            <div
              suppressHydrationWarning
              className="pt-20 -mt-20 mb-5 text-3xl font-bold"
              id="Contact"
            >
              {t('contact')}
            </div>
            <div className="flex space-x-1">
              <p suppressHydrationWarning className="mb-5">
                {t('p26')}
              </p>
              <Link
                suppressHydrationWarning
                className="text-blue-400"
                href="mailto:admin@bcharity.net"
              >
                admin@bcharity.net
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default TOS
