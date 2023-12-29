import { create } from 'zustand'

export type PermissionItem = {
  value: string
  [key: string]: any
}

type PermissionStore = {
  permissions?: PermissionItem[]
  init: (payload: PermissionItem[]) => void
  reset: () => void
}

const initialState = {
  permissions: undefined
}

const usePermissionStore = create<PermissionStore>()(set => ({
  ...initialState,
  init: payload => set(() => ({ permissions: payload })),
  reset: () => set(initialState)
}))

export default usePermissionStore
