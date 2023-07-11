/* eslint-disable no-unused-vars */
import { Profile } from '@lens-protocol/react-web'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  profiles: Profile[] | []
  setProfiles: (profiles: Profile[]) => void
  userSigNonce: number
  setUserSigNonce: (userSigNonce: number) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  profiles: [],
  setProfiles: (profiles) => set(() => ({ profiles })),
  userSigNonce: 0,
  setUserSigNonce: (userSigNonce) => set(() => ({ userSigNonce }))
}))

interface AppPersistState {
  isConnected: boolean
  setIsConnected: (isConnected: boolean) => void
  isAuthenticated: boolean
  setIsAuthenticated: (isAuthenticated: boolean) => void
  currentUser: Profile | null
  setCurrentUser: (currentUser: Profile | null) => void
}

export const useAppPersistStore = create(
  persist<AppPersistState>(
    (set) => ({
      isConnected: false,
      setIsConnected: (isConnected) => set(() => ({ isConnected })),
      isAuthenticated: false,
      setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),
      currentUser: null,
      setCurrentUser: (currentUser) => set(() => ({ currentUser }))
    }),
    { name: 'bcharity.store' }
  )
)
