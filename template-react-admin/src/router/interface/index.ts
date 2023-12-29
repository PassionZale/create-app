export interface MetaProps {
  /** 标题 */
  title: string
  /** 权限编码 */
  authKey?: string
}

export interface RouterObject {
  children?: RouterObject[]
  element?: React.ReactNode
  path?: string
  meta?: MetaProps
}
