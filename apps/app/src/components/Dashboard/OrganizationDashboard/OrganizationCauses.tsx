import { PlusSmIcon } from '@heroicons/react/outline'
import {
  PublicationsQueryRequest,
  PublicationTypes
} from '@lens-protocol/client'
import { AgGridReact } from 'ag-grid-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import Progress from '@/components/Shared/Progress'
import { Card } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import lensClient from '@/lib/lens-protocol/lensClient'
import useEnabledCurrencies from '@/lib/lens-protocol/useEnabledCurrencies'
import usePostData from '@/lib/lens-protocol/usePostData'
import { CauseMetadata, isPost } from '@/lib/metadata'
import { PostTags } from '@/lib/metadata'
import { getCauseMetadata } from '@/lib/metadata'
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
    if (profile) {
      const param: PublicationsQueryRequest = {
        metadata: { tags: { all: [PostTags.OrgPublish.Goal] } },
        profileId: profile.id,
        publicationTypes: [PublicationTypes.Post]
      }

      lensClient()
        .publication.fetchAll(param)
        .then((data) => {
          setVhrGoal(
            parseFloat(
              data.items[0] && isPost(data.items[0])
                ? data.items[0].metadata.attributes[0]?.value ?? '0'
                : '0'
            )
          )
        })
    }
  }, [profile])

  const { currentUser } = useAppPersistStore()
  const { isLoading: isBalanceLoading, data: balanceData } = useWalletBalance(
    currentUser?.ownedBy ?? ''
  )

  const { data: currencyData, error: currencyError } = useEnabledCurrencies(
    currentUser?.ownedBy
  )

  useEffect(() => {
    if (currencyError) {
      toast.error(currencyError.message)
    }
  }, [currencyError])

  const [vhrGoal, setVhrGoal] = useState(0)

  const getFormDefaults = (id: string): IPublishCauseFormProps => {
    const d = postMetadata.find((val) => val?.id === id)

    const [country, province, city] = d?.location.split('-', 3) ?? ['', '', '']

    return d
      ? {
          name: d.name ?? '',
          goal: d.goal ?? '',
          contribution: d.contribution ?? '',
          category: d.category ?? '',
          description: d.description ?? '',
          currency: d.currency ?? '',
          recipient: d.recipient ?? '',
          imageUrl: d.imageUrl ?? '',
          country,
          province,
          city
        }
      : { ...emptyPublishFormData }
  }

  return (
    <GridLayout>
      <GridItemTwelve>
        <Card>
          <div className="p-10 m-10">
            {loading || isBalanceLoading ? (
              <Spinner />
            ) : (
              <>
                <div className="flex items-center">
                  <div className="text-3xl font-extrabold text-purple-500 dark:text-white sm:text-7xl pr-3">
                    {Number(balanceData?.value)}
                  </div>
                  <div className="text-2xl font-bold text-black dark:text-white sm:text-4xl mt-8">
                    VHR raised {vhrGoal !== 0 && `out of ${vhrGoal}`}
                  </div>
                </div>
                <Link
                  href=""
                  className="text-brand-500 hover:text-brand-600 mt-6"
                  onClick={onGoalOpen}
                >
                  Set a goal
                </Link>

                {vhrGoal !== 0 && (
                  <Progress
                    progress={Number(balanceData?.value)}
                    total={vhrGoal}
                    className="mt-10"
                  />
                )}

                <div className="text-2xl mt-10 font-bold text-black dark:text-white sm:text-4xl">
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
                Create new project
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
              currencyData={currencyData}
            />
            <DeleteCauseModal
              open={deleteModalOpen}
              onClose={onDeleteClose}
              publisher={profile}
              id={currentDeleteId}
              postData={data}
              values={getFormDefaults(currentDeleteId)}
              currencyData={currencyData}
            />
            <ModifyCauseModal
              open={modifyModalOpen}
              onClose={onModifyClose}
              publisher={profile}
              id={currentModifyId}
              currencyData={currencyData}
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
