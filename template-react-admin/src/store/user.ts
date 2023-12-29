import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { STORAGE_USERINFO } from '@/constants'

type UserInfo = {
  /** 用户名 */
  username: string
  /** 令牌 */
  accessToken: string
}

type UserStore = {
  /** 用户基本信息 */
  userInfo?: UserInfo
  /** 设置用户基本信息 */
  init: (payload: UserInfo) => void
  reset: () => void
}

const initialState = {
  userInfo: undefined
}

const useUserStore = create<UserStore>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        init: payload => set(() => ({ userInfo: payload })),
        reset: () => set(initialState)
      }),
      { name: STORAGE_USERINFO }
    )
  )
)

export default useUserStore
