import { RelayErrorFragment, RelaySuccessFragment } from '@lens-protocol/client'
import { TextOnlyMetadata } from '@lens-protocol/metadata'
import { signTypedData } from '@wagmi/core'
import { useTranslation } from 'react-i18next'
import { useConfig } from 'wagmi'

import uploadToArweave from '../metadata/UploadToArweave'
import getSignature from './getSignature'
import lensClient from './lensClient'

/**
 * Params for `createPost` returned by {@link useCreatePost}
 */
export interface CreatePostParams {
  profileId: string //this is unused, not sure where it would go
  metadata: TextOnlyMetadata
}

/**
 * Returned by the {@link useCreatePost} hook
 */
export interface CreatePostReturn {
  /**
   *
   * @param params The {@link CreatePostParams} for the request
   * @returns
   */
  createPost: (
    params: CreatePostParams
  ) => Promise<RelayErrorFragment | RelaySuccessFragment>
}
/**
 * A hook that wraps createPostTypedData {@link https://lens-protocol.github.io/lens-sdk/classes/_lens_protocol_client.Publication.html#createPostTypedData}
 * to simplify to process of metadata upload with the thirdweb storage react hooks sdk,
 * signing, and broadcasting the transaction
 *
 * It is necessary to check authentication with {@link checkAuth} before running
 * createPost to prevent authentication errors
 *
 * @returns the result from broadcasting the transaction
 */

const useCreatePost = (): CreatePostReturn => {
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })
  const config = useConfig()
  const createPost = async ({ metadata }: CreatePostParams) => {
    const contentURI = `https://arweave.net/${await uploadToArweave(metadata)}`

    if (!contentURI) throw new Error(e('metadata-upload-fail'))

    console.log(contentURI)

    const typedDataResult =
      await lensClient().publication.createOnchainPostTypedData({
        contentURI
      })

    if (typedDataResult.isFailure()) {
      console.error(typedDataResult.error)
      throw new Error(typedDataResult.error.message)
    }
    const data = typedDataResult.value
    const signature = await signTypedData(
      config,
      getSignature(typedDataResult.value.typedData)
    )

    const broadcastResult = await lensClient().transaction.broadcastOnchain({
      id: data.id,
      signature
    })

    if (broadcastResult.isFailure()) {
      console.error(broadcastResult.error)
      throw new Error(broadcastResult.error.message)
    } else {
      return broadcastResult.value
    }
  }

  return { createPost }
}

export default useCreatePost
