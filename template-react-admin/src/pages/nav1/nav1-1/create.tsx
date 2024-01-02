import { Button, Form, Input, Space } from 'antd'
import { useLocation } from 'react-router-dom'
import { withKeepAlive } from '@/components/KeepAlive'
import { closeTabPage } from '@/utils'

const FormLayout = 'horizontal'
const FormItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } }
const FormTailLayout = { wrapperCol: { offset: 4, span: 16 } }

const Page = () => {
  const [form] = Form.useForm()
  const location = useLocation()

  const onCancel = () => {
    closeTabPage(location.pathname)
  }

  return (
    <div>
      <h2>列表1 - 新建</h2>

      <Form {...FormItemLayout} form={form} layout={FormLayout} autoComplete="off">
        <Form.Item label="姓名" name="name" required>
          <Input style={{ width: 300 }} />
        </Form.Item>

        <Form.Item label="年纪" name="age" required>
          <Input style={{ width: 300 }} />
        </Form.Item>

        <Form.Item label={null} {...FormTailLayout}>
          <Space>
            <Button onClick={onCancel}>取消(关闭页面并移除缓存)</Button>
            <Button type="primary">确定</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

const WrappedComponent = withKeepAlive(Page, '/nav1/nav1-1/create')

export default WrappedComponent
