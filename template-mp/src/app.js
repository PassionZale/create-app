App({
  onLaunch() {
    this.checkLatestVersion()
  },

  checkLatestVersion() {
    if (wx.getUpdateManager) {
      const updateManager = wx.getUpdateManager()

      updateManager.onCheckForUpdate(res => {})

      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '版本升级提示',
          content: '小程序已推出新版本,是否立即更新?',
          success(res) {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(() => {
        // 新的版本下载失败
        wx.showModal({
          title: '更新提示',
          content: '新版本下载失败',
          showCancel: false
        })
      })
    } else {
      wx.showModal({
        title: '提示',
        content:
          '当前微信版本过低，无法使用小程序版本更新功能，请升级到最新微信版本后重试。'
      })
    }
  },

  onPageNotFound() {},

  onError() {}
})
