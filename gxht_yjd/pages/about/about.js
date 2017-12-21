// about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 29.880320,
    longitude: 121.571920,
    markers: [{
      latitude: 29.880320,
      longitude: 121.571920,
      name: '宁波市鄞州区百隆巷1号'
    }]

  },

  //拨打电话
  makePhoneCall: function () {
    //var that = this
    wx.makePhoneCall({
      phoneNumber: '13655880858',
      success: function () {
        console.log("成功拨打电话")
      }
    })
  },

  //打开所在位置
  openLocation: function (e) {
    wx.openLocation({
      longitude: 121.571920,
      latitude: 29.880320,
      name: '盛世国际805',
      address: '宁波市鄞州区百隆巷1号'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})