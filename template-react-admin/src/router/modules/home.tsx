import React from 'react'
import LayoutIndex from '@/components/layouts/LayoutIndex'
import { RouterObject } from '@/router/interface'
import lazyLoad from '@/router/utils/lazyLoad'

const homeRouter: RouterObject[] = [
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/home',
        element: lazyLoad(React.lazy(() => import('@/pages/home'))),
        meta: {
          title: '首页'
        }
      }
    ]
  }
]

export default homeRouter
