import {
  CommentFragment,
  LegacyFeeCollectModuleSettingsFragment,
  MetadataAttributeType,
  PostFragment,
  ReferenceModuleInput
} from '@lens-protocol/client'
import { CollectActionModuleInput } from '@lens-protocol/client'
import { textOnly, TextOnlyMetadata } from '@lens-protocol/metadata'
import { signTypedData } from '@wagmi/core'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { v4 } from 'uuid'

import Progress from '@/components/Shared/Progress'
import { APP_NAME, CURRENCIES } from '@/constants'
import getTokenImage from '@/lib/getTokenImage'
import getUserLocale from '@/lib/getUserLocale'
import {
  checkAuth,
  getSignature,
  lensClient,
  useCreateComment
} from '@/lib/lens-protocol'
import { CauseMetadata, isComment, isPost, PostTags } from '@/lib/metadata'
import { useAppPersistStore } from '@/store/app'

import { config } from '../config'
import ErrorModal from '../Dashboard/Modals/Error'
import { Button } from '../UI/Button'
import { Form } from '../UI/Form'
import { Input } from '../UI/Input'
import { Modal } from '../UI/Modal'
import { Spinner } from '../UI/Spinner'
import Uniswap from './Uniswap'

/**
 * Properties of {@link DonateButton}
 */
export interface DonateButtonProps {
  /**
   * Original post that is being donated to
   */
  post: PostFragment
  /**
   * Metadata object of cause that is being donated to
   */
  cause: CauseMetadata
  /**
   * Size of button being rendered
   */
  size?: 'lg' | 'sm' | 'md'
  /**
   * Class names and tailwind styles passed to the component
   */
  className?: string
}

export interface IDonateFormProps {
  contribution: string
}

/**
 * Component that displays a button to open a modal to donate to a cause
 *
 * This component handles fetching total contributions from original post
 * and comments, fetches currency data such as symbols, and swapping currency
 * with Uniswap
 *
 * Total contribution amounts are calculated by fetching the number of collects
 * on a post or comment and multiplying by its contribution amount. This
 * calculation works because contribution amounts on publication posts are
 * immutable.
 *
 * The donate modal sets the contribution amount as the default set by the
 * original cause post, and new amounts are set by creating new comments
 * copying the details of the original post and only modifying the amount
 * in the collect module. Their amounts are later fetched and added to the
 * total during calculation of total contribution amount.
 */
