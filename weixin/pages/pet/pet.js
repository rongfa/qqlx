const app = getApp();
var util = require('../../common/utils/util.js');

var nullTip = {
  tipText: '你还没有宠物哦',
  actionText: '免费领取一个',
  fn: 'receive'
}

Page({
  data: {
    friendName: '',
    hiddenfriendmodal: true,
    hiddenmodalput: true,
    length: 6,
    isFocus: false,
    code: "",

    editStatus: false,

    petList: [],

    nullTip: nullTip,

    levelList: [{
        l: 1,
        c: 100,
        h: 100
      },
      {
        l: 2,
        c: 200,
        h: 200
      },
      {
        l: 3,
        c: 400,
        h: 400
      },
      {
        l: 4,
        c: 800,
        h: 800
      },
      {
        l: 5,
        c: 1600,
        h: 1600
      },
      {
        l: 6,
        c: 3200,
        h: 3200
      },
      {
        l: 7,
        c: 6400,
        h: 6400
      },
      {
        l: 8,
        c: 12800,
        h: 12800
      },
      {
        l: 9,
        c: 25600,
        h: 25600
      },
      {
        l: 10,
        c: 51200,
        h: 51200
      },
    ],

  },

  onShow: function(options) {
    this.onLoad();
  },


  onLoad: function(options) {
    var that = this;

    wx.request({
      url: app.url.petList + "?openId=" + app.globalData.userInfo.openId,
      method: 'POST',
      data: {},
      success: function(res) {
        that.setData({
          petList: res.data.message,
        });

        if (app.globalData.friendCode && app.globalData.friendName && that.data.petList.length == 0) {
          that.setData({
            hiddenfriendmodal: false,
            code: app.globalData.friendCode,
            friendName: app.globalData.friendName
          })
        }
      },
      fail: function(res) {}
    })
  },

  toWOrk: function() {
    wx.switchTab({
      url: '../mine/mine'
    });
  },

  //点击按钮痰喘指定的hiddenmodalput弹出框
  receive: function() {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput,
      isFocus: true
    })
  },

  //确认
  confirm: function(e) {
    var that = this;

    wx.request({
      url: app.url.getPet + "?openId=" + app.globalData.userInfo.openId + "&inviteNum=" + that.data.code,
      method: 'POST',
      data: {},
      success: function(res) {
        var newPetList = that.data.petList;
        newPetList.push(res.data.message);

        that.setData({
          hiddenmodalput: true,
          hiddenfriendmodal: true,
          isFocus: false,
          petList: newPetList,
        });

        wx.showToast({
          title: '领取成功',
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
      hiddenmodalput: true,
      hiddenfriendmodal: true,
    });
  },

  Focus(e) {
    var that = this;
    var inputValue = e.detail.value;
    that.setData({
      code: inputValue
    })
  },

  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },

  editName: function(e) {
    return e.detail.value.replace(/\s+/g, '');
  },

  saveName: function(e) {
    var that = this;

    var newName = e.detail.value;
    var editpetid = e.currentTarget.dataset.editpetid;

    if (!newName) {
      wx.showModal({
        title: '',
        content: '名称不能为空',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {} else if (res.cancel) {}
        }
      })
      return;
    }

    wx.request({
      url: app.url.editPet + "?id=" + editpetid + "&name=" + newName,
      method: 'POST',
      data: {},
      success: function(res) {

        var newList = [];
        for (var i in that.data.petList) {
          var pet = that.data.petList[i];
          if (editpetid == pet.id) {
            pet.name = newName;
          }
          newList.push(pet);
        }

        that.setData({
          editStatus: false,
          petList: newList,
        })

        wx.showToast({
          title: '修改成功',
          icon: 'succes',
          duration: 1500,
          mask: true
        })
      },
      fail: function(res) {}
    })
  },

  edit: function() {
    this.setData({
      editStatus: true,
    })
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    util.pullDownRefresh();
  },
})