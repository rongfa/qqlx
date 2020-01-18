const app = getApp();
var util = require('../../common/utils/util.js');

Page({
  data: {
    mineId: -1,
    workTime: 2,
    status: false,
    hiddenmodalput: true,
    mineInfo: null,
    petList: [],
    petIndex: 0
  },

  onLoad: function(options) {
    var that = this;

    if (options.id) {
      this.setData({
        mineId: options.id
      });

      wx.request({
        url: app.url.mineInfo + "?id=" + options.id + "&openId=" + app.globalData.userInfo.openId,
        method: 'POST',
        success: function(res) {
          that.setData({
            mineInfo: res.data.message,
            status: res.data.message.status
          });

        },
        fail: function(res) {}
      })
    }

    if (app.globalData.userInfo.openId) {
      wx.request({
        url: app.url.petList + "?openId=" + app.globalData.userInfo.openId,
        method: 'POST',
        data: {},
        success: function(res) {
          that.setData({
            petList: res.data.message,
          });

        },
        fail: function(res) {}
      })
    }


  },

  //点击按钮痰喘指定的hiddenmodalput弹出框
  work: function() {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput,
    })
  },

  //输入挖矿时间
  workTimeInput: function(e) {
    this.setData({
      workTime: e.detail.value
    })
  },


  //确认
  confirm: function(e) {
    var that = this;

    wx.request({
      url: app.url.mineWork + "?mineId=" + that.data.mineId + "&petId=" + that.data.petList[that.data.petIndex].id + "&mineTimeValue=" + that.data.workTime,
      method: 'POST',
      success: function(res) {
        that.setData({
          hiddenmodalput: true,
          status: true
        });
        wx.showToast({
          title: '挖矿成功',
          icon: 'succes',
          duration: 1500,
          mask: true
        })
      },
      fail: function(res) {}
    })

  },

  //取消按钮
  cancel: function() {
    this.setData({
      hiddenmodalput: true
    });
  },


  /*点击减号*/
  bindMinus: function() {
    var workTime = this.data.workTime;
    if (workTime > 2) {
      workTime--;
    }

    this.setData({
      workTime: workTime
    })
  },
  /*点击加号*/
  bindPlus: function() {
    var workTime = this.data.workTime;

    if (workTime < 10) {
      workTime++;
    }

    this.setData({
      workTime: workTime
    })
  },

  selectPet(e) {
    const val = e.detail.value
    this.setData({
      petIndex: val[0]
    })
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    util.pullDownRefresh();
  },
})