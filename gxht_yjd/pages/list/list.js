// pages/list/list.js
var app = getApp();
var common = require("../../utils/common.js");
var config = require('../../config');
var currentPage = 0;
var listDataArray = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchInput: "",
    searchResultShowed: false,
    widt_100: "widt_100",
    searchNoData: false,
    noData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: options.headName//页面标题为路由参数
    })

    listDataArray = [];
    that.setData({
      listId: options.id
    })
    //获取列表数据
    currentPage = 1;
    getListData(that, currentPage);
  },
  //获取输入的搜索内容
  bindInput: function (e) {
    var that = this;
    var _url = config.search + e.detail.value + "&id=" + that.data.listId;
    //根据关键字搜索
    common.Request(_url, "get", "", function (res) {
      //console.log(JSON.stringify(res.data.data));
      if (res.data.data == "[]" || res.data.data == "") {
        that.setData({
          listData: "",
          searchNoData: true
        })
      } else {
        that.setData({
          listData: res.data.data,
          searchNoData: false
        })
      }
    })
  },
  //清空输入的值
  cannel: function (e) {
    var that = this;
    that.setData({
      searchInput: "",
      searchResultShowed: false,
      widt_100: "widt_100"
    })
    //重新获取列表数据 
    listDataArray = [];
    currentPage = 1;
    getListData(that, currentPage);
  },
  //输入框获取焦点
  bindFocus: function (e) {
    var that = this;
    that.setData({
      searchResultShowed: true,
      widt_100: ""
    })
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
    currentPage = 0;
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
    var that = this;
    currentPage += 1;
    getListData(that, currentPage);
    //console.log("上啦到底了" + currentPage);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
//获取列表数据
function getListData(that, currentPage) { 
  var allPage = that.data.allPage;
  //console.log(allPage+"..."+currentPage);
  if (currentPage > allPage) {
    return false;
  }
  var currentCity = wx.getStorageSync('city_code');
  var listId = that.data.listId;
  var listUrl = config.getList + "hengpaiId=" + listId + "&citycode=" + currentCity + "&currentPage=" + currentPage;
  common.Request(listUrl, "get", "", function (res) { 
    var listData = res.data.data.pageInfo;
    //console.log(JSON.stringify(res.data.data));
    for (var i = 0; i < listData.length; i++) {
      listDataArray.push(listData[i]);
    }
    //console.log(JSON.stringify(listDataArray));
    if (listData == "[]" || listData == "") {
      that.setData({
        noData: true,
        searchNoData: false
      })
    } else {
      that.setData({
        listData: listDataArray,
        searchNoData: false,
        noData: false,
        allPage: res.data.data.pageObject.allPage
      })
    } 
  })
}