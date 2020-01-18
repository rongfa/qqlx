const app = getApp();
var util = require('../../common/utils/util.js');

Page({
  data: {
    msgInfo: null,
    status: false,
    msgId: null
  },


  onLoad: function(options) {
    var that = this;

    if (options.id) {
      this.setData({
        msgId: options.id
      });

      wx.request({
        url: app.url.msgInfo + "?id=" + options.id,
        method: 'POST',
        success: function(res) {
          that.setData({
            msgInfo: res.data.message
          });

        },
        fail: function(res) {}
      })
    }


  },

  receive: function(e) {
    var that = this;

    wx.request({
      url: app.url.receiveMsg + "?id=" + that.data.msgId,
      method: 'POST',
      success: function(res) {
        wx.showToast({
            title: '领取成功',
            icon: 'success',
            duration: 1500
          }),
          that.setData({
            status: true
          })
      },
      fail: function(res) {}
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    util.pullDownRefresh();
  },

})