import { PencilIcon } from '@heroicons/react/outline'
import { ProfileFragment } from '@lens-protocol/client'
import { signMessage, signTypedData } from '@wagmi/core'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { polygon, polygonMumbai } from 'wagmi/chains'

import { Button } from '@/components/UI/Button'
import { ErrorMessage } from '@/components/UI/ErrorMessage'
import { Form } from '@/components/UI/Form'
import { Input } from '@/components/UI/Input'
import { Spinner } from '@/components/UI/Spinner'
import { IS_MAINNET } from '@/constants'
import getSignature from '@/lib/lens-protocol/getSignature'
import lensClient from '@/lib/lens-protocol/lensClient'

interface FormProps {
  contractAddress: string
  tokenId: string
}

interface Props {
  profile: ProfileFragment | undefined
}

const NFTPicture: FC<Props> = ({ profile }) => {
  const form = useForm<FormProps>()
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = form

  const { t } = useTranslation('common')
  const [chainId, setChainId] = useState<number>(
    IS_MAINNET ? polygon.id : polygonMumbai.id
  )

  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState<boolean>()

  const setAvatar = async (contractAddress: string, tokenId: string) => {
    setIsLoading(true)
    try {
      const result = await lensClient().nfts.ownershipChallenge({
        ethereumAddress: profile?.ownedBy ?? '',
        nfts: [
          {
            tokenId,
            contractAddress,
            chainId
          }
        ]
      })

      const _signature = await signMessage({
        message: result.unwrap().text
      })

      const typedDataResult =
        await lensClient().profile.createSetProfileImageURITypedData({
          profileId: profile?.id ?? '',
          nftData: {
            id: result.unwrap().id,
            signature: _signature
          }
        })

      const signature = await signTypedData(
        getSignature(typedDataResult.unwrap().typedData)
      )

      const broadcastResult = await lensClient().transaction.broadcast({
        id: typedDataResult.unwrap().id,
        signature: signature
      })

      return broadcastResult
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    }
    setIsLoading(false)
  }

  return (
    <Form
      form={form}
      className="space-y-4"
      onSubmit={() => {
        handleSubmit((data) => {
          setAvatar(data.contractAddress, data.tokenId)
        })
      }}
    >
      {error && (
        <ErrorMessage
          className="mb-3"
          title="Transaction failed!"
          error={error}
        />
      )}
      <div>
        <div className="label">{t('Chain')}</div>
        <div>
          <select
            className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
            onChange={(e) => setChainId(parseInt(e.target.value))}
            value={chainId}
          >
            <option value={IS_MAINNET ? polygon.id : polygonMumbai.id}>
              {IS_MAINNET ? 'Polygon' : 'Mumbai'}
            </option>
          </select>
        </div>
      </div>
      <Input
        label={t('Contract address')}
        type="text"
        placeholder="0x277f5959e22f94d5bd4c2cc0a77c4c71f31da3ac"
        error={!!errors.contractAddress?.type}
        value={
          profile?.picture?.__typename === 'NftImage'
            ? profile?.picture?.contractAddress
            : undefined
        }
        {...register('contractAddress', {
          required: true,
          pattern: {
            value: /^0x[a-fA-F0-9]{40}$/,
            message: 'Invalid Ethereum address'
          }
        })}
      />
      <Input
        label={t('Token Id')}
        type="text"
        placeholder="1"
        error={!!errors.tokenId?.type}
        value={
          profile?.picture?.__typename === 'NftImage'
            ? profile?.picture?.tokenId
            : undefined
        }
        {...(register('tokenId'),
        {
          required: true
        })}
      />

      <div className="flex flex-col space-y-2">
        <Button
          className="ml-auto"
          type="submit"
          disabled={isLoading}
          icon={
            isLoading ? (
              <Spinner size="xs" />
            ) : (
              <PencilIcon className="w-4 h-4" />
            )
          }
        >
          {t('Save')}
        </Button>
      </div>
    </Form>
  )
}

export default NFTPicture
