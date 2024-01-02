import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import * as Icons from '@ant-design/icons'
import useMenuStore from '@/store/menu'
import useTabStore from '@/store/tab'

import styles from './index.module.less'

import type { MenuProps } from 'antd'
import { searchRoute } from '@/router'
import { accessCheck } from '@/router/utils/AuthProvider'

type MenuItem = Required<MenuProps>['items'][number] & Record<'data', Menu.MenuItem>

const CustomIcons: { [key: string]: any } = Icons

const flatMenus = (sourceData: Menu.MenuItem[] = [], nextData: MenuItem[] = []) => {
  sourceData.forEach(item => {
    if (Array.isArray(item.children) && item.children.length) {
      nextData.push(
        getMenuItem(item, item.id, item.name, item.icon, flatMenus(item.children))
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

  // 菜单数据
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  // 将接口返回的 menus 转换为 <Menu /> 的 items 数据结构
  useEffect(() => {
    if (Array.isArray(menus) && menus.length) {
      const menuItems = flatMenus(menus)

      setMenuItems(menuItems)
    }
  }, [menus])

  useEffect(() => {
    if (menuTree && location.pathname) {
      const found = menuTree.first({ strategy: 'post' }, node => {
        return location.pathname.indexOf(node.model.link) > -1
      })

      if (found) {
        const menuPath = found.getPath()

        const [_, parentMenu, subMenu] = menuPath

        if (parentMenu.hasChildren()) {
          setOpenKeys([parentMenu.model.id])
          setSelectedKeys([subMenu.model.id])
        } else {
          setOpenKeys([])
          setSelectedKeys([parentMenu.model.id])
        }

        if (found.model.link === location.pathname) {
          addTab({
            label: found.model.name,
            key: location.pathname,
            link: found.model.link!
          })
        } else {
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
    }
  }, [menuTree, location, addTab, navigate])

  // subMenu 展开
  const onOpenChange: MenuProps['onOpenChange'] = openKeys => {
    setOpenKeys(openKeys)
  }

  // MenuItem 选中
  const onSelect: MenuProps['onSelect'] = ({ selectedKeys, item }) => {
    // @ts-ignore
    const menuItem = item.props.data as Menu.MenuItem

    const { link } = menuItem

    if (link) {
      return navigateTo(menuItem)
    }

    setSelectedKeys(selectedKeys)
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
      <Layout.Sider width={200} theme="light">
        <div className={styles.logo}>
          <img src={'/icon-512.png'} />
          <div>react-admin-starter</div>
        </div>

        <Menu
          mode="inline"
          motion={{ motionLeaveImmediately: true }}
          items={menuItems}
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          onOpenChange={onOpenChange}
          onSelect={onSelect}
        />
      </Layout.Sider>
    </>
  )
}

export default LayoutMenu
