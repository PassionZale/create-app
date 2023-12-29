import { create } from 'zustand'

export type TabItem = {
  label: string
  key: string
  link: string
  disabled?: boolean
  closable?: boolean
}

type TabStore = {
  /** 当前激活 tab 面板的 key */
  activeKey: string | undefined
  /** 配置选项卡内容 */
  items: TabItem[]
  /** 新增 tab，并将 activeKey 设置为传入的 tabItem */
  add: (tabItem: TabItem) => void
  /** 关闭 tab */
  remove: (tabKey: string, cb?: (nextTabItem: TabItem) => void) => void
  /** 覆盖 tab */
  update: (tabItems: TabItem[]) => void
  reset: () => void
}

const initialState = {
  activeKey: undefined,
  items: []
}

const useTabStore = create<TabStore>()(set => ({
  ...initialState,
  add: item =>
    set(state => {
      const foundIndex = state.items.findIndex(({ key }) => key === item.key)

      if (foundIndex > -1) {
        // 兼容详情 location.search 不一致的情况 link 需要被正确更新
        if (item.link !== state.items[foundIndex].link) {
          const items = [...state.items]

          items[foundIndex] = item

          return { activeKey: item.key, items }
        }

        return { activeKey: item.key }
      } else {
        return { activeKey: item.key, items: [...state.items, ...[item]] }
      }
    }),
  remove: (key, cb) =>
    set(state => {
      const foundIndex = state.items.findIndex(item => item.key === key)
      const filters: TabItem[] = state.items.filter(item => item.key !== key)

      if (filters.length && key === state.activeKey) {
        const nextTabItem =
          filters[foundIndex === filters.length ? foundIndex - 1 : foundIndex]

        cb && cb(nextTabItem)
      }

      return {
        items: filters
      }
    }),
  update: items => set(() => ({ items })),
  reset: () => set(initialState)
}))

export default useTabStore
