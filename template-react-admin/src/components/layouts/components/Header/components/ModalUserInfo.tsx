import React, { useEffect, useState } from 'react'
import { Form, Modal, Input, message, Spin, Select, Radio } from 'antd'
import FormUpload from '@/components/FormUpload'
import StandardForm, { StandardFormProps } from '@/components/StandardForm'
import { request } from '@/utils'

const enum Sex {
  UNKNOWN,
  MALE,
  FEMALE
}

interface DataType {
  avatar: string
  email: string
  phone: string
  sex: Sex
  desc: string
}

const formLayout = {
  labelCol: { span: 5 }
}

const ModalUserInfo: React.FC = () => {
  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setLoading(true)

      loadData()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const loadData = async () => {
    try {
      setLoading(true)

      const res = await request.post<DataType>('/auth/getUserInfo')

      form.setFieldsValue(res.result)

      setLoading(false)
    } catch (error) {
      message.error((error as Error).message)
      setLoading(false)
    }
  }

  const formItems: StandardFormProps['formItems'] = [
    {
      formItemProps: {
        name: 'avatar',
        label: '头像',
      },
      component: <FormUpload />
    },
    {
      formItemProps: {
        name: 'email',
        label: '邮箱',
        validateFirst: true,
        rules: [
          {
            required: true,
            message: '必填'
          },
          {
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: '请输入正确的邮箱'
          }
        ]
      },
      component: <Input placeholder="请输入邮箱" />
    },
    {
      formItemProps: {
        name: 'phone',
        label: '手机号',
        validateFirst: true,
        rules: [
          {
            required: true,
            message: '必填'
          },
          {
            pattern: /^1\d{10}$/,
            message: '请输入正确的手机号'
          }
        ]
      },
      component: <Input placeholder="请输入手机号" />
    },
    {
      formItemProps: {
        name: 'sex',
        label: '性别',
        rules: [
          {
            required: true,
            message: '必填'
          }
        ]
      },
      component: (
        <Radio.Group>
          <Radio value={Sex.MALE}>男</Radio>
          <Radio value={Sex.FEMALE}>女</Radio>
        </Radio.Group>
      )
    },
    {
      formItemProps: {
        name: 'desc',
        label: '描述',
        rules: [
          {
            required: true,
            message: '必填'
          }
        ]
      },
      component: <Input.TextArea />
    }
  ]

  const onOk = () => {
    form
      .validateFields()
      .then(async values => {
        try {
          setConfirmLoading(true)

          const res = await request.post('/auth/changeUserInfo', { data: values })

          message.success(res.message)

          setConfirmLoading(false)

          setOpen(false)
        } catch (error) {
          setConfirmLoading(false)
          message.error((error as Error).message)
        }
      })
      .catch()
  }

  return (
    <>
      <a onClick={() => setOpen(true)}>个人信息</a>

      <Modal
        title={'编辑个人信息'}
        destroyOnClose
        open={open}
        onOk={onOk}
        confirmLoading={confirmLoading}
        onCancel={() => setOpen(false)}
      >
        <Spin spinning={loading}>
          <StandardForm
            form={form}
            formItems={formItems}
            preserve={false}
            {...formLayout}
          />
        </Spin>
      </Modal>
    </>
  )
}

export default ModalUserInfo
