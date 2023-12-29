import React from 'react'
import { Spin, SpinProps } from 'antd'

interface LoadingProps extends SpinProps {}

const Loading: React.FC<LoadingProps> = props => (
  <Spin
    size="large"
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    }}
    {...props}
  />
)

export default Loading
