// * Menu
declare namespace Menu {
  interface MenuItem {
    id: string
    parentId: string
    name: string
    icon?: string
    link?: string
    children?: MenuItem[]
  }
}

declare namespace Pagination {
  interface ResponseDTO<T> {
    /** 当前页 */
    current: number
    /** 每页条数 */
    size: number
    /** 总页数 */
    pages: number
    /** 总条数 */
    total: number
    /** 分页数据 */
    records: T[]
  }

  interface RequestDTO {
    /** 当前页 */
    current: number
    /** 每页条数 */
    size: number
    /** 搜索条件 */
    param?: any
  }
}

declare module 'less-vars-to-js'