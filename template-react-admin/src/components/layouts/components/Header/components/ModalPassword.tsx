import React, { useState } from 'react'
import { Form, Modal, Input, message } from 'antd'
import StandardForm, { StandardFormProps } from '@/components/StandardForm'
import { request } from '@/utils'
import useUserStore from '@/store/user'
import { useNavigate } from 'react-router-dom'

const formLayout = {
  labelCol: { span: 5 }
}

const patternValidator = {
  pattern:
    /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\W_!@#$%^&*`~()-+=]{8,16}$/,
  message: '密码必须是大写字母、小写字母、数字、特殊字符至少三种组成、且长度为8到16位！'
}

const ModalPassword: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const reset = useUserStore(state => state.reset)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const formItems: StandardFormProps['formItems'] = [
    {
      formItemProps: {
        name: 'password',
        label: '原密码',
        validateFirst: true,
        rules: [
          {
            required: true,
            message: '必填'
          },
          patternValidator
        ]
      },
      component: <Input.Password placeholder="请输入原密码" />
    },
    {
      formItemProps: {
        name: 'newPassword',
        label: '新密码',
        validateFirst: true,
        rules: [
          {
            required: true,
            message: '必填'
          },
          patternValidator
        ]
      },
      component: <Input.Password placeholder="请输入新密码" />
    },
    {
      formItemProps: {
        name: 'confirmPassword',
        label: '新密码确认',
        validateFirst: true,
        rules: [
          {
            required: true,
            message: '必填'
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('两次输入的新密码不一致'))
            }
          }),
          patternValidator
        ]
      },
      component: <Input.Password placeholder="请再输一次新密码" />
    }
  ]

  const onOk = () => {
    form
      .validateFields()
      .then(async values => {
        try {
          setLoading(true)

          await request.post('/auth/changePassword', { data: values })

          setLoading(false)

          setOpen(false)

          message.success('修改密码成功，请重新登录')

          reset()

          window.location.replace('/login')
        } catch (error) {
          setLoading(false)
          message.error((error as Error).message)
        }
      })
      .catch()
  }

  return (
    <>
      <a onClick={() => setOpen(true)}>修改密码</a>
      <Modal
        title={'修改密码'}
        destroyOnClose
        open={open}
        onOk={onOk}
        confirmLoading={loading}
        onCancel={() => setOpen(false)}
      >
        <StandardForm
          form={form}
          formItems={formItems}
          preserve={false}
          {...formLayout}
        />
      </Modal>
    </>
  )
}

export default ModalPassword
