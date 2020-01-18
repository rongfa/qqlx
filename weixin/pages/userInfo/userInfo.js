const app = getApp();
var util = require('../../common/utils/util.js');

Page({
  data: {
    petList: [],
    userInfo: null
  },

  onLoad: function(options) {
    var that = this;
    if (options.rankid) {
      wx.request({
        url: app.url.getUserByopenid + "?openId=" + options.rankid,
        method: 'POST',
        data: {},
        success: function(res) {
          console.log(res.data.message)
          that.setData({
            petList: res.data.message.pets,
            userInfo: res.data.message.userInfo
          });

        },
        fail: function(res) {}
      })
    }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    util.pullDownRefresh();
  },
})