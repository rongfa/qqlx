const app = getApp();
var util = require('../../common/utils/util.js');

Page({
  data: {
    userInfo: null,
    locationHidden: true,
    signStatus: false,
    msgStatus: false,
  },

  onShow: function (options) {
    this.onLoad();
  },

  onLoad: function(options) {
    var that = this;
    wx.request({
      url: app.url.userInfo + "?openId=" + app.globalData.userInfo.openId,
      method: 'POST',
      success: function(res) {
        that.setData({
          userInfo: res.data.message.userDto,
          signStatus: res.data.message.signStatus,
          msgStatus: res.data.message.ifHaveUnReadMessage,
        });

      },
      fail: function(res) {}
    })
  },

  viewAssets: function() {
    wx.navigateTo({
      url: "../assets/assets"
    })
  },

  viewMessage: function() {
    wx.navigateTo({
      url: "../message/message"
    })
  },

  viewService: function() {
    wx.navigateTo({
      url: "../service/service"
    })
  },

  viewEnterAd: function() {
    wx.navigateTo({
      url: "../enterAd/enterAd"
    })
  },


  signIn: function() {
    var that = this;
    wx.request({
      url: app.url.sign + "?openId=" + app.globalData.userInfo.openId,
      method: 'POST',
      success: function(res) {

        var temp = that.data.userInfo;
        temp.continueSignNum = res.data.message.continueSignNum;

        that.setData({
            signStatus: true,
            userInfo: temp,
          }),
          wx.showModal({
            title: '签到成功',
            content: '连续签到' + res.data.message.continueSignNum + '天，成长值+' + res.data.message.signNum,
            showCancel: false,
            success: function(res) {
              if (res.confirm) {

              }
            }
          })
      },
      fail: function(res) {}
    })
  },

  onShareAppMessage: function(ops) {
    var that = this;

    if (ops.from === 'button') { // 来自页面内转发按钮      
      console.log(ops.target)
    }
    return {
      title: '快来和我一起挖矿',
      path: 'pages/start/start?friendCode=' + that.data.userInfo.id + '&friendName=' + app.globalData.userInfo.nickName,
      success: function(res) {
        wx.request({
          url: app.url.share + "?openId=" + app.globalData.userInfo.openId,
          method: 'POST',
          success: function(res) {
            // wx.showToast({
            //   title: '邀请成功',
            //   icon: 'success',
            //   duration: 1500
            // })
          },
          fail: function(res) {}
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '邀请失败',
          icon: 'success',
          duration: 1500
        })
      }
    }
  },

  refreshCity: function() {
    var self = this;
    wx.getLocation({
      type: 'wgs84',
      altitude: true,
      success: function(res) {
        var log = res.longitude
        var lat = res.latitude
        self.loadCity(log, lat)
      },
      fail: function(res) {
        wx.getSetting({
          success: res => {
            if (!res.authSetting['scope.userLocation']) {
              self.setData({
                locationHidden: false
              })
            }
          }
        })
      }
    })
  },

  handler: function(e) {
    var that = this;
    that.setData({
      locationHidden: true
    })
    if (!e.detail.authSetting['scope.userLocation']) {
      wx.showToast({
        title: '授权失败',
        icon: 'success',
        duration: 1500
      })
    } else {
      wx.getLocation({
        type: 'wgs84',
        altitude: true,
        success: function(res) {
          var log = res.longitude
          var lat = res.latitude
          that.loadCity(log, lat)
        }
      })
    }
  },

  loadCity: function(log, lat) {
    var self = this
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=FX6ssafwLvyP2XqqjeT9y3UR26uMWnQV&location=' + lat + ',' + log + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        var city = res.data.result.addressComponent.city;
        wx.showModal({
          title: '',
          content: '更新成功：' + city,
          showCancel: false,
          success: function(res) {
            wx.request({
              url: app.url.setCity + "?openId=" + self.data.userInfo.openId + "&city=" + city,
              method: 'POST',
              success: function(res) {},
              fail: function(res) {}
            })
          }
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '更新失败',
          icon: 'success',
          duration: 1500
        })
      },
      complete: function() {}
    })
  },
  //取消按钮
  cancel: function() {
    this.setData({
      locationHidden: true
    });
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    util.pullDownRefresh();
  },

})