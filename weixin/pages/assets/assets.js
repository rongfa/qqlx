const app = getApp();
var util = require('../../common/utils/util.js');

Page({
  data: {
    assets: null,
    assetsRecord: [],
  },


  onLoad: function(options) {
    var that = this;

    wx.request({
      url: app.url.getWallet + "?openId=" + app.globalData.userInfo.openId,
      method: 'POST',
      success: function(res) {
        that.setData({
          assets: res.data.message.walletDto,
          assetsRecord: res.data.message.walletRecordDtos
        });

      },
      fail: function(res) {}
    })
  },

  extract: function(e) {
    wx.showModal({
      title: '',
      content: '提现最小金额为50',
      showCancel: false,
      success: function(res) {
        if (res.confirm) {} else if (res.cancel) {}
      }
    })

    // wx.sendBizRedPacket({
    //   timeStamp: e.timeStamp,
    //   nonceStr: e.nonceStr,
    //   package: e.package,
    //   signType: e.signType,
    //   paySign: e.paySign,
    //   success: function(res) {
    //     console.log('红包success')
    //     let url = config.HTTP_Prize_URL + '/v1/sign_tmp/sendSuccess.do';
    //     let data = {
    //       minipid: that.data.minipid,
    //       date: that.data.date
    //     }
    //     console.log('红包成功以后接口请求参数数据:' + JSON.stringify(data))
    //     util.request(url, 'post', data, '正在加载数据', function(res) {
    //       console.log('红包成功以后接口返回结果:' + JSON.stringify(res.data))
    //     })
    //     wx.reLaunch({
    //       url: '../my_prize/my_prize_2?reward=' + res.data.body.reward,
    //     })
    //   },
    //   fail: function(res) {
    //     console.log('红包fail', res)
    //   },
    //   complete: function(res) {
    //     console.log('红包complete', res)
    //   }
    // })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    util.pullDownRefresh();
  },

})