const DonateButton: FC<DonateButtonProps> = ({
  post,
  cause,
  size,
  className
}) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.shared.donate-button'
  })
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })
  const { createComment } = useCreateComment()

  const { currentUser } = useAppPersistStore()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [error, setError] = useState<Error>()
  const selectedCurrencySymbol =
    CURRENCIES[cause.currency as keyof typeof CURRENCIES].symbol

  const [currentContribution, setCurrentContribution] = useState<string>(
    cause.contribution
  )

  const [formContribution, setFormContribution] =
    useState<string>(currentContribution)

  const [currencyEnough, setCurrencyEnough] = useState<boolean>(false)

  const [currentPublication, setCurrentPublication] = useState<
    PostFragment | CommentFragment
  >(post)

  const form = useForm<IDonateFormProps>()

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors }
  } = form

  const onCancel = () => {
    reset()
    setError(undefined)
    setRun(true)
    setShowModal(false)
  }

  const onSubmit = async (formData: IDonateFormProps) => {
    setError(undefined)
  }

  const getBalance = async () => {
    setCheckBalanceLoading(true)
    try {
      if (!currentUser) throw Error(e('user-null'))
      if (!isPost(currentPublication) && !isComment(currentPublication))
        throw Error(e('incorrect-publication-type'))
      if (
        (currentPublication.openActionModules as unknown as LegacyFeeCollectModuleSettingsFragment['__typename']) !==
        'LegacyFeeCollectModuleSettings'
      )
        throw Error(e('incorrect-collect-module'))

      const balance = await getBalance()

      const currPubAmount =
        currentPublication.openActionModules as unknown as LegacyFeeCollectModuleSettingsFragment['amount']
      setCurrencyEnough(
        parseFloat('${balance}') > parseFloat(currPubAmount.value)
      )
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    } finally {
      setCheckBalanceLoading(false)
    }
  }

  useEffect(() => {
    getBalance()
  }, [currentContribution])

  const currPostAmount =
    post.openActionModules as unknown as LegacyFeeCollectModuleSettingsFragment['amount']
  const [_setIsLoading, setSetIsLoading] = useState<boolean>(false)
  const onSet = async () => {
    setError(undefined)
    setSetIsLoading(true)
    try {
      // check if collect amount is original amount
      if (
        (post.openActionModules as unknown as LegacyFeeCollectModuleSettingsFragment['__typename']) !==
        'LegacyFeeCollectModuleSettings'
      )
        throw e('incorrect-collect-module')
      if (parseFloat(formContribution) === parseFloat(currPostAmount.value)) {
        setCurrentPublication(post)
        setCurrentContribution(formContribution)
        return
      }

      // check if comment with collect amount exists
      let hasAmount = false

      const comments = await lensClient().publication.fetchAll({
        where: {
          commentOn: {
            id: post.id
          },
          metadata: {
            tags: {
              all: [PostTags.Donate.SetAmount]
            }
          }
        }
      })

      comments.items
        .filter((comment) => !comment.isHidden)
        .every((comment) => {
          if (
            isComment(comment) &&
            (comment.openActionModules as unknown as LegacyFeeCollectModuleSettingsFragment['__typename']) ===
              'LegacyFeeCollectModuleSettings' &&
            parseFloat(
              (
                comment.openActionModules as unknown as LegacyFeeCollectModuleSettingsFragment['amount']
              ).value
            ) === parseFloat(formContribution)
          ) {
            hasAmount = true
            setCurrentPublication(comment)
            setCurrentContribution(formContribution)
            return false
          }
        })

      if (hasAmount) {
        return
      }

      // create comment with new collect amount
      if (!currentUser) throw Error(e('user-null'))
      await checkAuth(currentUser.ownedBy.address)

      const attributes: MetadataAttributeType[] = []

      const metadata: TextOnlyMetadata = textOnly({
        marketplace: {
          name: `${PostTags.Donate.SetAmount} by ${currentUser?.handle} for publication ${post.id}`
        },
        id: v4(),
        content: `#${PostTags.Donate.SetAmount}`,
        locale: getUserLocale(),
        tags: [PostTags.Donate.SetAmount],
        attributes: [],
        appId: APP_NAME
      })

      const prevCollectModule =
        post.openActionModules as unknown as LegacyFeeCollectModuleSettingsFragment
      if (prevCollectModule.__typename !== 'LegacyFeeCollectModuleSettings') {
        throw Error(e('incorrect-collect-module'))
      }

      const collectModule: CollectActionModuleInput = {
        simpleCollectOpenAction: {
          amount: {
            currency: prevCollectModule.amount.asset.contract.address,
            value: formContribution
          },
          followerOnly: prevCollectModule.followerOnly,
          recipient: prevCollectModule.recipient,
          referralFee: prevCollectModule.referralFee
        }
      }

      const referenceModule: ReferenceModuleInput = {
        followerOnlyReferenceModule: false
      }

      const result = await createComment({
        publicationId: post.id,
        profileId: currentUser.id,
        metadata
      })

      //const txHash = await lensClient().transaction.txIdToTxHash(result)

      const publication = await lensClient().publication.fetch({
        forTxHash: post.txHash
      })

      if (!publication || !isComment(publication))
        throw Error(e('incorrect-publication-type'))

      setCurrentPublication(publication)
      setCurrentContribution(formContribution)
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    } finally {
      setSetIsLoading(false)
    }
  }

  const [donateIsLoading, setDonateIsLoading] = useState<boolean>(false)
  const onDonate = async () => {
    setError(undefined)
    setDonateIsLoading(true)
    try {
      if (!currentUser) throw Error(e('user-null'))
      await checkAuth(currentUser.ownedBy.address)

      const typedDataResult =
        await lensClient().publication.createLegacyCollectTypedData({
          on: currentPublication.id
        })

      const signature = await signTypedData(
        config,
        getSignature(typedDataResult.unwrap().typedData)
      )

      const broadcastResult = await lensClient().transaction.broadcastOnchain({
        id: typedDataResult.unwrap().id,
        signature: signature
      })

      return broadcastResult
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    } finally {
      setDonateIsLoading(false)
    }
  }

  const [totalDonatedIsLoading, setTotalDonatedIsLoading] =
    useState<boolean>(false)
  const [totalDonated, setTotalDonated] = useState<number>(0)
  const getTotalDonated = async () => {
    setError(undefined)
    setTotalDonatedIsLoading(true)
    try {
      let total = 0

      const publication = await lensClient().publication.fetch({
        forId: post.id
      })

      if (publication === null || !isPost(publication))
        throw Error(e('incorrect-publication-type'))
      if (
        (publication.openActionModules as unknown as LegacyFeeCollectModuleSettingsFragment['__typename']) !==
        'LegacyFeeCollectModuleSettings'
      )
        throw Error(e('incorrect-collect-module'))

      total +=
        publication.stats.collects *
        parseFloat(
          (
            publication.openActionModules as unknown as LegacyFeeCollectModuleSettingsFragment['amount']
          ).value
        )

      // get comment totals
      const comments = await lensClient().publication.fetchAll({
        where: {
          commentOn: {
            id: post.id
          },
          metadata: {
            tags: {
              all: [PostTags.Donate.SetAmount]
            }
          }
        }
      })

      comments.items
        .filter((comment) => !comment.isHidden)
        .forEach((comment) => {
          if (
            isComment(comment) &&
            (comment.openActionModules as unknown as LegacyFeeCollectModuleSettingsFragment['__typename']) ===
              'LegacyFeeCollectModuleSettings'
          )
            total +=
              comment.stats.collects *
              parseFloat(
                (
                  comment.openActionModules as unknown as LegacyFeeCollectModuleSettingsFragment['amount']
                ).value
              )
        })

      setTotalDonated(total)
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    } finally {
      setTotalDonatedIsLoading(false)
    }
  }

  useEffect(() => {
    getTotalDonated()
  }, [totalDonated])

  const [run, setRun] = useState<boolean>(true)
  useEffect(() => {
    if (run) {
      form.setValue('contribution', currentContribution)
      setFormContribution(currentContribution)
      setRun(false)
    }
  }, [run])

  const [checkBalanceLoading, setCheckBalanceLoading] = useState<boolean>(false)

  return (
    <>
      <Modal size="lg" title="Donate" show={showModal} onClose={onCancel}>
        <div className="mx-12 mt-5">
          <Form
            form={form}
            onSubmit={() => handleSubmit((data) => onSubmit(data))}
          >
            <div className="flex flex-row ">
              <div
                className="text-purple-500 text-5xl font-bold"
                suppressHydrationWarning
              >
                {t('donate-to')} {cause.name}
              </div>
            </div>
            <div className="text-gray-500  mt-2 text-2xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 dark:from-brand-400 to-pink-600 dark:to-pink-400 text-2xl">
                {`@${post.by.handle}`}
              </span>
            </div>
            {totalDonatedIsLoading ? (
              <Spinner className="my-4" />
            ) : (
              <div>
                <Progress
                  progress={totalDonated}
                  total={parseFloat(cause.goal)}
                  className="my-4"
                />
                <div
                  className="flex flex-row font-semibold mb-6"
                  suppressHydrationWarning
                >
                  <div className="mr-3 text-purple-600 font-semibold">
                    {totalDonated} {selectedCurrencySymbol}
                  </div>
                  {t('raised-of')} {cause.goal}!
                  {/* Will need to change sentence structure for 简体中文 locale */}
                </div>
              </div>
            )}
            <div className="flex items-end space-x-4">
              <Input
                label="Contribution"
                type="number"
                step="0.0001"
                min="0"
                max="100000"
                prefix={
                  <img
                    className="w-6 h-6"
                    height={24}
                    width={24}
                    src={getTokenImage(selectedCurrencySymbol)}
                    alt={selectedCurrencySymbol}
                  />
                }
                placeholder="5"
                defaultValue={currentContribution}
                error={!!errors.contribution?.type}
                {...register('contribution', {
                  required: true,
                  min: {
                    value: 1,
                    message: t('invalid-amount')
                  }
                })}
                onChange={(e) => {
                  setFormContribution(e.target.value)
                }}
              />
              <Button
                className="h-10"
                icon={_setIsLoading && <Spinner size="sm" />}
                disabled={
                  currentContribution === formContribution || _setIsLoading
                }
                onClick={onSet}
                suppressHydrationWarning
              >
                {t('set')}
              </Button>
            </div>
            {!currencyEnough && (
              <div className="flex justify-between mt-4">
                <Uniswap
                  module={
                    (currentPublication.openActionModules as unknown as LegacyFeeCollectModuleSettingsFragment['__typename']) ===
                    'LegacyFeeCollectModuleSettings'
                      ? (currentPublication.openActionModules as unknown as LegacyFeeCollectModuleSettingsFragment)
                      : undefined
                  }
                />
                <Button
                  size="sm"
                  icon={checkBalanceLoading && <Spinner size="sm" />}
                  disabled={checkBalanceLoading}
                  onClick={getBalance}
                  suppressHydrationWarning
                >
                  {t('check-balance')}
                </Button>
              </div>
            )}
          </Form>
          {error && (
            <ErrorModal
              message={`${t('error-occurred')}: ${error.message}. ${t(
                'try-again'
              )}.`}
            />
          )}
        </div>
        <div className="py-4 custom-divider"></div>
        <div className="flex px-4 py-3 justify-between">
          <Button
            onClick={onDonate}
            icon={donateIsLoading && <Spinner size="sm" />}
            className={`${
              donateIsLoading
                ? 'bg-gray-400 hover:bg-gray-400 !border-black'
                : ''
            } px-6 py-2 font-medium`}
            disabled={
              donateIsLoading ||
              currentContribution !== formContribution ||
              !currencyEnough
            }
            suppressHydrationWarning
          >
            {t('donate')}
          </Button>
          <Button
            onClick={onCancel}
            variant="secondary"
            className="px-6 py-2 font-medium"
            suppressHydrationWarning
          >
            {t('cancel')}
          </Button>
        </div>
      </Modal>
      <Button
        onClick={() => {
          setShowModal(true)
        }}
        size={size}
        className={className}
        suppressHydrationWarning
        disabled={totalDonated >= parseFloat(cause.goal)}
      >
        {t('donate')}
      </Button>
    </>
  )
}

export default DonateButton
