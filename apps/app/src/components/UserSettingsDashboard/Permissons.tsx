import {
  ApprovedAllowanceAmountFragment,
  CollectModules,
  FollowModules,
  GenerateModuleCurrencyApprovalFragment,
  ReferenceModules
} from '@lens-protocol/client'
import { signMessage } from '@wagmi/core'
import clsx from 'clsx'
import React, { FC, useEffect } from 'react'
import { useState } from 'react'
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import { Card } from '@/components/UI/Card'
import HelpTooltip from '@/components/UI/HelpTooltip'
import lensClient from '@/lib/lens-protocol/lensClient'
import { useAppPersistStore } from '@/store/app'
interface Props {
  currency: string
  collectModule?: CollectModules
  followModule?: FollowModules
  referenceModule?: ReferenceModules
  initValue: string
}

const getResults = async (Option: string) => {
  return lensClient().modules.approvedAllowanceAmount({
    currencies: [Option],
    collectModules: [CollectModules.LimitedFeeCollectModule],
    followModules: [FollowModules.FeeFollowModule],
    referenceModules: [ReferenceModules.FollowerOnlyReferenceModule]
  })
}
const returnCollectModule = (module: string) => {
  if (module === 'LimitedFeeCollectModule') {
    return CollectModules.LimitedFeeCollectModule
  }
  return undefined
}
const returnFollowModule = (module: string) => {
  if (module === 'FeeFollowModule') {
    return FollowModules.FeeFollowModule
  }
  return undefined
}
const returnReferenceModule = (module: string) => {
  if (module === 'FollowerOnlyReferenceModule') {
    return ReferenceModules.FollowerOnlyReferenceModule
  }
  return undefined
}
const AllowanceButton: FC<Props> = ({
  currency,
  collectModule,
  referenceModule,
  followModule,
  initValue
}) => {
  const [isCollectActive, setIsCollectActive] = useState(initValue !== '0x00')
  const [data, setData] = useState<GenerateModuleCurrencyApprovalFragment>()
  const { config } = usePrepareSendTransaction({
    account: `0x${data?.from.substring(2)}`,
    to: data?.to,
    value: BigInt(data?.data ? data.data : BigInt(0))
  })
  const { isLoading, isSuccess, sendTransaction } = useSendTransaction(config)
  useEffect(() => {}, [data])
  const GenerateAllowence = async (value: string) => {
    const currencyData =
      await lensClient().modules.generateCurrencyApprovalData({
        currency,
        value,
        collectModule,
        followModule,
        referenceModule
      })
    const data = currencyData.unwrap()
    setData(data)
  }

  return (
    <button
      disabled={isLoading}
      className={clsx(
        'bg-green-500', // Initial appearance
        isCollectActive && 'bg-red-400 focus:ring-red-400 border-red-700', // Apply this class when isActive is true
        'border border-green-600 text-white focus:ring-green-400 px-3 py-1 flex items-center space-x-1.5 rounded-lg font-bold disabled:opacity-50 shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-offset-1 outline-none'
      )}
      onClick={() => {
        setIsCollectActive(!isCollectActive)
        GenerateAllowence(
          isCollectActive ? '0' : Number.MAX_SAFE_INTEGER.toString()
        ).then(() => {
          console.log('sendTransaction')
          sendTransaction?.(config)
        })
      }}
    >
      {!isCollectActive ? '+ allow' : '- revoke'}
    </button>
  )
}

const auth = async (address: string) => {
  const authenticated = await lensClient().authentication.isAuthenticated()

  if (!authenticated) {
    const challenge = await lensClient().authentication.generateChallenge(
      address
    )

    const signature = await signMessage({ message: challenge })

    await lensClient().authentication.authenticate(address, signature)
  }
}

const Permissons: React.FC = () => {
  const { currentUser, isAuthenticated } = useAppPersistStore()

  const [Option, setOptions] = useState(
    '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'
  )

  const [moduleData, setModuleData] = useState<
    ApprovedAllowanceAmountFragment[]
  >([])

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      auth(currentUser.ownedBy)
        .then(() => getResults(Option))
        .then((res) => {
          console.log(res)

          if (res.isSuccess()) {
            setModuleData(res.unwrap() as ApprovedAllowanceAmountFragment[])
          }
        })
        .catch((err) => console.log(err))
    }
  }, [currentUser, isAuthenticated, Option])

  console.log(Option)

  return (
    <p>
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
                  corresponding modules. You can allow and revoke permissions
                  for modules at any time.
                </div>
                <div className="text-m font-normal text-black p-2">
                  Select Currency:
                </div>
                <select onChange={(e) => setOptions(e.target.value)}>
                  <option value="0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889">
                    Wrapped Matic
                  </option>

                  <option value="0x3C68CE8504087f89c640D02d133646d98e64ddd9">
                    WETH
                  </option>

                  <option value="0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e">
                    USDC
                  </option>

                  <option value="0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F">
                    DAI
                  </option>

                  <option value="0x7beCBA11618Ca63Ead5605DE235f6dD3b25c530E">
                    Toucan Protocal: Nature Carbon Tonne
                  </option>
                </select>
                <div className="justify-center space-x-5 py-3">
                  {moduleData.map((data, index) => {
                    console.log(data, index)
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <div className="flex p-3">
                        <Card key={index}>
                          <div className="bg-white rounded-xl grid gap-2 md:grid-cols-2 lg:grid-cols-2">
                            <div>
                              <div className="flex text-s font-normal text-black p-2">
                                {data.module}
                                <HelpTooltip content="The Fee Collect Module allows for any follower to collect the associated publication provided they pay a fee set by the poster." />
                              </div>
                              <a href="https://mumbai.polygonscan.com/address/0xeb4f3EC9d01856Cec2413bA5338bF35CeF932D82">
                                <div className="text-s font-normal text-zinc-400 p-1">
                                  {data.contractAddress}
                                </div>
                              </a>
                            </div>
                            <div className="flex justify-end p-2">
                              <AllowanceButton
                                currency={data.currency}
                                collectModule={returnCollectModule(data.module)}
                                followModule={returnFollowModule(data.module)}
                                referenceModule={returnReferenceModule(
                                  data.module
                                )}
                                initValue={data.allowance}
                              />
                            </div>
                          </div>
                        </Card>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </Card>
        </GridItemTwelve>
      </GridLayout>
    </p>
  )
}

export default Permissons
