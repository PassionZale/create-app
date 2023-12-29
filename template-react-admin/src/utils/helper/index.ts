import PubSub from 'pubsub-js'
import { PAGE_TAB_REMOVE } from '@/constants'

function noop() {}

function closeTabPage(tabKey: string) {
  PubSub.publish(PAGE_TAB_REMOVE, tabKey)
}

function delay(wait: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, wait)
  })
}

export { noop, closeTabPage, delay }
