import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { PlusSmIcon } from '@heroicons/react/solid'
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
import Progress from '@/components/Shared/Progress'
import { Card } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import lensClient from '@/lib/lens-protocol/lensClient'
import usePostData from '@/lib/lens-protocol/usePostData'
import { isPost, OpportunityMetadata } from '@/lib/metadata'
import { PostTags } from '@/lib/metadata'
import { getOpportunityMetadata } from '@/lib/metadata'
import { useWalletBalance } from '@/lib/useBalance'
import { useAppPersistStore } from '@/store/app'

import DeleteOpportunityModal from '../Modals/DeleteOpportunityModal'
import Error from '../Modals/Error'
import ModifyOpportunityModal from '../Modals/ModifyOpportunityModal'
import PublishOpportunityModal, {
  emptyPublishFormData,
  IPublishOpportunityFormProps
} from '../Modals/PublishOpportunityModal'
import VHRGoalModal from '../Modals/VHRGoalModal'
import { defaultColumnDef, makeOrgVHRColumnDefs } from './ColumnDefs'

const OrganizationVHRTab: React.FC = () => {
  const { currentUser: profile } = useAppPersistStore()
  const { resolvedTheme } = useTheme()
  const [gridTheme, setGridTheme] = useState<string>()

  const { data, error, loading, refetch } = usePostData({
    profileId: profile?.id,
    metadata: {
      tags: { all: [PostTags.OrgPublish.Opportunity] }
    }
  })

  const [postMetadata, setPostMetadata] = useState<OpportunityMetadata[]>([])

  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [modifyModalOpen, setModifyModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [GoalModalOpen, setGoalModalOpen] = useState(false)
  const [currentModifyId, setCurrentModifyId] = useState('')
  const [currentDeleteId, setCurrentDeleteId] = useState('')
  const [postdata, setpostdata] = useState<PublicationFragment[]>([])

  const onPublishClose = (shouldRefetch: boolean) => {
    setPublishModalOpen(false)

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
  const onGoalClose = (shouldRefetch: boolean) => {
    setGoalModalOpen(false)

    if (shouldRefetch) {
      refetch()
    }
  }
  const onGoalOpen = () => {
    setGoalModalOpen(true)
  }
  const onNew = () => {
    setPublishModalOpen(true)
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
    setGridTheme(
      resolvedTheme === 'light' ? 'ag-theme-alpine' : 'ag-theme-alpine-dark'
    )
  }, [resolvedTheme])
  useEffect(() => {
    const param: PublicationsQueryRequest = {
      metadata: { tags: { all: [PostTags.OrgPublish.VHRGoal] } },
      profileId: profile!.id,
      publicationTypes: [PublicationTypes.Post]
    }

    lensClient()
      .publication.fetchAll(param)
      .then((data) => {
        setpostdata(data.items)
      })
  }, [profile])
  useEffect(() => {
    setPostMetadata(getOpportunityMetadata(data))
  }, [data])

  const getFormDefaults = (id: string): IPublishOpportunityFormProps => {
    const d = postMetadata.find((val) => val?.id === id)

    return d
      ? {
          name: d.name ?? '',
          startDate: d.startDate ?? '',
          endDate: d.endDate ?? '',
          hoursPerWeek: d.hoursPerWeek ?? '',
          category: d.category ?? '',
          website: d.website ?? '',
          description: d.description ?? '',
          imageUrl: d.imageUrl ?? ''
        }
      : { ...emptyPublishFormData }
  }

  const { currentUser } = useAppPersistStore()
  const [vhrGoal] = useState(600) // use hardcoded goal for now

  const { isLoading, data: balanceData } = useWalletBalance(
    currentUser?.ownedBy ?? ''
  )
  return (
    <GridLayout>
      <GridItemTwelve>
        <Card>
          <div className="p-10 m-10">
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                <div className="flex items-center">
                  <div className="text-3xl font-extrabold text-purple-500 dark:text-white sm:text-7xl pl-10 pr-3">
                    {Number(balanceData?.value)}
                  </div>
                  <div className="text-2xl font-bold text-black dark:text-white sm:text-4xl mt-8">
                    VHR raised out of{' '}
                    {postdata[0] && isPost(postdata[0])
                      ? postdata[0].metadata.attributes[0]?.value
                      : ' '}
                  </div>
                </div>
                <Link
                  href=""
                  className="text-brand-500 hover:text-brand-600 mt-6 ml-10"
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
                  <div className="border-r border-b border-l  p-5 lg:border-l-0 lg:border-t dark:border-Card bg-teal-50 dark:bg-Within dark:bg-opacity-10 dark:text-sky-100 rounded-b lg:rounded-b-none lg:rounded-r  flex flex-col justify-between leading-normal w-full">
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

          <div className="p-5">
            <button
              onClick={onNew}
              className="flex h-8 mb-2 items-center bg-purple-500 rounded-lg shadow-md border-black dark:border-white"
            >
              <PlusSmIcon className="w-8 text-white" />
              <div className="text-white mr-3 mt-1 font-bold">
                Create new opportunity
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
                  columnDefs={makeOrgVHRColumnDefs({
                    onEditClick: onEdit,
                    onDeleteClick: onDelete
                  })}
                  pagination
                  paginationPageSize={20}
                />
              )}
            </div>
            {error && <Error message="An error occured. Please try again." />}
            <PublishOpportunityModal
              open={publishModalOpen}
              onClose={onPublishClose}
              publisher={profile}
            />
            <ModifyOpportunityModal
              open={modifyModalOpen}
              onClose={onModifyClose}
              publisher={profile}
              id={currentModifyId}
              defaultValues={getFormDefaults(currentModifyId)}
            />
            <DeleteOpportunityModal
              open={deleteModalOpen}
              onClose={onDeleteClose}
              publisher={profile}
              id={currentDeleteId}
              postData={data}
              values={getFormDefaults(currentDeleteId)}
            />
            <VHRGoalModal
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

export default OrganizationVHRTab
