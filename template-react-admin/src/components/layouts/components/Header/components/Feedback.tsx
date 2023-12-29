import React, { useEffect, useState } from 'react'
import { Button, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import axios from 'axios'
import { BASE_URL_2C, VENDOR_ID } from '@/constants'
import useUserStore from '@/store/user'

const Feedback: React.FC = () => {
  const userInfo = useUserStore(state => state.userInfo)

  const [onlineConsultationUrl, setOnlineConsultationUrl] = useState<string>()
  const [createWorkOrderUrl, setCreateWorkOrderUrl] = useState<string>()
  const [processQueryUrl, setProcessQueryUrl] = useState<string>()

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = () => {
    axios('/system/signature/onlineCustom', {
      baseURL: BASE_URL_2C,
      method: 'POST',
      data: { vendorId: VENDOR_ID, uId: `u6_${VENDOR_ID}_${userInfo?.username}` }
    }).then(res => {
      if (res.data.code === 200) {
        setOnlineConsultationUrl(res.data.data)
      }
    })

    axios('/system/signature/submitTicket', {
      baseURL: BASE_URL_2C,
      method: 'POST',
      data: { authAccount: userInfo?.username, mobile: userInfo?.username }
    }).then(res => {
      if (res.data.code === 200) {
        setCreateWorkOrderUrl(res.data.data)
      }
    })

    axios('/system/signature/queryTicketRecord', {
      baseURL: BASE_URL_2C,
      method: 'POST',
      data: {
        authAccount: userInfo?.username,
        mobile: userInfo?.username,
        aId: VENDOR_ID,
        ticketTemplateId: 8,
        checkTicketStatus: 0
      }
    }).then(res => {
      if (res.data.code === 200) {
        setProcessQueryUrl(res.data.data)
      }
    })
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href={onlineConsultationUrl}>
          在线咨询
        </a>
      )
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href={createWorkOrderUrl}>
          创建工单
        </a>
      )
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href={processQueryUrl}>
          工单进度查询
        </a>
      )
    },
    {
      key: '4',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://doc.zrhsh.com/px/">
          遇到问题？大家看看怎么解决
        </a>
      )
    }
  ]

  return (
    <Dropdown menu={{ items }} placement="bottom" arrow trigger={['hover']}>
      <Button type="text">在线反馈</Button>
    </Dropdown>
  )
}

export default Feedback
