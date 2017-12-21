//index.js
//获取应用实例
var app = getApp();
var common = require("../../utils/common.js");
var config = require('../../config');
Page({
  data: {
    //轮播图配置
    autoplay: true,
    interval: 3000,
    duration: 1200,
    currentAddress: "定位中...",
    loading: true
  },

  onLoad: function () {
    //console.log('onLoad')
    var that = this;

    wx.showLoading({
      title: '加载中',
    }) 
    //获取当前位置经纬度
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //console.log("获取当前经纬度：" + JSON.stringify(res));
        //发送请求通过百度经纬度反查地址信息 
        var getAddressUrl = config.getPosition + "?latitude=" + res.latitude + "&longitude=" + res.longitude;
        common.Request(getAddressUrl, "get", "", function (ops) {
          //console.log("地图：" + JSON.stringify(ops));
          var city_code = ops.data.ad_info.city_code;
          var city = ops.data.ad_info.city;
          // console.log(currentPosition); 
          wx.setStorageSync('city_code', city_code);
          that.setData({
            currentAddress: city,
            loading: true
          })
          //wx.hideLoading();
        })
      }
    })

    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })

    //获取轮播图数据
    common.Request(config.getLunboUrl, "post", "", function (res) {
      //console.log("轮播图数据集：....." + JSON.stringify(res.data));
      that.setData({
        lunboData: res.data.data.lunbo
      })
    })

    //获取九宫格数据
    common.Request(config.getJiuUrl, "post", "", function (res) {
      //console.log(JSON.stringify(res.data.data.henpai));
      that.setData({
        jiuData: res.data.data.henpai
      })
    })
    //获取列表数据
    common.Request(config.getHomeListUrl, "post", "", function (res) {
      wx.hideLoading();
      //console.log(JSON.stringify(res.data.data.shupai));
      that.setData({
        listData: res.data.data.shupai
      })
    })

    //获取公告数据
    common.Request(config.getHomeGonggaoUrl, "post", "", function (res) {
      that.setData({
        gundongData: res.data.data
      })
    })
  }
})
