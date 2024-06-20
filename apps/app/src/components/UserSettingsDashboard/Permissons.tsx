import {
  ApprovedAllowanceAmountResultFragment,
  CollectOpenActionModuleType,
  FollowModuleType,
  OpenActionModuleType,
  ReferenceModuleType
} from '@lens-protocol/client'
import { sendTransaction } from '@wagmi/core'
import clsx from 'clsx'
import Link from 'next/link'
import React, { FC, useEffect } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useConfig } from 'wagmi'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import { Card } from '@/components/UI/Card'
import { checkAuth, lensClient } from '@/lib/lens-protocol'
import { useAppPersistStore } from '@/store/app'

import { Button } from '../UI/Button'
import HelpTooltip from '../UI/HelpTooltip'
import { Spinner } from '../UI/Spinner'
interface Props {
  currency: string
  collectModule?: CollectOpenActionModuleType
  followModule?: FollowModuleType
  referenceModule?: ReferenceModuleType
  initValue: string
}

const getResults = async (Option: string) => {
  return lensClient().modules.approvedAllowanceAmount({
    currencies: [Option],
    openActionModules: [
      OpenActionModuleType.LegacyLimitedFeeCollectModule,
      OpenActionModuleType.LegacyFeeCollectModule,
      OpenActionModuleType.LegacyLimitedTimedFeeCollectModule,
      OpenActionModuleType.LegacyTimedFeeCollectModule
    ],
    followModules: [FollowModuleType.FeeFollowModule],
    referenceModules: [ReferenceModuleType.FollowerOnlyReferenceModule]
  })
}

const returnCollectModule = (module: string) => {
  return CollectOpenActionModuleType[
    module as keyof typeof CollectOpenActionModuleType
  ]
}
const returnFollowModule = (module: string) => {
  return FollowModuleType[module as keyof typeof FollowModuleType]
}
const returnReferenceModule = (module: string) => {
  return ReferenceModuleType[module as keyof typeof ReferenceModuleType]
}

const AllowanceButton: FC<Props> = ({
  currency,
  collectModule,
  referenceModule,
  followModule,
  initValue
}) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.settings.permissions'
  })
  const [isCollectActive, setIsCollectActive] = useState(initValue !== '0x00')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    setIsCollectActive(initValue !== '0x00')
  }, [initValue])

  const config = useConfig()
  const GenerateAllowance = async (value: string) => {
    const currencyData =
      await lensClient().modules.generateCurrencyApprovalData({
        allowance: {
          currency,
          value
        },
        module: {
          openActionModule: collectModule as unknown as OpenActionModuleType,
          followModule,
          referenceModule
        }
      })
    const data = currencyData.unwrap()

    const toAddress: `0x${string}` = data.to as `0x${string}`

    const { hash } = await (sendTransaction(config, {
      to: toAddress,
      data: `0x${data.data.substring(2)}`
    }) as any)

    return hash
  }

  return (
    <Button
      disabled={isLoading}
      className={clsx(
        'bg-green-500', // Initial appearance
        isCollectActive && 'bg-red-400 focus:ring-red-400 border-red-700', // Apply this class when isActive is true
        'border border-green-600 text-white focus:ring-green-400 px-3 py-1 flex items-center space-x-1.5 rounded-lg font-bold disabled:opacity-50 shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-offset-1 outline-none'
      )}
      onClick={async () => {
        setIsLoading(true)
        try {
          await GenerateAllowance(
            !isCollectActive ? Number.MAX_SAFE_INTEGER.toString() : '0'
          )
          setIsCollectActive(!isCollectActive)
        } catch (e) {
          console.log(e)
        }
        setIsLoading(false)
      }}
    >
      {isLoading ? <Spinner /> : !isCollectActive ? t('allow') : t('revoke')}
    </Button>
  )
}

/**
 * Component that displays a tab page for editing currency permissions
 *
 * The permissions for each token are set by using the Lens client {@link https://docs.lens.xyz/docs/generate-module-currency-approval-data | generateCurrencyApprovalData} method.
 */
const Permissons: React.FC = () => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.settings.permissions'
  })

  const { currentUser, isAuthenticated } = useAppPersistStore()

  const [Option, setOptions] = useState(
    '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'
  )

  const [moduleData, setModuleData] = useState<
    ApprovedAllowanceAmountResultFragment[]
  >([])

  useEffect(() => {
    if (currentUser) {
      checkAuth(currentUser.ownedBy.address)
        .then(() => getResults(Option))
        .then((res) => {
          if (res.isSuccess())
            setModuleData(
              res.unwrap() as ApprovedAllowanceAmountResultFragment[]
            )
        })
        .catch((err) => console.log(err))
    }
  }, [currentUser, isAuthenticated, Option])

  return (
    <GridLayout>
      <GridItemTwelve>
        <Card>
          <div className="p-3">
            <div className=" rounded-xl border-amber-950 border-width:3">
              <div
                className="text-s font-bold sm:text-s p-2"
                suppressHydrationWarning
              >
                {t('title')}
              </div>
              <div className="text-m font-normal p-2" suppressHydrationWarning>
                {t('description')}
              </div>
              <div className="text-m font-normal p-2" suppressHydrationWarning>
                {t('select-currency')}
              </div>
              <select
                className="ml-2 bg-accent-content dark:bg-info-content rounded-xl border border-gray-300 outline-none disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
                onChange={async (e) => {
                  getResults(e.target.value)
                    .then((res) => {
                      // console.log(res)
                      if (res.isSuccess())
                        setModuleData(
                          res.unwrap() as ApprovedAllowanceAmountResultFragment[]
                        )
                    })
                    .catch((err) => console.log(err))
                  setOptions(e.target.value)
                }}
              >
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
                flex
              </select>
              <div className="p-2 w-[75%]">
                {moduleData.map((data, index) => {
                  return (
                    <div className="mb-3" key={index}>
                      <Card>
                        <div className="bg-accent-content dark:bg-info-content rounded-xl flex justify-end p-2 items-center">
                          <div className="px-2 pt-2 pb-1">
                            <div className="flex text-s font-normal">
                              <div className="mr-1">{data.moduleName}</div>
                              <HelpTooltip content="The Fee Collect Module all p-1ows for any follower to collect the associated publication provided they pay a fee set by the poster." />
                            </div>
                            <Link
                              href="https://mumbai.polygonscan.com/address/0xeb4f3EC9d01856Cec2413bA5338bF35CeF932D82"
                              target="_blank"
                            >
                              <div className="text-s font-normal">
                                {data.moduleContract.address}
                              </div>
                            </Link>
                          </div>
                          <div className="grow" />
                          <div className="p-2">
                            <AllowanceButton
                              currency={data.allowance.asset.name}
                              collectModule={returnCollectModule(
                                data.moduleName
                              )}
                              followModule={returnFollowModule(data.moduleName)}
                              referenceModule={returnReferenceModule(
                                data.moduleName
                              )}
                              initValue={data.allowance.asset.name}
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
  )
}

export default Permissons
