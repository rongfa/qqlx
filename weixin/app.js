//app.js
App({
  globalData: {
    userInfo: wx.getStorageSync('userInfo')
  },
  url: {
    //登录
    login: "https://www.wxgegz.com/gegz/wx/login",
    //矿山
    updateUser: "https://www.wxgegz.com/gegz/wx/updateUser",
    mineList: "https://www.wxgegz.com/gegz/mine/getMineList",
    mineInfo: "https://www.wxgegz.com/gegz/mine/getMineById",
    mineWork: "https://www.wxgegz.com/gegz/mine/mine",
    //宠物
    petList: "https://www.wxgegz.com/gegz/pet/getPetListByUserOpenId",
    getPet: "https://www.wxgegz.com/gegz/pet/getARandomPetDto",
    editPet: "https://www.wxgegz.com/gegz/pet/updatePetName",
    getLevelValue: "https://www.wxgegz.com/gegz/levelGrowValue/getLevelGrowValueList",
    //用户
    userInfo: "https://www.wxgegz.com/gegz/user/getPersonalInfoByOpenId",
    getUserByopenid: "https://www.wxgegz.com/gegz/user/getUserAndPetByOpenId",
    sign: "https://www.wxgegz.com/gegz/user/sign",
    rank: "https://www.wxgegz.com/gegz/user/getRank",
    setCity: "https://www.wxgegz.com/gegz/user/updateFactCityByUserOpenId",
    //消息
    msgList: "https://www.wxgegz.com/gegz/message/getMessageListByUserOpenId",
    msgInfo: "https://www.wxgegz.com/gegz/message/getMessageById",
    receiveMsg: "https://www.wxgegz.com/gegz/message/receive",
    //钱包
    getWallet: "https://www.wxgegz.com/gegz/wallet/getWalletByUserId",
    //服务
    getServiceInfo: "https://www.wxgegz.com/gegz/serviceInfo/getServiceInfo",
    //广告
    insertAdIn: "https://www.wxgegz.com/gegz/adIn/insertAdIn",
    getAdInfo: "https://www.wxgegz.com/gegz/adInfo/getAdInfo",
    //分享    
    share: "https://www.wxgegz.com/gegz/user/share",
  },

  onLaunch: function() {
    var that = this;

    // if (that.globalData.userInfo) {
    //   return;
    // }


    var wxuser;
    //获取用户信息
    wx.getUserInfo({
      success: res => {
        wxuser = res.userInfo;
        if (!wxuser) {
          return;
        }

        wx.login({
          success: res => {
            if (res.code) {
              var jscode = res.code;
              wx.request({
                url: that.url.login,
                data: {
                  code: jscode
                },
                success: function(data) {
                  wxuser.openId = data.data.message.openid;
                  // that.globalData.userInfo = wxuser;

                  // wx.setStorageSync("userInfo", wxuser);

                  wx.request({
                    url: that.url.updateUser,
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
                      wxuser.factCity = res.data.message.factCity;
                      that.globalData.userInfo = wxuser;

                      wx.setStorageSync("userInfo", wxuser);
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

      }
    })
  }

})