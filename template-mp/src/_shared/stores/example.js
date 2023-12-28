import Storage from '../helpers/storage'

const storage = new Storage({ snapchat: true })

class Store {
  get exampleValue() {
    return storage.get('exampleValue')
  }

  set exampleValue(val) {
    storage.set('exampleValue', val)
  }
}

export default new Store()
