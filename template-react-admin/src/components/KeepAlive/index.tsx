import { KeepAlive } from 'react-activation'

const withKeepAlive = (Component: React.ComponentType, cacheKey: string) => {
  const KeepAliveComponent = (props: any) => {
    return (
      <KeepAlive name={cacheKey} cacheKey={cacheKey} key={cacheKey}>
        <Component {...props} />
      </KeepAlive>
    )
  }

  return KeepAliveComponent
}

export { withKeepAlive, KeepAlive }
