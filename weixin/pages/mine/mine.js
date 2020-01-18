const app = getApp();
var util = require('../../common/utils/util.js');

Page({
  data: {
    login: true,
    mineList: [],
    systemList: null,
    myMineId: 1
  },
  
  onShow: function (options) {
    this.onLoad();
  },

  onLoad: function() {
    var that = this;
    that.initUserInfo();

    wx.request({
      url: app.url.mineList + "?openId=" + app.globalData.userInfo.openId,
      method: 'POST',
      data: {},
      success: function(res) {
        that.setData({
          mineList: res.data.message.ordinary,
          systemList: res.data.message.system,
        });

      },
      fail: function(res) {}
    })
  },

  chooseMine: function(e) {
    var id = e.currentTarget.dataset.mineid;
    wx.navigateTo({
      url: "../mineInfo/mineInfo?id=" + id
    })
  },

  chooseAD: function(e) {
    wx.navigateTo({
      url: "../enterAd/enterAd"
    })
  },

  initUserInfo: function() {
    if (app.globalData.userInfo) {
      return;
    }

    var that = this;

    var wxuser;
    //获取用户信息
    wx.getUserInfo({
      success: res => {
        wxuser = res.userInfo;
        if (!wxuser) {
          that.setData({
            login: false
          })
          return;
        }

        wx.login({
          success: res => {
            that.setData({
              login: true
            })
            if (res.code) {
              var jscode = res.code;
              wx.request({
                url: app.url.login,
                data: {
                  code: jscode
                },
                success: function(data) {
                  wxuser.openId = data.data.message.openid;
                  app.globalData.userInfo = wxuser;
                  wx.setStorageSync("userInfo", res.data);

                  wx.request({
                    url: app.url.updateUser,
                    method: 'POST',
                    data: {
                      avatarUrl: wxuser.avatarUrl,
                      city: wxuser.city,
                      country: wxuser.country,
                      gender: wxuser.gender,
                      language: wxuser.language,
                      nickName: wxuser.nickName,
                      openId: wxuser.openId,
                      province: wxuser.province
                    },
                    success: function(res) {
                      console.log('登录成功！');
                    },
                    fail: function(res) {
                      console.log('登录失败！')
                    }
                  })
                }
              })
            }
          }
        })
      },
      fail: function() {
        that.setData({
          login: false
        })
      }
    })
  },

  getUserInfo: function(res) {
    var that = this;
    var wxuser = res.detail.userInfo;

    this.setData({
      login: true,
    })

    //获取用户信息
    wx.login({
      success: res => {
        if (res.code) {
          var jscode = res.code;
          wx.request({
            url: app.url.login,
            data: {
              code: jscode
            },
            success: function(data) {
              wxuser.openId = data.data.message.openid;
              app.globalData.userInfo = data
              wx.setStorageSync("userInfo", res.data);

              wx.request({
                url: app.url.updateUser,
                method: 'POST',
                data: {
                  avatarUrl: wxuser.avatarUrl,
                  city: wxuser.city,
                  country: wxuser.country,
                  gender: wxuser.gender,
                  language: wxuser.language,
                  nickName: wxuser.nickName,
                  openId: wxuser.openId,
                  province: wxuser.province
                },
                success: function(res) {
                  console.log('登录成功！');
                },
                fail: function(res) {
                  console.log('登录失败！')
                }
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

  },
  //取消按钮
  cancel: function() {
    this.setData({
      login: true
    });
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    util.pullDownRefresh();
  },

})