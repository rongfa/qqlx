const app = getApp();
var util = require('../../common/utils/util.js');

Page({
  data: {
    hiddenmodalput: true,
    phone: null,
    money: null,

    content: null,
    version: null,
    type: null
  },

  onLoad: function (options) {
    var that = this;

    wx.request({
      url: app.url.getAdInfo,
      method: 'POST',
      success: function (res) {
        that.setData({
          content: res.data.message.content,
          version: res.data.message.version,
          type: res.data.message.type
        });
      },
      fail: function (res) { }
    })
  },

  //点击按钮痰喘指定的hiddenmodalput弹出框
  enter: function() {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput,
      isFocus: true
    })
  },

  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  moneyInput: function(e) {
    this.setData({
      money: e.detail.value
    })
  },

  //确认
  confirm: function(e) {
    var that = this;

    if (!that.data.phone) {
      wx.showModal({
        title: '',
        content: '请输入电话',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {} else if (res.cancel) {}
        }
      })
      return;
    }

    if (!that.data.money) {
      wx.showModal({
        title: '',
        content: '请输入金额',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {} else if (res.cancel) {}
        }
      })
      return;
    }

    this.setData({
      hiddenmodalput: true,
    })


    wx.request({
      url: app.url.insertAdIn + "?amount=" + that.data.money + "&phone=" + that.data.phone,
      method: 'POST',
      success: function(res) {
        wx.showToast({
          title: '提交成功',
          icon: 'succes',
          duration: 1500,
          mask: true
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '提交失败',
          icon: 'succes',
          duration: 1500,
          mask: true
        })
      }
    })

  },

  //取消按钮
  cancel: function() {
    this.setData({
      hiddenmodalput: true
    });
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    util.pullDownRefresh();
  },
})