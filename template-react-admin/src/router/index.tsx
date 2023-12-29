import { Navigate, useRoutes } from 'react-router-dom'
import Login from '@/pages/auth/login'
import { RouterObject } from '@/router/interface'

const routerModules = import.meta.glob(['./modules/*.tsx'], { eager: true }) as Record<
  string,
  {
    [key: string]: any
  }
>

const metaRouters: RouterObject[] = []

Object.keys(routerModules).forEach(item => {
  Object.keys(routerModules[item]).forEach(key => {
    metaRouters.push(...routerModules[item][key])
  })
})

const rootRouter: RouterObject[] = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Navigate to="/home" replace />
  },
  ...metaRouters,
  {
    path: '*',
    element: <Navigate to="/404" />
  }
]

const Router = () => {
  const element = useRoutes(rootRouter)

  return element
}

const searchRoute = (path: string, routes: RouterObject[] = rootRouter): RouterObject => {
	let result: RouterObject = {};
	for (const item of routes) {
		if (item.path === path) return item;
		if (item.children) {
			const res = searchRoute(path, item.children);
			if (Object.keys(res).length) result = res;
		}
	}
	return result;
};

export default Router

export {
  Router,
  rootRouter,
  searchRoute
}
