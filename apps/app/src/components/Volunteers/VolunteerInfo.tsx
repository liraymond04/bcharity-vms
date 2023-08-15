import { NextPage } from 'next'

import { GridItemTwelve, GridLayout } from '../GridLayout'
import { Card } from '../UI/Card'

const VolunteerInfo: NextPage = () => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return (
    <GridLayout>
      <GridItemTwelve>
        <Card>
          <div className="p-1">
            <div className="flex flex-row">
              <div className="align-middle h-52 w-1/2">
                <img
                  className="w-60 h-50 bg-[#F0DCFF] rounded-full ml-24 mt-10"
                  src="https://i.pinimg.com/474x/03/4c/29/034c29a06646af5286291e24cc64a807.jpg"
                  alt="avatar"
                />

                <div className="h-[60vh] ml-10">
                  <div className=" w-full mt-16 h-36 border bg-accent-content border-gray-400 dark:border-black rounded-md">
                    <div className="w-full font-semibold text-gray-600 text-xl">
                      <div className="inset-0 flex justify-left items-center ml-5 mt-4">
                        <img
                          className=" w-8 h-8 mr-2"
                          src="https://t4.ftcdn.net/jpg/00/65/77/27/360_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg"
                          alt=""
                        />
                        <h1>CAUSES: </h1>
                        <div className="ml-1">{100}</div>
                      </div>

                      <div className="relative inset-0 flex justify-left items-center ml-5 mt-3">
                        <img
                          className=" w-6 h-6 mr-3 ml-1"
                          src="https://www.pngitem.com/pimgs/m/48-486905_heart-logo-png-heart-svg-transparent-png.png"
                          alt=""
                        />
                        <h1>HOURS VOLUNTEERED: </h1>
                        <div className="ml-1">{8}</div>
                      </div>

                      <div className="relative inset-0 flex justify-left items-center ml-5 mt-3">
                        <img
                          className=" w-6 h-6 mr-3 ml-1"
                          src="https://static.vecteezy.com/system/resources/previews/017/259/098/original/clock-icon-time-sign-free-png.png"
                          alt=""
                        />
                        <h1>Date Created: </h1>
                        <div className="ml-1">{8}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full p-10">
                <div className="justify-left h-19">
                  <p className="text-4xl font-bold text-white-600 flex mt-10 ml-10">
                    Volunteer name
                  </p>

                  <div className="h-[60vh] ml-10 mt-8">
                    <div className="w-full font-semibold text-gray-600 dark:text-white text-xl">
                      {' '}
                      About:{' '}
                    </div>
                    <div className=" w-full mt-5 h-36 border bg-accent-content border-gray-400 dark:border-black rounded-md">
                      <div className="w-full font-medium text-gray-600 text-xl p-4">
                        Volunteer description goes here
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </GridItemTwelve>
    </GridLayout>
  )
}

export default VolunteerInfo
