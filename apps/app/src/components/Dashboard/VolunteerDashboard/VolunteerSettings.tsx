import clsx from 'clsx'
import React from 'react'
import { useState } from 'react'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import { Card } from '@/components/UI/Card'
import HelpTooltip from '@/components/UI/HelpTooltip'

const VolunteerSettingsTab: React.FC = () => {
  const [isFeeCollectActive, setIsFeeCollectActive] = useState(false)
  const [Fee, setFee] = useState('+ allow')
  const [isLimitedFeeCollectActive, setIsLimitedFeeCollectActive] =
    useState(false)
  const [LimitedFee, setLimitedFee] = useState('+ allow')
  const [isTimedFeeCollectActive, setIsTimedFeeCollectActive] = useState(false)
  const [TimedFee, setTimedFee] = useState('+ allow')
  const [isLimitedTimedFeeCollectActive, setIsLimitedTimedFeeCollectActive] =
    useState(false)
  const [LimitedTimedFee, setLimitedTimedFee] = useState('+ allow')
  const [isFeeFollowActive, setIsFeeFollowActive] = useState(false)
  const [FeeFollow, setFeeFollow] = useState('+ allow')
  const [isFollowerOnlyReferenceActive, setIsFollowerOnlyReferenceActive] =
    useState(false)
  const [FollowerOnlyReference, setFollowerOnlyReference] = useState('+ allow')

  return (
    <GridLayout>
      <GridItemTwelve>
        <Card>
          <div className="p-3">
            <div className=" rounded-xl border-amber-950 border-width:3">
              <div className="text-s font-bold text-black sm:text-s pd-2">
                Allow/Remove modules
              </div>
              <div className="text-m font-normal text-black p-2">
                In order to use the collect feature you need to allow the
                corresponding modules. You can allow and revoke permissions for
                modules at any time.
              </div>
              <div className="text-m font-normal text-black p-2">
                Select Currency:
              </div>
              <select className="">
                <option value="Wrapped Matric">Wrapped Matric</option>

                <option value="WETH">WETH</option>

                <option value="USDC">USDC</option>

                <option value="Toucan Protocal: Nature Carbon Tonne">
                  Toucan Protocal: Nature Carbon Tonne
                </option>
              </select>
              <div className="justify-center space-x-5 py-3">
                <Card>
                  <div className="bg-white rounded-xl grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <div className="flex text-s font-normal text-black p-2">
                        Fee Collect
                        <HelpTooltip content="The Fee Collect Module allows for any follower to collect the associated publication provided they pay a fee set by the poster." />
                      </div>
                      <a href="https://mumbai.polygonscan.com/address/0xeb4f3EC9d01856Cec2413bA5338bF35CeF932D82">
                        <div className="text-s font-normal text-zinc-400 p-1">
                          0xeb4f3EC9d01856Cec2413bA5338bF35CeF932D82
                        </div>
                      </a>
                    </div>
                    <div></div>
                    <div></div>
                    <div className="flex justify-end p-3">
                      <button
                        className={clsx(
                          'bg-green-500', // Initial appearance
                          isFeeCollectActive &&
                            'bg-red-400 focus:ring-red-400 border-red-700', // Apply this class when isActive is true
                          'border border-green-600 text-white focus:ring-green-400 px-3 py-1 flex items-center space-x-1.5 rounded-lg font-bold disabled:opacity-50 shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-offset-1 outline-none'
                        )}
                        onClick={() => {
                          setIsFeeCollectActive(!isFeeCollectActive)
                          setFee(isFeeCollectActive ? '+ allow' : '- revoke')
                        }}
                      >
                        {Fee}
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="justify-center space-x-5 py-3">
                <Card>
                  <div className="bg-white rounded-xl grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <div className="flex text-s font-normal text-black p-2">
                        Limited Fee Collect
                        <HelpTooltip content="The Limited Fee Collect Module allows for any follower to collect the associated publication, provided they pay a fee, up to a specific limit of mints." />
                      </div>
                      <a href="https://mumbai.polygonscan.com/address/0xFCDA2801a31ba70dfe542793020a934F880D54aB">
                        <div className="text-s font-normal text-zinc-400 p-1">
                          0xFCDA2801a31ba70dfe542793020a934F880D54aB
                        </div>
                      </a>
                    </div>
                    <div></div>
                    <div></div>
                    <div className="flex justify-end p-3">
                      <button
                        className={clsx(
                          'bg-green-500', // Initial appearance
                          isLimitedFeeCollectActive &&
                            'bg-red-400 focus:ring-red-400 border-red-700', // Apply this class when isActive is true
                          'border border-green-600 text-white focus:ring-green-400 px-3 py-1 flex items-center space-x-1.5 rounded-lg font-bold disabled:opacity-50 shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-offset-1 outline-none'
                        )}
                        onClick={() => {
                          setIsLimitedFeeCollectActive(
                            !isLimitedFeeCollectActive
                          )
                          setLimitedFee(
                            isLimitedFeeCollectActive ? '+ allow' : '- revoke'
                          )
                        }}
                      >
                        {LimitedFee}
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="justify-center space-x-5 py-3">
                <Card>
                  <div className="bg-white rounded-xl grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <div className="flex text-s font-normal text-black p-2">
                        Timed Fee Collect
                        <HelpTooltip content="The Timed Fee Collect Module allows for any follower to collect the associated publication, provided they pay a fee, up to a specific time limit. The present whitelisted Timed Fee Collect module only has a 24-hour time limit to reduce gas usage and optimize efficiency." />
                      </div>
                      <a href="https://mumbai.polygonscan.com/address/0x36447b496ebc97DDA6d8c8113Fe30A30dC0126Db">
                        <div className="text-s font-normal text-zinc-400 p-1">
                          0x36447b496ebc97DDA6d8c8113Fe30A30dC0126Db
                        </div>
                      </a>
                    </div>
                    <div></div>
                    <div></div>
                    <div className="flex justify-end p-3">
                      <button
                        className={clsx(
                          'bg-green-500', // Initial appearance
                          isTimedFeeCollectActive &&
                            'bg-red-400 focus:ring-red-400 border-red-700', // Apply this class when isActive is true
                          'border border-green-600 text-white focus:ring-green-400 px-3 py-1 flex items-center space-x-1.5 rounded-lg font-bold disabled:opacity-50 shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-offset-1 outline-none'
                        )}
                        onClick={() => {
                          setIsTimedFeeCollectActive(!isTimedFeeCollectActive)
                          setTimedFee(
                            isTimedFeeCollectActive ? '+ allow' : '- revoke'
                          )
                        }}
                      >
                        {TimedFee}
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="justify-center space-x-5 py-3">
                <Card>
                  <div className="bg-white rounded-xl grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <div className="flex text-s font-normal text-black p-2">
                        Limited Timed Fee Collect
                        <HelpTooltip content="The Limited Timed Fee Collect Module allows for any follower to collect the associate publication, provided they pay a fee, up to a specific time limit and mint cap. It is essentially a combination of the Timed Fee Collect Module and the Limited Fee Collect Module." />
                      </div>
                      <a href="https://mumbai.polygonscan.com/address/0xDa76E44775C441eF53B9c769d175fB2948F15e1C">
                        <div className="text-s font-normal text-zinc-400 p-1">
                          0xDa76E44775C441eF53B9c769d175fB2948F15e1C
                        </div>
                      </a>
                    </div>
                    <div></div>
                    <div></div>
                    <div className="flex justify-end p-3">
                      <button
                        className={clsx(
                          'bg-green-500', // Initial appearance
                          isLimitedTimedFeeCollectActive &&
                            'bg-red-400 focus:ring-red-400 border-red-700', // Apply this class when isActive is true
                          'border border-green-600 text-white focus:ring-green-400 px-3 py-1 flex items-center space-x-1.5 rounded-lg font-bold disabled:opacity-50 shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-offset-1 outline-none'
                        )}
                        onClick={() => {
                          setIsLimitedTimedFeeCollectActive(
                            !isLimitedTimedFeeCollectActive
                          )
                          setLimitedTimedFee(
                            isLimitedTimedFeeCollectActive
                              ? '+ allow'
                              : '- revoke'
                          )
                        }}
                      >
                        {LimitedTimedFee}
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="justify-center space-x-5 py-3">
                <Card>
                  <div className="bg-white rounded-xl grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <div className="flex text-s font-normal text-black p-2">
                        Fee Follow
                        <HelpTooltip content="The Fee Follow Module only allows addresses to follow a given profile, so long as they pay a fee specified by the profile owner. Users can set the currency and amount required to be paid so long as the currency has been whitelisted by governance" />
                      </div>
                      <a href="https://mumbai.polygonscan.com/address/0xe7AB9BA11b97EAC820DbCc861869092b52B65C06">
                        <div className="text-s font-normal text-zinc-400 p-1">
                          0xe7AB9BA11b97EAC820DbCc861869092b52B65C06
                        </div>
                      </a>
                    </div>
                    <div></div>
                    <div></div>
                    <div className="flex justify-end p-3">
                      <button
                        className={clsx(
                          'bg-green-500', // Initial appearance
                          isFeeFollowActive &&
                            'bg-red-400 focus:ring-red-400 border-red-700', // Apply this class when isActive is true
                          'border border-green-600 text-white focus:ring-green-400 px-3 py-1 flex items-center space-x-1.5 rounded-lg font-bold disabled:opacity-50 shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-offset-1 outline-none'
                        )}
                        onClick={() => {
                          setIsFeeFollowActive(!isFeeFollowActive)
                          setFeeFollow(
                            isFeeFollowActive ? '+ allow' : '- revoke'
                          )
                        }}
                      >
                        {FeeFollow}
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="justify-center space-x-5 py-3">
                <Card>
                  <div className="bg-white rounded-xl grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <div className="flex text-s font-normal text-black p-2">
                        Follower Only Reference
                        <HelpTooltip content="The Follower Only Reference Module ensures that only a profile is allowed to mirror or comment on content if that wallet contains the FollowNFT of the profile that posted the comment they are mirroring or commenting on." />
                      </div>
                      <a href="https://mumbai.polygonscan.com/address/0x7Ea109eC988a0200A1F79Ae9b78590F92D357a16">
                        <div className="text-s font-normal text-zinc-400 p-1">
                          0x7Ea109eC988a0200A1F79Ae9b78590F92D357a16
                        </div>
                      </a>
                    </div>
                    <div></div>
                    <div></div>
                    <div className="flex justify-end p-3">
                      <button
                        className={clsx(
                          'bg-green-500', // Initial appearance
                          isFollowerOnlyReferenceActive &&
                            'bg-red-400 focus:ring-red-400 border-red-700', // Apply this class when isActive is true
                          'border border-green-600 text-white focus:ring-green-400 px-3 py-1 flex items-center space-x-1.5 rounded-lg font-bold disabled:opacity-50 shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-offset-1 outline-none'
                        )}
                        onClick={() => {
                          setIsFollowerOnlyReferenceActive(
                            !isFollowerOnlyReferenceActive
                          )
                          setFollowerOnlyReference(
                            isFollowerOnlyReferenceActive
                              ? '+ allow'
                              : '- revoke'
                          )
                        }}
                      >
                        {FollowerOnlyReference}
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Card>
      </GridItemTwelve>
    </GridLayout>
  )
}

export default VolunteerSettingsTab
