import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAliveController } from 'react-activation'
import PubSub from 'pubsub-js'
import { Tabs, Dropdown } from 'antd'
import {
  ColumnWidthOutlined,
  CloseCircleOutlined,
  VerticalRightOutlined,
  VerticalLeftOutlined,
  SwitcherOutlined
} from '@ant-design/icons'
import useTabStore, { TabItem } from '@/store/tab'
import { PAGE_TAB_REMOVE } from '@/constants'

import type { MenuProps, TabsProps } from 'antd'
import type { MenuInfo } from 'rc-menu/lib/interface'

import styles from './index.module.less'

type ContextMenuProps = {
  index: number
  length: number
}

enum ContextMenuActions {
  /** 关闭当前 */
  CloseSelf = 'closeSelf',
  /** 关闭左侧 */
  CloseLeft = 'closeLeft',
  /** 关闭右侧 */
  CloseRight = 'closeRight',
  /** 关闭其他 */
  CloseOther = 'closeOther',
  /** 关闭所有 */
  CloseAll = 'closeAll'
}

const LayoutTabs: React.FC = () => {
  const navigate = useNavigate()
  const { dropScope } = useAliveController()

  const activeKey = useTabStore(state => state.activeKey)
  const items = useTabStore(state => state.items)
  const remove = useTabStore(state => state.remove)
  const update = useTabStore(state => state.update)

  useEffect(() => {
    const listener = PubSub.subscribe(PAGE_TAB_REMOVE, (_, data) => {
      remove(data as string, nextTabItem => {
        navigate(nextTabItem.link)

        dropScope(data as string)
      })
    })

    return () => {
      PubSub.unsubscribe(listener)
    }
  }, [dropScope, navigate, remove])

  // 删除 tab
  const onEdit: TabsProps['onEdit'] = (key, action) => {
    if (action === 'remove') {
      remove(key as string, nextTabItem => {
        navigate(nextTabItem.link)

        dropScope(key as string)
      })
    }
  }

  // tab 点击
  const onTabClick: TabsProps['onTabClick'] = key => {
    if (activeKey !== key) {
      const found = items.find(item => item.key === key)

      if (found) navigate(found.link)
    }
  }

  // 获取 contextMenu 菜单项
  const getContextMenuItems = (props: ContextMenuProps): MenuProps['items'] => {
    const { index, length } = props

    let items: MenuProps['items'] = []

    if (index === 0 && length === 1) {
      // 只有一个 tab
    } else if (index === 0 && length > 1) {
      // 多个 tab，并且当前为第一个
      items = [
        {
          icon: <VerticalLeftOutlined />,
          label: '关闭右侧',
          key: ContextMenuActions.CloseRight
        },
        {
          icon: <ColumnWidthOutlined />,
          label: '关闭其他',
          key: ContextMenuActions.CloseOther
        },
        {
          icon: <SwitcherOutlined />,
          label: '关闭所有',
          key: ContextMenuActions.CloseAll
        }
      ]
    } else if (index === length - 1) {
      // 多个 tab，并且当前为最后一个
      items = [
        {
          icon: <CloseCircleOutlined />,
          label: '关闭当前',
          key: ContextMenuActions.CloseSelf
        },
        {
          icon: <VerticalRightOutlined />,
          label: '关闭左侧',
          key: ContextMenuActions.CloseLeft
        },
        {
          icon: <ColumnWidthOutlined />,
          label: '关闭其他',
          key: ContextMenuActions.CloseOther
        },
        {
          icon: <SwitcherOutlined />,
          label: '关闭所有',
          key: ContextMenuActions.CloseAll
        }
      ]
    } else {
      // 多个 tab，并且不是第一个也不是最后一个
      items = [
        {
          icon: <CloseCircleOutlined />,
          label: '关闭当前',
          key: ContextMenuActions.CloseSelf
        },
        {
          icon: <VerticalRightOutlined />,
          label: '关闭左侧',
          key: ContextMenuActions.CloseLeft
        },
        {
          icon: <VerticalLeftOutlined />,
          label: '关闭右侧',
          key: ContextMenuActions.CloseRight
        },
        {
          icon: <ColumnWidthOutlined />,
          label: '关闭其他',
          key: ContextMenuActions.CloseOther
        },
        {
          icon: <SwitcherOutlined />,
          label: '关闭所有',
          key: ContextMenuActions.CloseAll
        }
      ]
    }

    return items
  }

  // contextMenu 点击
  const onContextMenuClick = (event: MenuInfo, tabIndex: number, tabItem: TabItem) => {
    const { key: contextMenuAction } = event

    switch (contextMenuAction) {
      case ContextMenuActions.CloseSelf: {
        return remove(tabItem.key, nextTabItem => {
          navigate(nextTabItem.link)

          dropScope(tabItem.key)
        })
      }

      case ContextMenuActions.CloseLeft: {
        const nextItems = items.filter((item, index) => {
          const flag = index >= tabIndex || index === 0

          if (!flag) {
            dropScope(item.key)
          }

          return flag
        })

        update(nextItems)

        if (activeKey !== tabItem.key) {
          navigate(tabItem.link)
        }

        return
      }

      case ContextMenuActions.CloseRight: {
        const nextItems = items.filter((item, index) => {
          const flag = index <= tabIndex

          if (!flag) {
            dropScope(item.key)
          }

          return flag
        })

        update(nextItems)

        if (activeKey !== tabItem.key) {
          navigate(tabItem.link)
        }

        return
      }

      case ContextMenuActions.CloseOther: {
        const nextItems = items.filter((item, index) => {
          const flag = index === tabIndex || index === 0

          if (!flag) {
            dropScope(item.key)
          }

          return flag
        })

        update(nextItems)

        if (activeKey !== tabItem.key) {
          navigate(tabItem.link)
        }

        return
      }

      case ContextMenuActions.CloseAll: {
        const nextItems = items.filter((item, index) => {
          const flag = index === 0

          if (!flag) {
            dropScope(item.key)
          }

          return flag
        })

        update(nextItems)

        return navigate('/')
      }

      default:
        break
    }
  }

  const tabItems: TabsProps['items'] = items.map((item, index) => {
    return {
      key: item.key,
      closable: item.closable,
      label: (
        <Dropdown
          menu={{
            onClick: event => onContextMenuClick(event, index, item),
            items: getContextMenuItems({
              index,
              length: items.length
            })
          }}
          trigger={['contextMenu']}
        >
          <div className={styles.tabItem} onClick={e => onTabClick(item.key, e)}>
            {item.label}
          </div>
        </Dropdown>
      )
    }
  })

  return (
    <Tabs
      className={styles.tabs}
      activeKey={activeKey}
      hideAdd
      type="editable-card"
      size="small"
      tabBarGutter={6}
      style={{ height: 'auto' }}
      onEdit={onEdit}
      items={tabItems}
    />
  )
}

export default LayoutTabs
