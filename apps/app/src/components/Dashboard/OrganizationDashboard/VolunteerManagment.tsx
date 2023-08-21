import { PlusCircleIcon, SearchIcon } from '@heroicons/react/outline'
import React, { MouseEventHandler, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import ClearFilters from '@/components/Shared/ClearFilters'
import { Button } from '@/components/UI/Button'
import { Card } from '@/components/UI/Card'

import DashboardDropDown from '../VolunteerDashboard/DashboardDropDown'

interface VolunteerInfoProps {
  volName: string
  bio: string
  location: string
  date: string
  avatar?: string
}

interface PurpleBoxProps {
  selected?: boolean
  userName: string
  dateCreated: string
  onClick?: MouseEventHandler<HTMLDivElement>
}

const PurpleBox: React.FC<PurpleBoxProps> = ({
  selected,
  userName,
  dateCreated,
  onClick
}) => {
  const boxClassName = selected
    ? 'bg-blue-100 dark:bg-violet-500'
    : 'bg-violet-200 dark:bg-Within dark:bg-opacity-10'
  return (
    <div
      className={`items-center shadow-sm shadow-black px-5 mx-5 my-3 h-16 py-2 ${boxClassName}`}
      onClick={onClick}
    >
      <div>{userName}</div>
      <div className="flex justify-end my-3">
        <div className="text-sm font-extralight">
          Application date created:&nbsp;
        </div>
        <div className="text-sm font-extralight">{dateCreated}</div>
      </div>
    </div>
  )
}

const VolunteerInfoCard: React.FC<VolunteerInfoProps> = (info) => {
  const { t } = useTranslation('common', {
    keyPrefix:
      'components.dashboard.organization.VolunteerManagment.VolunteerInfo-card'
  })
  return (
    <Card className="pt-10 pl-10 pr-10 justify-center">
      <div className="justify-center font-black text-3xl py-4">
        Volunteer Information
      </div>

      <div className="justify-start flex">
        <div className="text-violet-500">{info.volName}&nbsp;</div>
        <p> wants to work with your organization</p>
      </div>
      <div className="flex">
        {info.avatar !== undefined && (
          <img
            className="rounded-sm py-3"
            src={info.avatar}
            alt="Rounded avatar"
            style={{ width: '100px', height: 'auto' }}
          />
        )}
        <div className="flex justify-between py-3 pl-5">
          <div className="text-violet-500">bio:&nbsp;</div>
          <p>{info.bio}</p>
        </div>
      </div>
      <div className="flex">
        <div className="text-violet-500">location:&nbsp;</div>
        <p>{info.location}</p>
      </div>
      <div className="flex">
        <div className="text-violet-500">Application date created:&nbsp;</div>
        <p>{info.date}</p>
      </div>
      <div className="flex mt-40">
        {' '}
        <Button className="my-5" type="submit" suppressHydrationWarning>
          save
        </Button>
        <Button className="my-5 ml-40" type="submit" suppressHydrationWarning>
          accept
        </Button>
      </div>
    </Card>
  )
}

const VolunteerManagmentTab: React.FC = () => {
  const [searchValue, setSearchValue] = useState('')
  const [categories] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selected, setSelected] = useState<number>()

  const testData = [
    {
      userName: 'May',
      dateCreated: '6969',
      location: 'france',
      bio: 'im weird',
      avatar:
        'https://www.boredpanda.com/blog/wp-content/uploads/2021/06/Meet-Gertrude-the-duck-with-more-stylish-hair-than-yours-60d992b564567__700.jpg'
    },
    {
      userName: 'bLAH',
      dateCreated: '6969',
      location: 'uk',
      bio: 'bio 1',
      avatar:
        'https://blog.udemy.com/wp-content/uploads/2014/05/bigstock-test-icon-63758263.jpg'
    },
    {
      userName: 'aksmc',
      dateCreated: '6969',
      location: 'canada',
      bio: 'bio 2'
    },
    {
      userName: 'May',
      dateCreated: '6969',
      location: 'usa',
      bio: 'bio 3'
    },
    {
      userName: 'lali',
      dateCreated: '6969',
      location: 'germany',
      bio: 'bio 4'
    },
    {
      userName: 'Michael',
      dateCreated: '6969',
      location: 'china',
      bio: 'bio 5'
    },
    {
      userName: 'johnny',
      dateCreated: '6969',
      location: 'korea',
      bio: 'bio 6'
    },
    {
      userName: 'lalalalaal',
      dateCreated: '6969',
      location: 'poland',
      bio: 'bio 7'
    },
    {
      userName: 'say less',
      dateCreated: '6969',
      location: 'mexico',
      bio: 'bio 8'
    },
    {
      userName: 'stop this',
      dateCreated: '6969',
      location: 'indonesia',
      bio: 'bio 9'
    },
    {
      userName: 'help',
      dateCreated: '6969',
      location: 'spain',
      bio: 'bio 10'
    },
    {
      userName: 'sry',
      dateCreated: '6969',
      location: 'egypt',
      bio: 'bio 11'
    }
  ]

  return (
    <GridLayout>
      <GridItemTwelve>
        <div className="flex item-center my-10 px-10">
          <div className="border-black bg-white text-black border-l px-2">
            All Volunteers
          </div>
          <div className="border-black bg-white text-black border-l px-2">
            Volunteers applications
          </div>
        </div>
        <div className="flex flex-wrap gap-y-5 justify-around items-center mt-10">
          <div className="flex justify-between w-[300px] h-[50px] bg-accent-content items-center rounded-md border-violet-300 border-2 ml-10 mr-10 dark:bg-Input">
            <input
              className="focus:ring-0 border-none outline-none focus:border-none focus:outline-none  bg-transparent rounded-2xl w-[250px]"
              type="text"
              value={searchValue}
              placeholder={'search'}
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
                label={'filter'}
                options={Array.from(categories)}
                onClick={(c) => setSelectedCategory(c)}
                selected={selectedCategory}
              ></DashboardDropDown>
            </div>
            <ClearFilters
              onClick={() => {
                setSelectedCategory('')
              }}
            />
          </div>
        </div>
        <div className="flex item-center justify-end pr-20 pt-10">
          Add a Volunteer
          <PlusCircleIcon className="w-8 text-brand-400" />
        </div>
        <div className="flex space-x-24 pt-5">
          <Card className={`h-1/2 w-1/2`}>
            <div className="scrollbar">
              {testData.map((item, i) => {
                return (
                  <PurpleBox
                    key={i}
                    selected={selected === i}
                    userName={item.userName}
                    dateCreated={item.dateCreated}
                    onClick={() => {
                      if (selected === i) setSelected(undefined)
                      else setSelected(i)
                    }}
                  />
                )
              })}

              {/* the box placeholder for the data ^ */}
            </div>
          </Card>
          {selected !== undefined && (
            <div className="pb-10">
              <VolunteerInfoCard
                volName={testData[selected].userName}
                location={testData[selected].location}
                date={testData[selected].dateCreated}
                bio={testData[selected].bio}
                avatar={testData[selected].avatar}
              />
            </div>
          )}
        </div>
      </GridItemTwelve>
    </GridLayout>
  )
}

export default VolunteerManagmentTab
