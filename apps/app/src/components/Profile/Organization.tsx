import {
  HeartIcon,
  LocationMarkerIcon,
  PencilAltIcon,
  UserIcon
} from '@heroicons/react/outline'
import { ProfileFragment, PublicationTypes } from '@lens-protocol/client'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import isVerified from '@/lib/isVerified'
import { getAvatar, getProfile, usePostData } from '@/lib/lens-protocol'
import {
  CauseMetadata,
  getCauseMetadata,
  getOpportunityMetadata,
  OpportunityMetadata,
  PostTags
} from '@/lib/metadata'

import { GridItemTwelve, GridLayout } from '../GridLayout'
import { Card } from '../UI/Card'
import { ErrorMessage } from '../UI/ErrorMessage'
import { Spinner } from '../UI/Spinner'
import SEO from '../utils/SEO'

const Organization: NextPage = () => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.profile.organization'
  })
  const { t: e } = useTranslation('common', {
    keyPrefix: 'errors'
  })
  const [error, setError] = useState<Error>()
  const [profile, setProfile] = useState<ProfileFragment>()

  const {
    query: { username },
    isReady
  } = useRouter()

  const {
    data,
    loading,
    error: postDataError,
    refetch: refetchPostData
  } = usePostData(profile?.id, {
    publicationTypes: [PublicationTypes.Post],
    metadata: {
      tags: {
        oneOf: [PostTags.OrgPublish.Opportunity, PostTags.OrgPublish.Cause]
      }
    }
  })

  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  const opportunityData = useMemo(() => {
    return getOpportunityMetadata(data).sort((o1, o2) => {
      if (!o1.endDate && !o2.endDate) {
        return 0
      } else if (!o1.endDate) {
        return -1
      } else if (!o2.endDate) {
        return 1
      } else if (o2.endDate > o1.endDate) {
        return 1
      } else return -1
    })
  }, [data])

  const causeData = useMemo(() => {
    return getCauseMetadata(data)
  }, [data])

  const tabs = [
    {
      title: `OPPORTUNITIES (${opportunityData.length})`,
      data: opportunityData,
      makeRow: (op: OpportunityMetadata) => {
        const [y, m, d] = op.endDate.split('-')
        const active =
          !op.endDate ||
          new Date().getTime() <
            new Date(parseInt(y), parseInt(m) - 1, parseInt(d)).getTime()
        return (
          <div
            className={`flex items-center border border-gray-500 ${
              active ? 'bg-green-100' : 'bg-gray-100'
            }`}
          >
            <div
              className={`text-xs border border-gray-500 ml-3 w-14 shrink-0 ${
                active ? 'bg-emerald-200' : 'bg-gray-200'
              }`}
            >
              <p className="w-full text-center">
                {active ? 'ongoing' : 'ended'}
              </p>
            </div>

            <p className="ml-3 font-semibold">{op.name}</p>
            <p className="ml-3">{op.startDate}</p>
            <p className="ml-3">{op.endDate ? op.endDate : 'ongoing'}</p>
            <p className="ml-3">LOCATION PLACEHOLDER</p>
            <a
              href={`/volunteer/${op.post_id}`}
              className="ml-auto mr-3 underline"
            >
              View opportuntiy
            </a>
          </div>
        )
      }
    },
    {
      title: `CAUSES (${causeData.length})`,
      data: causeData,
      makeRow: (c: CauseMetadata) => {
        return <p>test</p>
      }
    }
  ]

  console.log(opportunityData, causeData)

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!username) throw Error(e('profile-username-invalid'))
        const result = await getProfile({ handle: username.toString() })
        if (!result) throw Error(e('profile-fetch-fail'))
        if (!isVerified(result.id)) throw Error(e('expected-organization'))
        setProfile(result)
      } catch (e) {
        if (e instanceof Error) {
          setError(e)
        }
      }
    }

    if (isReady && username) {
      fetch()
      refetchPostData()
    }
  }, [username, isReady])

  const getSlug = (key: string) => {
    const item =
      profile?.attributes &&
      profile.attributes.filter((item) => item.key === key).at(0)
    if (item) {
      return item.value
    }
    return ''
  }

  return (
    <>
      <SEO title={`${profile?.handle ?? ''} - Organization • BCharity VMS`} />
      <GridLayout>
        <GridItemTwelve>
          <Card className="bg-purple-100 !rounded-none">
            <div className="p-1 mt-10">
              {error ? (
                <div className="min-h-[calc(100vh-800px)] p-4">
                  <ErrorMessage error={error} />
                </div>
              ) : !profile ? (
                <div className="min-h-[calc(100vh-800px)] p-4">
                  <div className="flex flex-col justify-center space-y-8 items-center">
                    <Spinner />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex">
                    <div className="w-2/5 grow">
                      <div className="flex flex-col space-y-8 items-center mb-12">
                        <img
                          className="w-1/2 rounded-full"
                          src={getAvatar(profile)}
                          alt="Rounded avatar"
                        />
                      </div>

                      <div className="flex justify-center">
                        <div
                          className="py-4 border bg-accent-content dark:darkgradient 
                      border-gray-400 dark:border-black rounded-md font-semibold 
                      text-gray-500 dark:text-white text-sm flex flex-col space-y-2"
                        >
                          <div
                            className="flex items-center mx-4"
                            suppressHydrationWarning
                          >
                            <UserIcon className="h-6 w-6 mb-1 mr-2" />
                            {`${t('followers').toLocaleUpperCase()} ${
                              profile.stats.totalFollowers
                            }`}
                          </div>
                          <div
                            className="flex items-center mx-4"
                            suppressHydrationWarning
                          >
                            <PencilAltIcon className="h-6 w-6 mb-1 mr-2" />
                            {`${t('posts').toLocaleUpperCase()} ${
                              profile.stats.totalPosts
                            }`}
                          </div>
                          <div className="flex items-center mx-4">
                            <HeartIcon className="h-6 w-6 mb-1 mr-2" />
                            <h1 suppressHydrationWarning>{t('raised')}</h1>
                            {/* <div className="ml-1">{8}</div> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-3/5 grow">
                      <div className="ml-4">
                        <div className="flex items-center mb-4">
                          <p className="md:text-4xl text-xl font-bold text-white-600 flex items-left">
                            {profile.name ? profile.name : profile.handle}
                          </p>
                          <p className="border-2 border-gray-300 ml-4 px-2 py-1 text-gray-400 font-semibold">
                            ORG
                          </p>
                        </div>
                        {getSlug('location') !== '' && (
                          <div className="flex space-x-2 items-center text-gray-400">
                            <LocationMarkerIcon className="h-5 w-5" />
                            <span className="text-md">
                              {getSlug('location').toLocaleUpperCase()}
                            </span>
                          </div>
                        )}

                        <div className="flex space-x-3 my-2">
                          {getSlug('discord') !== '' && (
                            <Link
                              href={`https://discord.gg/${getSlug('discord')}`}
                              target="_blank"
                            >
                              <svg
                                className="w-6 transition duration-50 hover:scale-105 hover:cursor-pointer"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              >
                                <path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v21.528l-2.58-2.28-1.452-1.344-1.536-1.428.636 2.22h-13.608c-1.356 0-2.46-1.104-2.46-2.472v-16.224c0-1.368 1.104-2.472 2.46-2.472h16.08zm-4.632 15.672c2.652-.084 3.672-1.824 3.672-1.824 0-3.864-1.728-6.996-1.728-6.996-1.728-1.296-3.372-1.26-3.372-1.26l-.168.192c2.04.624 2.988 1.524 2.988 1.524-1.248-.684-2.472-1.02-3.612-1.152-.864-.096-1.692-.072-2.424.024l-.204.024c-.42.036-1.44.192-2.724.756-.444.204-.708.348-.708.348s.996-.948 3.156-1.572l-.12-.144s-1.644-.036-3.372 1.26c0 0-1.728 3.132-1.728 6.996 0 0 1.008 1.74 3.66 1.824 0 0 .444-.54.804-.996-1.524-.456-2.1-1.416-2.1-1.416l.336.204.048.036.047.027.014.006.047.027c.3.168.6.3.876.408.492.192 1.08.384 1.764.516.9.168 1.956.228 3.108.012.564-.096 1.14-.264 1.74-.516.42-.156.888-.384 1.38-.708 0 0-.6.984-2.172 1.428.36.456.792.972.792.972zm-5.58-5.604c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332.012-.732-.54-1.332-1.224-1.332zm4.38 0c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332 0-.732-.54-1.332-1.224-1.332z" />
                              </svg>
                            </Link>
                          )}
                          {getSlug('twitter') !== '' && (
                            <Link
                              href={`https://twitter.com/${getSlug('twitter')}`}
                              target="_blank"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 transition duration-50 hover:scale-105 hover:cursor-pointer"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                              </svg>
                            </Link>
                          )}
                          {getSlug('linkedin') !== '' && (
                            <Link
                              href={`https://linkedin.com/in/${getSlug(
                                'linkedin'
                              )}`}
                              target="_blank"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 transition duration-50 hover:scale-105 hover:cursor-pointer"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                              </svg>
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="mr-4">
                        <div
                          className="mt-10 mb-4 font-semibold text-xl"
                          suppressHydrationWarning
                        >
                          {t('about')}
                        </div>
                        <div className="bg-accent-content dark:darkgradient w-full min-h-[400px] border border-gray-400 dark:border-black rounded-md mb-8">
                          <div className="w-full text-gray-600 dark:text-white text-xl p-5">
                            {profile.bio}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ml-8">
                    <div className="flex items-center">
                      {tabs.map((v, i) => {
                        return (
                          <p
                            key={i}
                            onClick={() => setSelectedTabIndex(i)}
                            className={`px-3 cursor-pointer border border-zinc-400 ${
                              i === selectedTabIndex
                                ? 'bg-white'
                                : 'bg-brand-200'
                            }`}
                          >
                            {v.title}
                          </p>
                        )
                      })}
                    </div>
                    <div className="flex flex-col items-stretch">
                      {tabs[selectedTabIndex].data.map((v) => {
                        //@ts-ignore
                        return tabs[selectedTabIndex].makeRow(v)
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </GridItemTwelve>
      </GridLayout>
    </>
  )
}

export default Organization
