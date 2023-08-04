import type { NextApiRequest, NextApiResponse } from 'next'

type Data = string

interface Response {
  status: number
  data: string
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<Data>
) {
  const https = require('https')
  let query = Object.entries(request.query)
  query.shift()
  let url = request.query.url
  query.forEach((entry) => {
    url += '&' + entry[0] + '=' + entry[1]
  })

  const { status, data } = await getRequest(url)

  response.status(status).send(data)

  function getRequest(url: string | string[] | undefined) {
    return new Promise<Response>((resolve) => {
      const options = {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
        }
      }

      const req = https.get(
        url,
        options,
        (resp: {
          on: (
            arg0: string,
            arg1: { (): void } | { (chunk: string): void }
          ) => void
          statusCode: any
        }) => {
          let data = ''
          resp.on('data', (chunk: string) => {
            data += chunk
          })
          resp.on('end', () => {
            resolve({
              status: resp.statusCode,
              data: data
            })
          })
        }
      )
    })
  }
}
