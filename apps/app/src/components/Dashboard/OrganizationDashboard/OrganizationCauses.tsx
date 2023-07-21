import { PlusSmIcon } from '@heroicons/react/outline'
import { AgGridReact } from 'ag-grid-react'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import { Card } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import getCauseMetadata from '@/lib/lens-protocol/getCauseMetadata'
import usePostData from '@/lib/lens-protocol/usePostData'
import { PostTags } from '@/lib/types'
import { useWalletBalance } from '@/lib/useBalance'
import { useAppPersistStore } from '@/store/app'

import Error from '../Modals/Error'
import PublishCauseModal from '../Modals/PublishCauseModal'
import { defaultColumnDef, makeOrgCauseColumnDefs } from './ColumnDefs'

const OrganizationCauses: React.FC = () => {
  const { currentUser: profile } = useAppPersistStore()
  const { resolvedTheme } = useTheme()
  const [gridTheme, setGridTheme] = useState<string>()

  const { data, error, loading, refetch } = usePostData({
    profileId: profile!.id,
    metadata: {
      tags: { all: [PostTags.OrgPublish.Cause] }
    }
  })

  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const onNew = () => {
    setPublishModalOpen(true)
  }

  const onEdit = (id: string) => {
    console.log('edit id ', id)
  }

  const onDelete = () => {
    setDeleteModalOpen(true)
  }

  const [vhrGoal] = useState(600) // use hardcoded goal for now
  useEffect(() => {
    setGridTheme(
      resolvedTheme === 'light' ? 'ag-theme-alpine' : 'ag-theme-alpine-dark'
    )
  }, [resolvedTheme])
  const { currentUser } = useAppPersistStore()
  const { isLoading: isBalanceLoading, data: balanceData } = useWalletBalance(
    currentUser?.ownedBy ?? ''
  )
  const Progress = ({
    progress,
    total,
    className
  }: {
    progress: number
    total: number
    className?: string
  }) => (
    <div className={className}>
      <div className="w-full bg-gray-200 rounded-full h-5 ">
        <div
          className="bg-green-400 h-5 rounded-full"
          style={{
            width: `${Math.min(Math.trunc((progress / total) * 100), 100)}%`
          }}
        ></div>
      </div>
    </div>
  )

  return (
    <GridLayout>
      <GridItemTwelve>
        <Card>
          {isBalanceLoading && (
            <div className="p-12">
              <div className="flex items-center">
                <div className="text-3xl font-extrabold text-purple-500 dark:text-white sm:text-7xl pl-10 pr-3">
                  ${Number(balanceData?.value)}
                </div>
                <div className="text-2xl font-bold text-black dark:text-white sm:text-4xl bottom-0 mt-8">
                  raised out of ${vhrGoal}
                </div>
              </div>
              <Progress
                progress={Number(balanceData?.value)}
                total={vhrGoal}
                className="mt-10 mb-10"
              />
              <div className="text-2xl font-bold text-black dark:text-white sm:text-4xl">
                Our Cause
              </div>
              <div className=" w-full lg:flex mt-5">
                <div className="border-r border-b border-l  p-5 lg:border-l-0 lg:border-t dark:border-x-stone-600 bg-white dark:bg-slate-500 rounded-b lg:rounded-b-none lg:rounded-r  flex flex-col justify-between leading-normal w-full">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Praesent dapibus, neque in auctor tincidunt, Lorem ipsum dolor
                  sit amet, consectetur adipiscing elit. Praesent dapibus, neque
                  in auctor tincidunt, tellus libero elementum nisl, vitae
                  tristique eros lorem in odio. Nullam et eros sem. Duis
                  molestie libero vel consequat suscipit. Sed maximus lacus
                  vitae sem euismod ornare. In lacinia tempor lacus, vitae porta
                  lectus luctus ac. Cras ultrices nulla eu enim ullamcorper
                  iaculis. Nam gravida nibh sed sem interdum hendrerit. Nunc
                  posuere purus id massa malesuada pellentesque. Etiam ipsum
                  metus, laoreet eu libero a, suscipit sagittis ante. Nulla at
                  purus consequat libero imperdiet efficitur quis quis orci.
                  Aliquam felis orci, pretium sit amet volutpat ac, bibendum eu
                  velit. Vivamus mollis, neque in aliquam malesuada, elit mi
                  euismod velit, ac sagittis metus enim aliquet elit. Quisque
                  fringilla sapien nec magna porta varius. Mauris bibendum, dui
                  in dapibus bibendum, ex sapien ultricies lacus, a eleifend
                  mauris erat sit amet purus.tellus libero elementum nisl, vitae
                  tristique eros lorem in odio. Nullam et eros sem. Duis
                  molestie libero vel consequat suscipit. Sed maximus lacus
                  vitae sem euismod ornare. In lacinia tempor lacus, vitae porta
                  lectus luctus ac. Cras ultrices nulla eu enim ullamcorper
                  iaculis. Nam gravida nibh sed sem interdum hendrerit. Nunc
                  posuere purus id massa malesuada pellentesque. Etiam ipsum
                  metus, laoreet eu libero a, suscipit sagittis ante. Nulla at
                  purus consequat libero imperdiet efficitur quis quis orci.
                  Aliquam felis orci, pretium sit amet volutpat ac, bibendum eu
                  velit. Vivamus mollis, neque in aliquam malesuada, elit mi
                  euismod velit, ac sagittis metus enim aliquet elit. Quisque
                  fringilla sapien nec magna porta varius. Mauris bibendum, dui
                  in dapibus bibendum, ex sapien ultricies lacus, a eleifend
                  mauris erat sit amet purus.
                </div>
              </div>
            </div>
          )}

          <div className="p-5">
            <button
              onClick={onNew}
              className="w-8 h-8 bg-purple-500 rounded-lg shadow-md border-black dark:border-white"
            >
              <PlusSmIcon className="w-8 text-white dark:text-black" />
            </button>
            <div
              className={gridTheme}
              style={{ height: '800px', width: '90%' }}
            >
              {loading ? (
                <Spinner />
              ) : (
                <AgGridReact
                  defaultColDef={defaultColumnDef}
                  rowData={getCauseMetadata(data)}
                  columnDefs={Object.values(
                    makeOrgCauseColumnDefs({
                      onEditClick: onEdit,
                      onDeleteClick: onDelete
                    })
                  )}
                  pagination
                  paginationPageSize={20}
                />
              )}
            </div>
            {error && <Error message="An error occured. Please try again." />}
            <PublishCauseModal
              open={publishModalOpen}
              onClose={(shouldRefetch) => {
                setPublishModalOpen(false)

                if (shouldRefetch) {
                  refetch()
                }
              }}
              publisher={profile}
            />
          </div>
        </Card>
      </GridItemTwelve>
    </GridLayout>
  )
}

export default OrganizationCauses
