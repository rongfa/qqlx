function pullDownRefresh() {
  //在标题栏中显示加载图标
  wx.showNavigationBarLoading();

  var pages = getCurrentPages();
  var prevPage = pages[pages.length - 1]; //当前页面
  prevPage.onLoad(prevPage.options)

  //停止下拉刷新
  wx.hideNavigationBarLoading();
  wx.stopPullDownRefresh();
}

module.exports = {
  pullDownRefresh: pullDownRefresh,
}