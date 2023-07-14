import { GridItemFour, GridLayout } from '@components/GridLayout'
import Search from '@components/Shared/Search'
import { Card } from '@components/UI/Card'
import SEO from '@components/utils/SEO'
import { NextPage } from 'next'

const Volunteers: NextPage = () => {
  return (
    <>
      <SEO title="Volunteers • BCharity VMS" />
      <div className="mx-auto max-w-screen-xl px-0 sm:px-5 font-bold text-2xl">
        <div className="flex justify-between my-5">
          <Search />
        </div>
        Browse volunteer opportunities
      </div>
      <GridLayout>
        <GridItemFour>
          <Card>Test</Card>
        </GridItemFour>
        <GridItemFour>
          <Card>Test</Card>
        </GridItemFour>
        <GridItemFour>
          <Card>Test</Card>
        </GridItemFour>
      </GridLayout>
    </>
  )
}

export default Volunteers
