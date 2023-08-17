import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { PlusCircleIcon } from '@heroicons/react/outline'
import {
  PublicationsQueryRequest,
  PublicationTypes
} from '@lens-protocol/client'
import { AgGridReact } from 'ag-grid-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import GridRefreshButton from '@/components/Shared/GridRefreshButton'
import Progress from '@/components/Shared/Progress'
import { Card } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import i18n from '@/i18n'
import { lensClient, usePostData } from '@/lib/lens-protocol'
import {
  getOpportunityMetadata,
  isPost,
  OpportunityMetadata,
  PostTags
} from '@/lib/metadata'
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

interface OrgGridTab {
  name: string
  inactiveString: string
  filter: (data: OpportunityMetadata) => boolean
}

const keyPrefix = 'components.dashboard.organization.vhr'
const getTranslation = (key: string) => {
  return i18n.t(`common:${keyPrefix}.${key}`)
}

const organizationGridTabs: OrgGridTab[] = [
  {
    name: getTranslation('active-posting'),
    inactiveString: getTranslation('active-inactive'),
    filter: (p) => {
      const d = new Date()
      return (
        p.type === PostTags.OrgPublish.Opportunity &&
        (!p.endDate ||
          p.endDate > `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)
      )
    }
  },
  {
    name: getTranslation('drafts'),
    inactiveString: getTranslation('drafts-inactive'),
    filter: (p) => p.type === PostTags.OrgPublish.OpportunityDraft
  },
  {
    name: getTranslation('inactive'),
    inactiveString: getTranslation('inactive-inactive'),
    filter: (p) => {
      const d = new Date()
      return (
        p.type === PostTags.OrgPublish.Opportunity &&
        !!p.endDate &&
        p.endDate < `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      )
    }
  }
]

const OrganizationVHRTab: React.FC = () => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.organization.vhr'
  })
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })

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

  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [modifyModalOpen, setModifyModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [GoalModalOpen, setGoalModalOpen] = useState(false)
  const [currentModifyId, setCurrentModifyId] = useState('')
  const [currentDeleteId, setCurrentDeleteId] = useState('')

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
    if (profile) {
      const param: PublicationsQueryRequest = {
        metadata: { tags: { all: [PostTags.OrgPublish.VHRGoal] } },
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
  const [vhrGoal, setVhrGoal] = useState(0)

  const { isLoading, data: balanceData } = useWalletBalance(
    currentUser?.ownedBy ?? ''
  )

  const getHeight = () => {
    const data = postMetadata.filter(
      organizationGridTabs[selectedTabIndex].filter
    )

    if (data.length === 0) return '200px'
    else return '800px'
  }

  const getDisplayedGrid = () => {
    if (loading) return <Spinner />

    const data = postMetadata.filter(
      organizationGridTabs[selectedTabIndex].filter
    )

    if (data.length === 0)
      return (
        <div className="h-full w-full flex items-center justify-center">
          <p className="font-semibold text-center text-xl px-4 py-3 bg-zinc-200 dark:bg-purple-900 text-brand-500 dark:text-brand-200 shadow-sm shadow-zinc-400 dark:shadow-none">
            {organizationGridTabs[selectedTabIndex].inactiveString}
          </p>
        </div>
      )

    return (
      <AgGridReact
        defaultColDef={defaultColumnDef}
        rowData={data}
        columnDefs={makeOrgVHRColumnDefs({
          onEditClick: onEdit,
          onDeleteClick: onDelete
        })}
        pagination
        paginationPageSize={20}
      />
    )
  }

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
                    VHR raised {vhrGoal !== 0 && `out of ${vhrGoal}`}
                  </div>
                </div>
                <Link
                  href=""
                  className="text-brand-500 hover:text-brand-600 mt-6 ml-10"
                  onClick={onGoalOpen}
                  suppressHydrationWarning
                >
                  {t('set-goal')}
                </Link>
                {vhrGoal !== 0 && (
                  <Progress
                    progress={Number(balanceData?.value)}
                    total={vhrGoal}
                    className="mt-10 mb-10"
                  />
                )}
                <div
                  className="text-2xl font-bold text-black dark:text-white sm:text-4xl"
                  suppressHydrationWarning
                >
                  {t('our-cause')}
                </div>
                <div className=" w-full lg:flex mt-5">
                  <div className="border-r border-b border-l  p-5 lg:border-l-0 lg:border-t dark:border-Card bg-accent-content dark:bg-Within dark:bg-opacity-10 dark:text-sky-100 rounded-b lg:rounded-b-none lg:rounded-r  flex flex-col justify-between leading-normal w-full">
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

          <div className="px-5">
            <div className="flex items-center">
              {organizationGridTabs.map((v, i) => {
                return (
                  <p
                    key={i}
                    onClick={() => setSelectedTabIndex(i)}
                    className="px-3 cursor-pointer bg-white border border-zinc-400 dark:bg-brand-400"
                  >
                    {v.name}
                  </p>
                )
              })}
              <GridRefreshButton onClick={refetch} className="ml-auto" />
              <button
                onClick={onNew}
                className="flex items-center text-brand-400 mx-4"
              >
                <span className="mr-2 mt-1 font-bold">{t('create-new')}</span>
                <PlusCircleIcon className="w-8 text-brand-400" />
              </button>
            </div>
            <div
              className={gridTheme}
              style={{ height: getHeight(), width: '100%' }}
            >
              {getDisplayedGrid()}
            </div>
            {error && <Error message={e('generic')} />}
          </div>
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
        </Card>
      </GridItemTwelve>
    </GridLayout>
  )
}

export default OrganizationVHRTab
