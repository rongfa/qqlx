const app = getApp();
var util = require('../../common/utils/util.js');

var nullTip = {
  tipText: '地域排名需要获取你的地理位置',
  actionText: '获取位置',
  fn: 'refreshCity'
}

Page({
  data: {
    show: 'area',
    nullTip: nullTip,
    allList: [],
    areaList: [],
    userInfo: app.globalData.userInfo,
    locationHidden: true,
    currentCity: "城市"
  },

  onShow: function (options) {
    this.onLoad();
  },

  onLoad: function(options) {
    var self = this;
    var tempCity = app.globalData.userInfo.factCity;

    if (tempCity) {
      self.setData({
        currentCity: tempCity
      });

      wx.request({
        url: app.url.rank + "?city=" + tempCity,
        method: 'POST',
        success: function(res) {
          self.setData({
            areaList: res.data.message,
          });
        },
        fail: function(res) {}
      })
    }
  },

  changeViewType: function(e) {
    var that = this;
    var data = e.currentTarget.dataset
    that.setData({
      show: data.type
    })

    if (that.data.show == "area") {
      wx.request({
        url: app.url.rank + "?city=" + that.data.userInfo.factCity,
        method: 'POST',
        success: function(res) {
          that.setData({
            areaList: res.data.message,
          });
        },
        fail: function(res) {}
      })
    } else {
      wx.request({
        url: app.url.rank,
        method: 'POST',
        success: function(res) {
          that.setData({
            allList: res.data.message,
          });
        },
        fail: function(res) {}
      })
    }
  },

  chooseRank: function(e) {
    wx.navigateTo({
      url: "../userInfo/userInfo?rankid=" + e.currentTarget.dataset.rankid
    })
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
            if (res.confirm) {

              self.setData({
                currentCity: city
              });

              wx.request({
                url: app.url.setCity + "?openId=" + self.data.userInfo.openId + "&city=" + city,
                method: 'POST',
                success: function(res) {
                  wx.request({
                    url: app.url.rank + "?city=" + city,
                    method: 'POST',
                    success: function(res) {
                      self.setData({
                        areaList: res.data.message,
                      });
                    },
                    fail: function(res) {}
                  })
                },
                fail: function(res) {}
              })
            }
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