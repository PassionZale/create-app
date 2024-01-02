import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button, Form, Input, Spin } from 'antd'
import { withKeepAlive } from '@/components/KeepAlive'
import { request } from '@/utils'

const FormLayout = 'horizontal'
const FormItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } }
const FormTailLayout = { wrapperCol: { offset: 4, span: 16 } }

const Page = () => {
  const [form] = Form.useForm()
  const [searchParams] = useSearchParams()

  const [loading, setLoading] = useState(false)

  const id = searchParams.get('id')

  useEffect(() => {
    if (id) {
      loadData()
    }
  }, [id])

  const loadData = async () => {
    setLoading(true)

    const res = await request.post('/nav/detail', { data: { id } })

    setLoading(false)

    form.setFieldsValue(res.result)
  }

  return (
    <div>
      <h2>列表1 - 新建</h2>

      <Spin spinning={loading}>
        <Form {...FormItemLayout} form={form} layout={FormLayout} autoComplete="off">
          <Form.Item label="姓名" name="name" required>
            <Input style={{ width: 300 }} />
          </Form.Item>

          <Form.Item label="年纪" name="age" required>
            <Input style={{ width: 300 }} />
          </Form.Item>

          <Form.Item label={null} {...FormTailLayout}>
            <Button type="primary">确定</Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  )
}

const WrappedComponent = withKeepAlive(Page, '/nav1/nav1-1/detail')

export default WrappedComponent
