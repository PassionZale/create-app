import { Navigate, useLocation } from 'react-router-dom'
import useUserStore from '@/store/user'
import usePermissionStore from '@/store/permission'
import { searchRoute } from '@/router'

interface Props {
  children: JSX.Element
}

// 未登录，重定向到 /login
const AuthLoginGuard = (props: Props) => {
  const userInfo = useUserStore(state => state.userInfo)

  if (!userInfo?.accessToken) {
    return <Navigate to="/login" replace />
  }

  return props.children
}

// 已登录，重定向到 /home
const AuthLoggedGuard = (props: Props) => {
  const userInfo = useUserStore(state => state.userInfo)

  if (userInfo?.accessToken) {
    return <Navigate to="/home" replace />
  }

  return props.children
}

// 没有权限，重定向到 /403
const AuthAccessGuard = (props: Props) => {
  const location = useLocation()

  const route = searchRoute(location.pathname)

  const hasPermission = accessCheck(route.meta?.authKey)

  if (!hasPermission) return <Navigate to="/403" replace />

  return props.children
}

/** 通过传入的权限编码判断是否拥有权限 */
const accessCheck = (authKey?: string): boolean => {
  if (authKey) {
    const permissions = usePermissionStore.getState().permissions

    if (Array.isArray(permissions) && permissions.length) {
      return permissions.some(permission => permission.value === authKey)
    }

    return false
  }

  return true
}

export { AuthLoginGuard, AuthLoggedGuard, AuthAccessGuard, accessCheck }
