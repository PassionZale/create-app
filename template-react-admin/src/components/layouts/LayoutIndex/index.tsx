import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import { AuthLoginGuard, AuthAccessGuard } from '@/router/utils/AuthProvider'
import Loading from '@/components/Loading'
import LayoutMenu from '@/components/layouts/components/Menu'
import LayoutHeader from '@/components/layouts/components/Header'
import LayoutFooter from '@/components/layouts/components/Footer'
import useUserStore from '@/store/user'
import usePermissionStore, { PermissionItem } from '@/store/permission'
import useMenuStore from '@/store/menu'
import useTabStore from '@/store/tab'
import { request } from '@/utils'

import styles from './index.module.less'

const LayoutIndex = () => {
  const userInfo = useUserStore(state => state.userInfo)

  const permissions = usePermissionStore(state => state.permissions)
  const initPermissions = usePermissionStore(state => state.init)

  const menus = useMenuStore(state => state.menus)
  const initMenus = useMenuStore(state => state.init)

  const addTab = useTabStore(state => state.add)

  const loadMenus = () => request.get<Menu.MenuItem[]>('/auth/menus')
  const loadPermissions = () => request.get<PermissionItem[]>('/auth/permissions')

  useEffect(() => {
    if (permissions === undefined && menus === undefined && userInfo?.accessToken) {
      Promise.allSettled([loadPermissions(), loadMenus()]).then(results => {
        const [permissionRes, menuRes] = results

        if (permissionRes.status === 'fulfilled') {
          initPermissions(permissionRes.value.result)
        } else {
          initPermissions([])
        }

        if (menuRes.status === 'fulfilled') {
          const found = menuRes.value.result.find(item => item.link === '/home')

          if (found) {
            // 初始化无法关闭的“首页 - 页签”
            addTab({
              label: found.name,
              key: found.link!,
              link: found.link!,
              closable: false
            })
          }

          initMenus(menuRes.value.result)
        } else {
          initMenus([])
        }
      })
    }
  }, [permissions, menus, userInfo, initPermissions, initMenus, addTab])

  return (
    <AuthLoginGuard>
      {permissions !== undefined && menus !== undefined ? (
        <AuthAccessGuard>
          <section className={styles.container}>
            <LayoutMenu />

            <Layout>
              <LayoutHeader />

              <Layout.Content>
                <Outlet />
              </Layout.Content>

              <LayoutFooter />
            </Layout>
          </section>
        </AuthAccessGuard>
      ) : (
        <Loading />
      )}
    </AuthLoginGuard>
  )
}

export default LayoutIndex
