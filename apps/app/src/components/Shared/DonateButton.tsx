import {
  CollectModuleParams,
  MetadataAttributeInput,
  PostFragment,
  PublicationFragment,
  PublicationMainFocus,
  ReferenceModuleParams,
  RelayerResultFragment,
  RelayErrorFragment
} from '@lens-protocol/client'
import { PublicationMetadataV2Input } from '@lens-protocol/client'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { v4 } from 'uuid'

import { APP_NAME, CURRENCIES } from '@/constants'
import getTokenImage from '@/lib/getTokenImage'
import getUserLocale from '@/lib/getUserLocale'
import checkAuth from '@/lib/lens-protocol/checkAuth'
import createComment from '@/lib/lens-protocol/createComment'
import { getAttribute } from '@/lib/lens-protocol/getAttribute'
import lensClient from '@/lib/lens-protocol/lensClient'
import { PostTags } from '@/lib/types'
import { useAppPersistStore } from '@/store/app'

import ErrorModal from '../Dashboard/Modals/Error'
import { Button } from '../UI/Button'
import { Form } from '../UI/Form'
import { Input } from '../UI/Input'
import { Modal } from '../UI/Modal'
import { Spinner } from '../UI/Spinner'

interface Props {
  post: PostFragment
}

export interface IDonateFormProps {
  contribution: string
}

const DonateButton: FC<Props> = ({ post }) => {
  const { currentUser } = useAppPersistStore()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error>()
  const selectedCurrencySymbol =
    CURRENCIES[
      getAttribute(
        post.metadata.attributes,
        'currency'
      ) as keyof typeof CURRENCIES
    ].symbol

  const [currentContribution, setCurrentContribution] = useState<string>(
    getAttribute(post.metadata.attributes, 'contribution')
  )
  const [formContribution, setFormContribution] =
    useState<string>(currentContribution)

  const [currencyEnough, setCurrencyEnough] = useState<boolean>(false)

  const [currentPublication, setCurrentPublication] =
    useState<PublicationFragment>(post)

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
    // await apply(
    //   currentUser,
    //   formData.hoursToVerify,
    //   formData.comments,
    //   onCancel
    // )
  }

  const [_setIsLoading, setSetIsLoading] = useState<boolean>(false)
  const onSet = async () => {
    setError(undefined)
    setSetIsLoading(true)
    try {
      if (!currentUser) throw Error('Current user is null!')
      await checkAuth(currentUser.ownedBy)

      const attributes: MetadataAttributeInput[] = []

      const metadata: PublicationMetadataV2Input = {
        version: '2.0.0',
        metadata_id: v4(),
        content: `#${PostTags.Donate.SetAmount}`,
        locale: getUserLocale(),
        tags: [PostTags.Donate.SetAmount],
        mainContentFocus: PublicationMainFocus.TextOnly,
        name: `${PostTags.Donate.SetAmount} by ${currentUser?.handle} for publication ${post.id}`,
        attributes,
        appId: APP_NAME
      }

      const prevCollectModule = post.collectModule
      if (prevCollectModule.__typename !== 'FeeCollectModuleSettings') {
        throw Error('Improper publication collect module!')
      }

      const collectModule: CollectModuleParams = {
        feeCollectModule: {
          amount: {
            currency: prevCollectModule.amount.asset.address,
            value: formContribution
          },
          followerOnly: prevCollectModule.followerOnly,
          recipient: prevCollectModule.recipient,
          referralFee: prevCollectModule.referralFee
        }
      }

      const referenceModule: ReferenceModuleParams = {
        followerOnlyReferenceModule: false
      }

      const result = await createComment(
        post.id,
        currentUser,
        metadata,
        collectModule,
        referenceModule
      )

      const res: RelayerResultFragment | RelayErrorFragment = result.unwrap()

      if (res.__typename === 'RelayError') {
        throw Error(res.reason)
      }

      await lensClient().transaction.waitForIsIndexed(res.txId)

      const publication = await lensClient().publication.fetch({
        txHash: res.txHash
      })

      if (publication?.__typename !== 'Comment')
        throw Error('Incorrect publication type!')

      setCurrentPublication(publication)
      setCurrentContribution(formContribution)

      // console.log(publication.)
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    } finally {
      setSetIsLoading(false)
    }
  }

  const [run, setRun] = useState<boolean>(true)
  useEffect(() => {
    if (run) {
      form.setValue('contribution', currentContribution)
      setFormContribution(currentContribution)
      setRun(false)
    }
  }, [run])

  return (
    <>
      <Modal title="Donate" show={showModal} onClose={onCancel}>
        <div className="mx-12 mt-5">
          {!isLoading ? (
            <Form
              form={form}
              onSubmit={() => handleSubmit((data) => onSubmit(data))}
            >
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
                      message: 'Invalid amount'
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
                >
                  Set
                </Button>
              </div>
            </Form>
          ) : (
            <Spinner />
          )}

          {error && (
            <ErrorModal
              message={`An error occured: ${error.message}. Please try again.`}
            />
          )}
        </div>
        <div className="py-4 divider"></div>
        <div className="flex px-4 py-3 justify-between">
          <Button
            onClick={() => {
              console.log(
                'Donate',
                currentContribution,
                selectedCurrencySymbol,
                currentPublication
              )
            }}
            className={`${
              isLoading ? 'bg-gray-400 hover:bg-gray-400 !border-black' : ''
            } px-6 py-2 font-medium`}
            disabled={isLoading || currentContribution !== formContribution}
          >
            Donate
          </Button>
          <Button
            onClick={onCancel}
            variant="secondary"
            className="px-6 py-2 font-medium"
          >
            Cancel
          </Button>
        </div>
      </Modal>
      <Button
        onClick={() => {
          setShowModal(true)
        }}
      >
        Donate
      </Button>
    </>
  )
}

export default DonateButton
