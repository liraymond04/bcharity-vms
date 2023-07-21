import { PublicationFragment } from '@lens-protocol/client'
import {
  PublicationsQueryRequest,
  PublicationTypes
} from '@lens-protocol/client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import Slug from '@/components/Shared/Slug'
import { Card } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import getAvatar from '@/lib/getAvatar'
import lensClient from '@/lib/lens-protocol/lensClient'
import { useWalletBalance } from '@/lib/useBalance'
import { useAppPersistStore } from '@/store/app'

const VolunteerHome: React.FC = () => {
  const { isAuthenticated, currentUser, setCurrentUser } = useAppPersistStore()

  const [auth, setAuth] = useState<boolean>(false)
  const [postdata, setpostdata] = useState<PublicationFragment[]>([])
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setAuth(true)
    } else {
      setAuth(false)
    }
  }, [currentUser, isAuthenticated])

  useEffect(() => {
    const param: PublicationsQueryRequest = {
      profileId: currentUser!.id,
      publicationTypes: [PublicationTypes.Post]
    }

    lensClient()
      .publication.fetchAll(param)
      .then((data) => {
        setpostdata(data.items)
      })
  }, [currentUser])

  const [searchAddress, setSearchAddress] = useState<string>('')

  const { isLoading, data } = useWalletBalance(currentUser?.ownedBy ?? '')

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setSearchAddress(currentUser.ownedBy)
    }
  }, [currentUser, isAuthenticated])

  return auth && currentUser ? (
    <GridLayout>
      <GridItemTwelve>
        <Card>
          <div className="p-1">
            {isLoading ? (
              <Spinner />
            ) : (
              <div className="flex flex-row">
                <div className="align-middle  ">
                  <div>
                    <img
                      className=" w-50 h-50 ml-12 mt-10 rounded-full"
                      src={getAvatar(currentUser)}
                      alt="Rounded avatar"
                    />

                    <div className="bottom-0 m-5 ml-20 text-lg truncate text-violet-500">
                      <p>
                        ID:
                        {currentUser.id}
                      </p>
                    </div>
                  </div>

                  <div className="inset-0 flex justify-left items-center ml-20 mt-20">
                    <h1>Followers: </h1>
                    <div className="ml-1">
                      {currentUser.stats.totalFollowers}
                    </div>
                  </div>
                  <div className="relative inset-0 flex justify-left items-center ml-20 mt-10">
                    <h1>Following: </h1>
                    <div className="ml-1">
                      {currentUser.stats.totalFollowing}
                    </div>
                  </div>

                  <div className="ml-12 flex flex-row">
                    <svg
                      className="h-8 w-8 mt-20 mr-3"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    >
                      <path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v21.528l-2.58-2.28-1.452-1.344-1.536-1.428.636 2.22h-13.608c-1.356 0-2.46-1.104-2.46-2.472v-16.224c0-1.368 1.104-2.472 2.46-2.472h16.08zm-4.632 15.672c2.652-.084 3.672-1.824 3.672-1.824 0-3.864-1.728-6.996-1.728-6.996-1.728-1.296-3.372-1.26-3.372-1.26l-.168.192c2.04.624 2.988 1.524 2.988 1.524-1.248-.684-2.472-1.02-3.612-1.152-.864-.096-1.692-.072-2.424.024l-.204.024c-.42.036-1.44.192-2.724.756-.444.204-.708.348-.708.348s.996-.948 3.156-1.572l-.12-.144s-1.644-.036-3.372 1.26c0 0-1.728 3.132-1.728 6.996 0 0 1.008 1.74 3.66 1.824 0 0 .444-.54.804-.996-1.524-.456-2.1-1.416-2.1-1.416l.336.204.048.036.047.027.014.006.047.027c.3.168.6.3.876.408.492.192 1.08.384 1.764.516.9.168 1.956.228 3.108.012.564-.096 1.14-.264 1.74-.516.42-.156.888-.384 1.38-.708 0 0-.6.984-2.172 1.428.36.456.792.972.792.972zm-5.58-5.604c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332.012-.732-.54-1.332-1.224-1.332zm4.38 0c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332 0-.732-.54-1.332-1.224-1.332z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 mt-20 m-3"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 mt-20 m-3"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                    </svg>
                  </div>
                </div>

                <div className="w-full p-10">
                  <div className="justify-left w-full ">
                    <div className=" h-10">
                      <p className=" text-3xl text-white-600 flex items-left mt-10">
                        {currentUser?.handle}
                      </p>
                      <div>
                        <Link href="">
                          <div className="truncate">
                            <Slug
                              className="font-bold"
                              slug={currentUser?.handle}
                              prefix="@"
                            />
                          </div>
                        </Link>
                      </div>
                    </div>

                    <div className="overflow-y-scroll w-full mt-20 ">
                      <div className="w-full">
                        {postdata.map((post) => {
                          if (post.__typename === 'Post')
                            return (
                              <div className=" w-full lg:flex" key={post.id}>
                                <div className="border-r border-b border-l dark:border-black border-gray-400 p-5 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white dark:bg-slate-600 rounded-b lg:rounded-b-none lg:rounded-r  flex flex-col justify-between leading-normal w-full">
                                  <div className="mb-8">
                                    <div className="text-gray-900 dark:text-white font-bold text-xl mb-2">
                                      <div className=" clearfix">
                                        <img
                                          className=" w-8 h-8  mr-3 rounded-full"
                                          src={getAvatar(currentUser)}
                                          alt="Rounded avatar"
                                        />
                                        <div>
                                          {currentUser.handle}
                                          <Link href="">
                                            <div className="text-sm float-right top-0 mb-5">
                                              <p className="text-gray-900 leading-none"></p>
                                              <p className="text-gray-600 dark:text-white">
                                                {post.createdAt}
                                              </p>
                                            </div>
                                            <div className="truncate">
                                              <Slug
                                                className="font-bold"
                                                slug={currentUser?.handle}
                                                prefix="@"
                                              />
                                            </div>
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                    <p className="text-gray-700 text-sm mt-10  dark:text-gray-50">
                                      {post.metadata.content}
                                    </p>
                                  </div>

                                  <div className="flex items-center"></div>
                                </div>
                              </div>
                            )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </GridItemTwelve>
    </GridLayout>
  ) : (
    <div></div>
  )
}

export default VolunteerHome
