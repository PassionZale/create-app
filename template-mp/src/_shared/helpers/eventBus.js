const notices = []

// 注册通知
export function on(name, observer, selector) {
  if (name && observer && selector) {
    const newNotice = {
      name,
      observer,
      selector
    }

    add(newNotice)
  }
}

// 移除通知（observer按name）
export function off(name, observer) {
  wx.nextTick(() => {
    // 以防post过程中同时remove
    for (let i = notices.length - 1; i >= 0; i--) {
      const inNotice = notices[i]

      if (inNotice.name == name && inNotice.observer == observer) {
        notices.splice(i, 1)
      }
    }
  })
}

// 移除通知（observer所有）
export function clean(observer) {
  wx.nextTick(() => {
    // 以防post过程中同时remove
    for (let i = notices.length - 1; i >= 0; i--) {
      const inNotice = notices[i]

      if (inNotice.observer == observer) {
        notices.splice(i, 1)
      }
    }
  })
}

// 发送通知
export function emit(name, info) {
  for (let i = 0; i < notices.length; i++) {
    const inNotice = notices[i]

    if (inNotice.name == name) {
      inNotice.selector(info)
    }
  }
}

// 加入通知数据
function add(newNotice) {
  if (notices.length > 0) {
    for (let i = 0; i < notices.length; i++) {
      const inNotice = notices[i]

      if (
        inNotice.name == newNotice.name &&
        inNotice.selector == newNotice.selector &&
        inNotice.observer == newNotice.observer
      ) {
        return
      }
    }
  }

  notices.push(newNotice)
}
