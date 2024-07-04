import axios from 'axios'
import toast from 'react-hot-toast'

import { GOOD_API_URL } from '@/constants'

/**
 * Uploads the given data to Arweave.
 *
 * @param data The data to upload.
 * @returns The Arweave transaction ID.
 * @throws An error if the upload fails.
 */
const uploadToArweave = async (data: any): Promise<string> => {
  try {
    const upload = await axios.post(`${GOOD_API_URL}/metadata`, { ...data })
    const { id }: { id: string } = upload.data

    return id
  } catch {
    toast.error('Something went wrong')
    throw new Error('Something went wrong')
  }
}

export default uploadToArweave
