import { defineMock } from 'vite-plugin-mock-dev-server'

export default defineMock([
  {
    url: '/api/auth/login',
    method: 'POST',
    delay: 300,
    body: { code: 200, result: 'jwt-mock-data', message: '成功' }
  },

  {
    url: '/api/auth/menus',
    method: 'GET',
    delay: 300,
    body: {
      code: 200,
      message: '成功',
      result: [
        {
          id: '1',
          parentId: '0',
          name: '首页',
          icon: 'HomeOutlined',
          link: '/home',
          children: []
        },
        {
          id: '2',
          parentId: '0',
          name: '导航一',
          icon: 'AppstoreAddOutlined',
          children: [
            {
              id: '2-1',
              parentId: '2',
              name: '列表1',
              link: '/nav1/nav1-1',
              children: []
            },
            {
              id: '2-2',
              parentId: '2',
              name: '列表2',
              link: '/nav1/nav1-2',
              children: []
            }
          ]
        },
        {
          id: '3',
          parentId: '0',
          name: '导航二',
          icon: 'DesktopOutlined',
          children: [
            {
              id: '3-1',
              parentId: '3',
              name: '列表3',
              link: '/nav2/nav2-1',
              children: []
            },
            {
              id: '3-2',
              parentId: '3',
              name: '列表4',
              link: '/nav2/nav2-2',
              children: []
            }
          ]
        }
      ]
    }
  },

  {
    url: '/api/auth/permissions',
    method: 'GET',
    delay: 500,
    body: {
      code: 200,
      message: '成功',
      result: [
        {
          value: 'page-11'
        },
        {
          value: 'page-12'
        }
      ]
    }
  }
])
