var app = getApp();

Page({
  data: {},
  onLoad: function(options) {
    var that = this
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })

    setTimeout(function() {
      if (options && options.friendCode) {
        app.globalData.friendCode = options.friendCode;
        app.globalData.friendName = options.friendName;
        wx.switchTab({
          url: '/pages/pet/pet',
        });
      } else {
        wx.switchTab({
          url: '/pages/mine/mine',
        });
      }
    }, 6000)
  },
});