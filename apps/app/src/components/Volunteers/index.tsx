import { GridItemFour, GridLayout } from '@components/GridLayout'
import Search from '@components/Shared/Search'
import { Card } from '@components/UI/Card'
import SEO from '@components/utils/SEO'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import { PublicationSortCriteria } from '@lens-protocol/client'
import { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { STATIC_ASSETS } from '@/constants'
import getOpportunityMetadata from '@/lib/lens-protocol/getOpportunityMetadata'
import useExplorePublications from '@/lib/lens-protocol/useExplorePublications'
import { OpportunityMetadata, PostTags } from '@/lib/types'

import { Spinner } from '../UI/Spinner'

const Volunteers: NextPage = () => {
  const [posts, setPosts] = useState<OpportunityMetadata[]>([])
  const [categories, setCategories] = useState<Set<string>>(new Set())

  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const { data, error, loading } = useExplorePublications({
    sortCriteria: PublicationSortCriteria.Latest,
    metadata: {
      tags: {
        oneOf: [PostTags.OrgPublishOpp]
      }
    }
  })

  useEffect(() => {
    let _posts: OpportunityMetadata[] = []
    let _categories: Set<string> = new Set()
    const metadata = getOpportunityMetadata(data)
    metadata.forEach((post) => {
      _posts.push(post)
      if (post.category) _categories.add(post.category)
    })
    setPosts(metadata)
    setCategories(_categories)
  }, [data])

  return (
    <>
      <SEO title="Volunteers • BCharity VMS" />
      <div className="mx-auto max-w-screen-xl px-0 sm:px-5 font-bold text-2xl">
        <div className="flex justify-between my-5">
          <Search />
          <div className="flex items-center">
            <div className="text-md mr-3">Filter:</div>
            <select
              className="w-30 h-10 bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
              onChange={(e) => {
                setSelectedCategory(e.target.value)
              }}
            >
              <option key="_none" value="">
                None
              </option>
              {Array.from(categories).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        Browse volunteer opportunities
      </div>
      {loading ? (
        <div className="flex justify-center m-5">
          <Spinner />
        </div>
      ) : (
        <GridLayout>
          {posts
            .filter(
              (post) =>
                selectedCategory === '' || post.category === selectedCategory
            )
            .map((post) => (
              <GridItemFour key={post?.opportunity_id}>
                <Card>
                  <div className="flex">
                    <div
                      className="flex-shrink-0 h-36 w-36 rounded-l-xl border-b dark:border-b-gray-700/80"
                      style={{
                        backgroundImage: `url(${`${STATIC_ASSETS}/patterns/2.svg`})`,
                        backgroundColor: '#8b5cf6',
                        backgroundSize: '80%',
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'repeat'
                      }}
                    />
                    <div className="relative mx-5 mt-3 mb-1">
                      <div className="font-bold text-2xl">{post?.name}</div>
                      <div className="flex justify-between mb-1">
                        <div className="text-sm">{post?.from.handle}</div>
                        <div className="text-sm">{post?.date}</div>
                      </div>
                      <div className="line-clamp-2 text-sm">
                        {post?.description}
                      </div>
                      {post?.website && (
                        <Link
                          href={post?.website}
                          target="_blank"
                          className="absolute bottom-0 flex text-brand-600 text-sm"
                        >
                          <div className="flex items-center">
                            <div className="mr-1 whitespace-nowrap">
                              External url
                            </div>
                            <ExternalLinkIcon className="w-4 h-4 inline-flex" />
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              </GridItemFour>
            ))}
        </GridLayout>
      )}
      {error && (
        <div className="text-sm text-red-700 dark:text-red-200">
          Something went wrong
        </div>
      )}
    </>
  )
}

export default Volunteers
