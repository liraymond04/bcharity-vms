import { HomeIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/UI/Button'

/**
 * Properties of {@link ErrorBody}
 */
export interface IErrorBodyProps {
  /**
   * Error message to be displayed by the component
   */
  message: string
}

/**
 * Component that displays an error message for individual post pages
 *
 * @example Error body used in {@link components.Volunteers.VolunteerPage} for the individual volunteer opportunity page
 * ```tsx
 * const VolunteerPage: NextPage = () => {
 *   ...
 *   const getDisplayed = () => {
 *     if (loading) {
 *       return (
 *         <center className="p-20">
 *           <Spinner />
 *         </center>
 *       )
 *     } else if (
 *       !data ||
 *       wrongPostType ||
 *       // malformedMetadata ||
 *       !opportunity ||
 *       !isPost(data)
 *     ) {
 *       return <ErrorBody message={getErrorMessage()} />
 *     } else {
 *       return <Body opportunity={opportunity} />
 *     }
 *   }
 *
 *   return (
 *     <>
 *       <SEO title="Volunteer Opportunity • BCharity VMS" />
 *       <GridLayout>
 *         <GridItemTwelve>
 *           <Card>{getDisplayed()}</Card>
 *         </GridItemTwelve>
 *       </GridLayout>
 *     </>
 *   )
 * }
 * ```
 */
const ErrorBody: React.FC<IErrorBodyProps> = ({ message }) => {
  const { t } = useTranslation('common', { keyPrefix: 'errors' })

  return (
    <div className="py-10 text-center">
      <h1 className="mb-4 text-3xl font-bold" suppressHydrationWarning>
        {t('something-wrong')}
      </h1>
      <div className="mb-4" suppressHydrationWarning>
        {message}
      </div>
      <Link href="/">
        <Button
          className="flex mx-auto item-center"
          size="lg"
          icon={<HomeIcon className="w-4 h-4" />}
        >
          {t('go-home')}
        </Button>
      </Link>
    </div>
  )
}

export default ErrorBody
