import { PlusSmIcon } from '@heroicons/react/outline'
import {
  PublicationFragment,
  PublicationsQueryRequest,
  PublicationTypes
} from '@lens-protocol/client'
import { AgGridReact } from 'ag-grid-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import { Card } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import getCauseMetadata from '@/lib/lens-protocol/getCauseMetadata'
import lensClient from '@/lib/lens-protocol/lensClient'
import usePostData from '@/lib/lens-protocol/usePostData'
import { CauseMetadata, PostTags } from '@/lib/types'
import { useWalletBalance } from '@/lib/useBalance'
import { useAppPersistStore } from '@/store/app'

import DeleteCauseModal from '../Modals/DeleteCauseModal'
import Error from '../Modals/Error'
import GoalModal from '../Modals/GoalModal'
import ModifyCauseModal from '../Modals/ModifyCauseModal'
import PublishCauseModal, {
  emptyPublishFormData,
  IPublishCauseFormProps
} from '../Modals/PublishCauseModal'
import { defaultColumnDef, makeOrgCauseColumnDefs } from './ColumnDefs'

const OrganizationCauses: React.FC = () => {
  const { currentUser: profile } = useAppPersistStore()
  const { resolvedTheme } = useTheme()
  const [gridTheme, setGridTheme] = useState<string>()
  const [postMetadata, setPostMetadata] = useState<CauseMetadata[]>([])

  const [modifyModalOpen, setModifyModalOpen] = useState(false)

  const [currentModifyId, setCurrentModifyId] = useState('')
  const [currentDeleteId, setCurrentDeleteId] = useState('')
  const { data, error, loading, refetch } = usePostData({
    profileId: profile?.id,
    metadata: {
      tags: { all: [PostTags.OrgPublish.Cause] }
    }
  })

  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [GoalModalOpen, setGoalModalOpen] = useState(false)
  const [postdata, setpostdata] = useState<PublicationFragment[]>([])

  const onPublishClose = (shouldRefetch: boolean) => {
    setPublishModalOpen(false)

    if (shouldRefetch) {
      refetch()
    }
  }
  const onGoalClose = (shouldRefetch: boolean) => {
    setGoalModalOpen(false)

    if (shouldRefetch) {
      refetch()
    }
  }
  const onModifyClose = (shouldRefetch: boolean) => {
    setModifyModalOpen(false)

    if (shouldRefetch) {
      refetch()
    }
  }

  const onDeleteClose = (shouldRefetch: boolean) => {
    setDeleteModalOpen(false)
    if (shouldRefetch) {
      refetch()
    }
  }

  const onNew = () => {
    setPublishModalOpen(true)
  }
  const onGoalOpen = () => {
    setGoalModalOpen(true)
  }
  const onEdit = (id: string) => {
    setCurrentModifyId(id)
    setModifyModalOpen(true)
  }

  const onDelete = (id: string) => {
    setCurrentDeleteId(id)
    setDeleteModalOpen(true)
  }

  useEffect(() => {
    setPostMetadata(getCauseMetadata(data))
  }, [data])

  useEffect(() => {
    setGridTheme(
      resolvedTheme === 'light' ? 'ag-theme-alpine' : 'ag-theme-alpine-dark'
    )
  }, [resolvedTheme])
  useEffect(() => {
    const param: PublicationsQueryRequest = {
      metadata: { tags: { all: [PostTags.OrgPublish.Goal] } },
      profileId: profile!.id,
      publicationTypes: [PublicationTypes.Post]
    }

    lensClient()
      .publication.fetchAll(param)
      .then((data) => {
        setpostdata(data.items)
      })
  }, [profile])

  const { currentUser } = useAppPersistStore()
  const { isLoading: isBalanceLoading, data: balanceData } = useWalletBalance(
    currentUser?.ownedBy ?? ''
  )

  const [vhrGoal] = useState(600) // use hardcoded goal for now

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

  const getFormDefaults = (id: string): IPublishCauseFormProps => {
    const d = postMetadata.find((val) => val?.cause_id === id)
    console.log('d', d)

    return d
      ? {
          selectedCurrency: d.currency ?? '',
          name: d.name ?? '',
          goal: d.goal ?? '',
          contribution: d.contribution ?? '',
          OrgPublish: d.from ?? '',
          category: d.category ?? '',
          description: d.description ?? '',
          currency: d.currency ?? '',
          recipient: d.recipient ?? '',
          location: d.location ?? '',
          imageUrl: d.imageUrl ?? ''
        }
      : { ...emptyPublishFormData }
  }

  return (
    <GridLayout>
      <GridItemTwelve>
        <Card>
          <div className="p-10 m-10">
            {loading ? (
              <Spinner />
            ) : (
              <>
                <div className="flex items-center">
                  <div className="text-3xl font-extrabold text-purple-500 dark:text-white sm:text-7xl pr-3">
                    {Number(balanceData?.value)}
                  </div>
                  <div className="text-2xl font-bold text-black dark:text-white sm:text-4xl mt-8">
                    VHR raised out of{' '}
                    {postdata[0]?.__typename === 'Post'
                      ? postdata[0]?.metadata.attributes[0]?.value
                      : ' '}
                  </div>
                </div>
                <Link
                  href=""
                  className="text-brand-500 hover:text-brand-600 mt-6"
                  onClick={onGoalOpen}
                >
                  Set a goal
                </Link>

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
                    Praesent dapibus, neque in auctor tincidunt, Lorem ipsum
                    dolor sit amet, consectetur adipiscing elit. Praesent
                    dapibus, neque in auctor tincidunt, tellus libero elementum
                    nisl, vitae tristique eros lorem in odio. Nullam et eros
                    sem. Duis molestie libero vel consequat suscipit. Sed
                    maximus lacus vitae sem euismod ornare. In lacinia tempor
                    lacus, vitae porta lectus luctus ac. Cras ultrices nulla eu
                    enim ullamcorper iaculis. Nam gravida nibh sed sem interdum
                    hendrerit. Nunc posuere purus id massa malesuada
                    pellentesque. Etiam ipsum metus, laoreet eu libero a,
                    suscipit sagittis ante. Nulla at purus consequat libero
                    imperdiet efficitur quis quis orci. Aliquam felis orci,
                    pretium sit amet volutpat ac, bibendum eu velit. Vivamus
                    mollis, neque in aliquam malesuada, elit mi euismod velit,
                    ac sagittis metus enim aliquet elit. Quisque fringilla
                    sapien nec magna porta varius. Mauris bibendum, dui in
                    dapibus bibendum, ex sapien ultricies lacus, a eleifend
                    mauris erat sit amet purus.tellus libero elementum nisl,
                    vitae tristique eros lorem in odio. Nullam et eros sem. Duis
                    molestie libero vel consequat suscipit. Sed maximus lacus
                    vitae sem euismod ornare. In lacinia tempor lacus, vitae
                    porta lectus luctus ac. Cras ultrices nulla eu enim
                    ullamcorper iaculis. Nam gravida nibh sed sem interdum
                    hendrerit. Nunc posuere purus id massa malesuada
                    pellentesque. Etiam ipsum metus, laoreet eu libero a,
                    suscipit sagittis ante. Nulla at purus consequat libero
                    imperdiet efficitur quis quis orci. Aliquam felis orci,
                    pretium sit amet volutpat ac, bibendum eu velit. Vivamus
                    mollis, neque in aliquam malesuada, elit mi euismod velit,
                    ac sagittis metus enim aliquet elit. Quisque fringilla
                    sapien nec magna porta varius. Mauris bibendum, dui in
                    dapibus bibendum, ex sapien ultricies lacus, a eleifend
                    mauris erat sit amet purus.
                  </div>
                </div>
              </>
            )}
          </div>
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
              className="flex h-8 mb-2 items-center bg-purple-500 rounded-lg shadow-md border-black dark:border-white"
            >
              <PlusSmIcon className="w-8 text-white dark:text-black" />
              <div className="text-white mr-3 mt-1 font-bold">
                Create new fundraiser
              </div>
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
                  rowData={postMetadata}
                  columnDefs={makeOrgCauseColumnDefs({
                    onEditClick: onEdit,
                    onDeleteClick: onDelete
                  })}
                  pagination
                  paginationPageSize={20}
                />
              )}
            </div>
            {error && <Error message="An error occured. Please try again." />}
            <PublishCauseModal
              open={publishModalOpen}
              onClose={onPublishClose}
              publisher={profile}
            />
            <DeleteCauseModal
              open={deleteModalOpen}
              onClose={onDeleteClose}
              publisher={profile}
              id={currentDeleteId}
              postData={data}
              values={getFormDefaults(currentDeleteId)}
            />
            <ModifyCauseModal
              open={modifyModalOpen}
              onClose={onModifyClose}
              publisher={profile}
              id={currentModifyId}
              defaultValues={getFormDefaults(currentModifyId)}
            />
            <GoalModal
              open={GoalModalOpen}
              onClose={onGoalClose}
              publisher={profile}
            />
          </div>
        </Card>
      </GridItemTwelve>
    </GridLayout>
  )
}

export default OrganizationCauses
