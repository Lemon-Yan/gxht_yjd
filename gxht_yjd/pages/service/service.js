// service.js
var common = require("../../utils/common.js");
var config = require('../../config');

Page({
  data: {
      
  },
  onLoad: function () {
    var that = this;
    //获取服务页面数据
    common.Request(config.getServiceImg, "post", "", function (res) {
      //console.log(JSON.stringify(res.data)); 
      that.setData({
        serviceData: res.data.data
      })
    })
  }

})