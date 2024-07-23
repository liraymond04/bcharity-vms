import SEO from '@components/utils/SEO'
import { SearchIcon } from '@heroicons/react/outline'
import { ExplorePublicationsOrderByType } from '@lens-protocol/client'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { useTranslation } from 'react-i18next'

import { useExplorePublications } from '@/lib/lens-protocol'
import { CauseMetadata } from '@/lib/metadata'
import { PostTags } from '@/lib/metadata'
import { getCauseMetadata } from '@/lib/metadata'
import testSearch from '@/lib/search'

import Error from '../Dashboard/Modals/Error'
import DashboardDropDown from '../Dashboard/VolunteerDashboard/DashboardDropDown'
import { GridItemFour, GridLayout } from '../GridLayout'
import ClearFilters from '../Shared/ClearFilters'
import Divider from '../Shared/Divider'
import { Spinner } from '../UI/Spinner'
import CauseCard from './CauseCard'

/**
 * A component that displays the browse causes page
 *
 * Cause posts are fetched using the {@link useExplorePublications} hook, and are filtered
 * using the metadata tags {@link PostTags.OrgPublish.Cause}.
 *
 * Results from the Lens hook are mapped and displayed as a {@link CauseCard} in a grid,
 * and are loaded with infinite scrolling that uses the fetchMore method provided by the
 * {@link useExplorePublications} hook.
 *
 * Infinite scrolling uses the useInView hook from the {@link https://github.com/wellyshen/react-cool-inview | react-cool-inview} package
 * to check if the bottom of the loaded list of posts is in the user's view, and call the
 * fetchMore method if it is in view.
 *
 * Displayed posts are further filtered by the search inputs and category dropdown filter.
 * Search uses the {@link testSearch} function to fuzzy search posts matching the search
 * query. The category dropdown filter displays posts only with the selected category in
 * their metadata, and its dropdown is displayed with the {@link DashboardDropDown} component.
 */
const Causes: NextPage = () => {
  const { t } = useTranslation('common', { keyPrefix: 'components.causes' })
  const { t: s } = useTranslation('common', {
    keyPrefix: 'components.volunteers'
  })
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })
  const [posts, setPosts] = useState<CauseMetadata[]>([])
  const [categories, setCategories] = useState<Set<string>>(new Set())

  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const [searchValue, setSearchValue] = useState('')

  const {
    data,
    error: exploreError,
    hasMore,
    fetchMore,
    loading
  } = useExplorePublications(
    {
      orderBy: ExplorePublicationsOrderByType.Latest,
      where: {
        metadata: {
          tags: { oneOf: [PostTags.OrgPublish.Cause] }
        }
      }
      // noRandomize: true // deprecated i believe
    },
    true
  )

  const tSearch = () => {}

  useEffect(() => {
    let _posts: CauseMetadata[] = []
    let _categories: Set<string> = new Set()
    const metadata = getCauseMetadata(data)
    metadata.forEach((post) => {
      _posts.push(post)
      if (post.category) _categories.add(post.category)
    })
    setPosts(_posts)
    setCategories(_categories)
  }, [data])

  const { observe } = useInView({
    onChange: async ({ unobserve, inView }) => {
      console.log(
        'on change: in view? %s | has more? %s | loading? %s',
        inView,
        hasMore,
        loading
      )
      if (inView) {
        if (hasMore) {
          fetchMore()
        } else {
          unobserve()
        }
      }
    }
  })

  return (
    <>
      <SEO title="Projects • BCharity VMS" />
      <div className="mx-auto max-w-screen-xl px-0 sm:px-5">
        <div className="mt-5">
          <p className="font-bold text-2xl" suppressHydrationWarning>
            {t('browse-projects')}
          </p>
          <Divider className="mt-5" />
        </div>
        <div className="flex flex-wrap gap-y-5 justify-around items-center mt-10">
          <div className="flex justify-between w-[300px] h-[50px] bg-accent-content items-center rounded-md border-violet-300 border-2 ml-10 mr-10 dark:bg-Input">
            <input
              className="focus:ring-0 border-none outline-none focus:border-none focus:outline-none  bg-transparent rounded-2xl w-[250px]"
              type="text"
              value={searchValue}
              placeholder={`${s('search')}`}
              onChange={(e) => {
                setSearchValue(e.target.value)
              }}
            />
            <div className="h-5 w-5 mr-5">
              <SearchIcon />
            </div>
          </div>

          <div className="flex flex-wrap gap-y-5 justify-around w-[420px] items-center">
            <div className="h-[50px] z-10 ">
              <DashboardDropDown
                label={`${t('filter')}:`}
                options={Array.from(categories)}
                onClick={(c) => setSelectedCategory(c)}
                selected={selectedCategory}
              ></DashboardDropDown>
            </div>
            <ClearFilters
              onClick={() => {
                setSelectedCategory('')
                setSearchValue('')
              }}
            />
          </div>
        </div>
      </div>
      <GridLayout className="flex items-center justify-center">
        {posts
          .filter(
            (post) =>
              testSearch(post.name, searchValue) &&
              (selectedCategory === '' || post.category === selectedCategory)
          )
          .map((post) => (
            <GridItemFour key={post.id}>
              <CauseCard cause={post} />
            </GridItemFour>
          ))}
        <span
          className="flex justify-center p-5"
          ref={observe}
          hidden={!loading}
        >
          {loading && <Spinner size="md" />}
        </span>
      </GridLayout>
      {exploreError && (
        <Error
          message={`${e('generic-front')}${exploreError}${e('generic-back')}`}
        />
      )}
    </>
  )
}

export default Causes
