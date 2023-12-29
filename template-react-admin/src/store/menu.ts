import { create } from 'zustand'
import TreeModel from 'tree-model'

const tree = new TreeModel()

type MenuStore = {
  menus?: Menu.MenuItem[]
  menuTree?: TreeModel.Node<Menu.MenuItem>
  init: (payload: Menu.MenuItem[]) => void,
  reset: () => void
}

const initialState = {
  menus: undefined,
  menuTree: undefined,
}

const useMenuStore = create<MenuStore>()(set => ({
  ...initialState,
  init: payload =>
    set(() => {
      // tree-model 需要传入一个拥有根节点的对象
      // 所以在此处添加根节点
      const menuTree = tree.parse({
        id: '-1',
        parentId: '-1',
        name: 'root',
        children: payload
      })

      return { menus: payload, menuTree }
    }),
    reset: () => set(initialState)
}))

export default useMenuStore
