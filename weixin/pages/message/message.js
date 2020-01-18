const app = getApp();
var util = require('../../common/utils/util.js');

var nullTip = {
  tipText: '暂时还没有消息哦'
}

Page({
  data: {
    show: 'friend',
    nullTip: nullTip,
    msgList: []
  },

  onShow: function(options) {
    this.onLoad();
  },

  onLoad: function(options) {
    var that = this;

    wx.request({
      url: app.url.msgList + "?openId=" + app.globalData.userInfo.openId,
      method: 'POST',
      success: function(res) {
        that.setData({
          msgList: res.data.message,
        });

      },
      fail: function(res) {}
    })
  },


  chooseMsg: function(e) {
    var id = e.currentTarget.dataset.msgid;
    wx.navigateTo({
      url: "../messageInfo/messageInfo?id=" + id
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    util.pullDownRefresh();
  },
})