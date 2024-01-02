import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Space, Table } from 'antd'
import { withKeepAlive } from '@/components/KeepAlive'
import { request } from '@/utils'

const Page = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    setLoading(true)

    request.get('/nav/list').then(res => {
      setLoading(false)
      setDataSource(res.result)
    })
  }, [])

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_: any, record: any) => {
        return <a onClick={() => onEdit(record)}>编辑</a>
      }
    }
  ]

  const onCreate = () => navigate('/nav1/nav1-1/create')

  const onEdit = (record: any) => navigate(`/nav1/nav1-1/detail?id=${record.id}`)

  return (
    <div>
      <h2>列表1</h2>

      <Space direction="vertical">
        <Input style={{ width: 300 }} placeholder="同样的，列表页也有缓存" />

        <Button style={{ marginBottom: 10 }} type="primary" onClick={onCreate}>
          新建
        </Button>

        <div>点击编辑，模拟在缓存场景下，根据 ID 的变化在详情页重新获取数据</div>
        <div>若 ID 没变化，则详情不会重新请求数据</div>
        <div>若 ID 变化，则详情会重新请求数据</div>
      </Space>

      <Table
        rowKey={'id'}
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        pagination={false}
      />
    </div>
  )
}

const WrappedComponent = withKeepAlive(Page, '/nav1/nav1-1')

export default WrappedComponent
