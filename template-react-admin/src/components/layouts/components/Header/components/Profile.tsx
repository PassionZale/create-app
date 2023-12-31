import React from 'react'
import { Button, Dropdown, Space } from 'antd'
import { DownOutlined, UserOutlined } from '@ant-design/icons'
import useUserStore from '@/store/user'

import type { MenuProps } from 'antd'

const items: MenuProps['items'] = [
  {
    key: 'logout',
    label: '退出登录'
  }
]

const Profile: React.FC = () => {
  const { userInfo, reset } = useUserStore.getState()

  const onMenuClick: MenuProps['onClick'] = event => {
    const { key } = event

    switch (key) {
      case 'logout':
        reset()

        window.location.replace('/login')
        break

      default:
        break
    }
  }

  return (
    <>
      <Dropdown
        menu={{ items, onClick: onMenuClick }}
        placement="bottom"
        arrow
        trigger={['hover']}
      >
        <Button type="text">
          <Space align="center">
            <UserOutlined />
            {userInfo?.username}
            <DownOutlined style={{ fontSize: 10 }} />
          </Space>
        </Button>
      </Dropdown>
    </>
  )
}

export default Profile
