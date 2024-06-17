import {
  PublicationStatsInput,
  RelayErrorFragment,
  RelaySuccessFragment
} from '@lens-protocol/client'
import { useSDK, useStorageUpload } from '@thirdweb-dev/react'
import { signTypedData } from '@wagmi/core'
import { useTranslation } from 'react-i18next'

import { config } from './config'
import getSignature from './getSignature'
import lensClient from './lensClient'

/**
 * Params for `createComment` returned by {@link useCreateComment}
 */
export interface CreateCommentParams {
  /**
   * The publication id of the publication to create the comment under
   */
  publicationId: string
  /**
   * The profile id of the profile creating the comment
   */
  profileId: string
  metadata: PublicationStatsInput
}

/**
 * Returned by the {@link useCreateComment} hook
 */
export interface CreateCommentReturn {
  /**
   *
   * @param params The {@link CreateCommentParams} for the request
   * @returns
   */
  createComment: (
    params: CreateCommentParams
  ) => Promise<RelayErrorFragment | RelaySuccessFragment>
}

/**
 * A hook that wraps {@link https://lens-protocol.github.io/lens-sdk/classes/_lens_protocol_client.Publication.html#createPostTypedData | createCommentTypedData}
 * to simplify to process of metadata upload with the thirdweb storage react hooks sdk,
 * signing, and broadcasting the transaction
 *
 * It is necessary to check authentication with {@link checkAuth} before running
 * createPost to prevent authentication errors
 *
 * @returns CreateCommentReturn
 */

const useCreateComment = (): CreateCommentReturn => {
  const { t: e } = useTranslation('common', {
    keyPrefix: 'errors'
  })

  const { mutateAsync: upload } = useStorageUpload()
  const sdk = useSDK()

  const createComment = async ({
    publicationId,
    //profileId,
    metadata
  }: CreateCommentParams) => {
    if (!sdk) throw new Error(e('metadata-upload-fail'))

    const contentURI = sdk.storage.resolveScheme(
      (await upload({ data: [metadata] }))[0]
    )

    if (!contentURI) throw new Error(e('metadata-upload-fail'))

    console.log(contentURI)

    const typedDataResult =
      await lensClient().publication.createOnchainCommentTypedData({
        commentOn: publicationId,
        contentURI
      })

    if (typedDataResult.isFailure()) {
      throw new Error(typedDataResult.error.message)
    }

    const signature = await signTypedData(
      config,
      getSignature(typedDataResult.value.typedData)
    )

    const broadcastResult = await lensClient().transaction.broadcastOnchain({
      id: typedDataResult.value.id,
      signature
    })

    if (broadcastResult.isFailure()) {
      throw new Error(broadcastResult.error.message)
    } else {
      return broadcastResult.value
    }
  }

  return { createComment }
}

export default useCreateComment
