import { createConfig, http } from 'wagmi'
import { polygon, polygonAmoy } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

import { IS_MAINNET } from '@/constants'

export const config = createConfig({
  chains: [IS_MAINNET ? polygon : polygonAmoy],
  connectors: [injected()],
  transports: {
    [polygon.id]: http(),
    [polygonAmoy.id]: http()
  }
})
