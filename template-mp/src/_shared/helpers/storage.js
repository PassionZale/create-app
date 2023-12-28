/**
 * Storage
 *
 * @desc      内存存储，主要用于跨页面参数的传递
 * @author    @whouu/create-app
 */

 import { CustomException } from './utils'

 class Storage {
   constructor(options) {
     // 阅后即焚
     const { snapchat = false } = options || {}
 
     this.snapchat = snapchat
     this.data = {}
   }
 
   set(key, value) {
     if (!key) {
       throw new CustomException({ message: 'key 不能为空' })
     }
 
     this.data[String(key)] = value
   }
 
   get(key) {
     const value = key ? this.data[String(key)] : this.data
 
     if (this.snapchat) {
       this.removeItem(key)
     }
 
     return value
   }
 
   removeItem(key) {
     delete this.data[String(key)]
   }
 
   clear() {
     this.data = {}
   }
 }
 
 export default Storage
 