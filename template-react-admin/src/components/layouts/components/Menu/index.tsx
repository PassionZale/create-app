import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { searchRoute } from '@/router'
import * as Icons from '@ant-design/icons'
import useMenuStore from '@/store/menu'
import useTabStore from '@/store/tab'

import styles from './index.module.less'

import type { MenuProps } from 'antd'
import { accessCheck } from '@/router/utils/AuthProvider'

type MenuItem = Required<MenuProps>['items'][number] & Record<'data', Menu.MenuItem>

const CustomIcons: { [key: string]: any } = Icons

const flatMenus = (sourceData: Menu.MenuItem[] = [], nextData: MenuItem[] = []) => {
  sourceData.forEach(item => {
    if (Array.isArray(item.children) && item.children.length) {
      nextData.push(
        getMenuItem(
          item,
          item.id,
          item.name,
          item.icon,
          flatMenus(item.children),
          'group'
        )
      )
    } else {
      return nextData.push(getMenuItem(item, item.id, item.name, item.icon))
    }
  })

  return nextData
}

const getMenuItem = (
  data: Menu.MenuItem,
  key: string,
  label: string,
  icon?: string,
  children?: MenuItem[],
  type?: 'group'
): MenuItem => {
  return {
    key,
    label,
    icon: icon ? React.createElement(CustomIcons[icon]) : null,
    children,
    type,
    data
  }
}

const LayoutMenu = () => {
  const addTab = useTabStore(state => state.add)

  const menus = useMenuStore(state => state.menus)
  const menuTree = useMenuStore(state => state.menuTree)

  const navigate = useNavigate()
  const location = useLocation()

  // 一级菜单数据
  const [parentMenus, setParentMenus] = useState<MenuItem[]>([])
  // 一级菜单选中的 menu keys
  const [selectedParentMenuKeys, setSelectedParentMenuKeys] = useState<string[]>([])
  // 一级菜单选中的 menuItem （用来展示 标题）
  const [selectedParentMenu, setSelectedParentMenu] = useState<Menu.MenuItem>()

  // 当前选中一级菜单的子菜单
  const [subMenus, setSubMenus] = useState<MenuItem[]>([])
  const [subMenusOpenKeys, setSubMenuOpenKeys] = useState<string[]>([])
  // 子菜单选中的 menu keys
  const [selectedSubMenuKeys, setSelectedSubMenuKeys] = useState<string[]>([])

  useEffect(() => {
    if (menuTree && location.pathname) {
      const found = menuTree.first({ strategy: 'post' }, node => {
        return node.model.link === location.pathname
      })

      // 如果菜单中包含当前 location.pathname, 说明当前用户定有菜单权限, 可以直接添加页签
      if (found) {
        // 第一个元素为自行添加的 root 节点, 忽略
        // 第二个元素为一级菜单
        // 后面的元素为所有的子节点
        const [_, parentMenu, ...subMenus] = found.getPath()

        // 初始化一级菜单展开和选中项
        setSelectedParentMenuKeys([parentMenu.model.id])
        setSelectedParentMenu(parentMenu.model)

        // 如果一级菜单还有子菜单, 则开始初始化子菜单
        if (parentMenu.hasChildren()) {
          // 初始化子菜单数据
          setSubMenus(flatMenus(parentMenu.model.children))

          // 初始化子菜单展开
          const selectedSubMenuKeys = subMenus.map(item => item.model.id)

          setSubMenuOpenKeys(
            selectedSubMenuKeys.filter(
              (_, index) => index < selectedSubMenuKeys.length - 1
            )
          )
          setSelectedSubMenuKeys(selectedSubMenuKeys)
        } else {
          // 如果一级菜单没有子菜单, 则清空子菜单相关的数据
          setSubMenus([])
          setSubMenuOpenKeys([])
          setSelectedSubMenuKeys([])
        }

        if (found.model.link === location.pathname) {
          addTab({
            label: found.model.name,
            key: location.pathname,
            link: found.model.link!
          })
        }
      } else {
        setSelectedSubMenuKeys([])
        // 若菜单中不包含 location.pathname, 说明其可能是三级或四级路由,从 routes 中筛选获得
        const route = searchRoute(location.pathname)

        // 根据找到的路由配置项, 判断当前用户是否有权限
        const hasPermission = accessCheck(route.meta?.authKey)

        // 只有拥有权限才添加页签
        if (hasPermission) {
          addTab({
            label: route.meta?.title as string,
            key: location.pathname,
            link: `${location.pathname}${location.search}`
          })
        }
      }
    }
  }, [menuTree, location, addTab, navigate])

  useEffect(() => {
    if (Array.isArray(menus) && menus.length) {
      const parentMenus = menus.map(item => {
        return getMenuItem(item, item.id, item.name, item.icon)
      })

      setParentMenus(parentMenus)
    }
  }, [menus])

  // 一级菜单选择
  const onParentMenuSelect: MenuProps['onSelect'] = payload => {
    const { selectedKeys } = payload

    const found = menus!.find(item => selectedKeys.includes(item.id))!

    if (found.link) {
      return navigateTo(found)
    }

    setSelectedParentMenuKeys(selectedKeys)
    setSelectedParentMenu(found)

    if (Array.isArray(found.children) && found.children.length) {
      const subMenus = flatMenus(found.children)

      setSubMenus(subMenus)
    } else {
      setSubMenus([])
    }
  }

  // 子菜单选择
  const onSubMenuSelect: MenuProps['onSelect'] = payload => {
    const { selectedKeys, item } = payload

    // @ts-ignore
    const subMenuItem = item.props.data as Menu.MenuItem

    const { link } = subMenuItem

    if (link) {
      return navigateTo(subMenuItem)
    }

    setSelectedSubMenuKeys(selectedKeys)
  }

  const navigateTo = (menu: Menu.MenuItem) => {
    addTab({
      label: menu.name,
      key: menu.link!,
      link: menu.link!
    })

    navigate(menu.link!)
  }

  return (
    <>
      <Layout.Sider className={styles.parentSiderMenu} width={100} theme={'light'}>
        <img className={styles.logo} src={'/icon-512.png'} />
        <Menu
          items={parentMenus}
          theme="light"
          selectedKeys={selectedParentMenuKeys}
          onSelect={onParentMenuSelect}
        />
      </Layout.Sider>

      <Layout.Sider className={styles.subSiderMenu} width={140} theme={'light'}>
        <div className={styles.title}>{selectedParentMenu?.name}</div>

        <Menu
          style={{ width: 100 }}
          items={subMenus}
          theme="light"
          mode="inline"
          motion={{ motionLeaveImmediately: true }}
          inlineIndent={10}
          openKeys={subMenusOpenKeys}
          selectedKeys={selectedSubMenuKeys}
          onOpenChange={openKeys => setSubMenuOpenKeys(openKeys)}
          onSelect={onSubMenuSelect}
          triggerSubMenuAction={'click'}
        />
      </Layout.Sider>
    </>
  )
}

export default LayoutMenu
