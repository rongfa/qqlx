const app = getApp();
var util = require('../../common/utils/util.js');

Page({
  data: {
    content: null,
    version: null,
    type: null
  },

  onLoad: function(options) {
    var that = this;

    wx.request({
      url: app.url.getServiceInfo,
      method: 'POST',
      success: function(res) {
        that.setData({
          content: res.data.message.content,
          version:res.data.message.version,
          type:res.data.message.type
        });
      },
      fail: function(res) {}
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    util.pullDownRefresh();
  },

})