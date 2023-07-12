import Arweave from 'arweave'
import { ARWEAVE_KEY } from 'src/constants'

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
  timeout: 20000,
  logging: false
})

const uploadToArweave = async (data: any) => {
  const transaction = await arweave.createTransaction({
    data: JSON.stringify(data)
  })

  transaction.addTag('Content-Type', 'application/json')

  await arweave.transactions.sign(transaction, JSON.parse(ARWEAVE_KEY ?? ''))

  await arweave.transactions.post(transaction)

  return transaction.id
}

export default uploadToArweave
