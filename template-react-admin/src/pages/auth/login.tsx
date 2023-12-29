import React, { useState } from 'react'
import { redirect } from 'react-router-dom'
import { Button, Card, Form, Input, message } from 'antd'
import { AuthLoggedGuard } from '@/router/utils/AuthProvider'
import { request, delay } from '@/utils'
import useUserStore from '@/store/user'
import styles from './index.module.less'

type LoginRequestData = {
  username: string
  password: string
}

type LoginResponseData = string

const Login: React.FC = () => {
  const setUserInfo = useUserStore(state => state.init)

  const [loading, setLoading] = useState(false)

  const onFinish = async (values: any) => {
    try {
      setLoading(true)

      const res = await request.post<LoginResponseData, LoginRequestData>('/auth/login', {
        data: values
      })

      message.success('登录成功')

      setUserInfo({ username: values.username, accessToken: res.result })

      delay(200).then(() => {
        setLoading(false)

        redirect('/')
      })
    } catch (error) {
      setLoading(false)
      message.error((error as Error).message)
    }
  }

  return (
    <AuthLoggedGuard>
      <div className={styles.loginPage}>
        <Card style={{ width: '60%' }}>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            onFinish={onFinish}
            autoComplete="off"
            initialValues={{
              username: '@whouu/create-app',
              password: 'react-admin-starter'
            }}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </AuthLoggedGuard>
  )
}

export default Login
