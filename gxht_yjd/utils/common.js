/**
 * 公共js文件
 * 使用方法：
 * 1、在需要使用的js顶部引用：var common = require("../../utils/common.js");
 * 2、使用： common.Request(_url, "post", "", function (res) { 
    that.setData({
      lunboData: res.data.data.lunbo
    })
  });
 */

var common = {
  Request: function (_url, method, data, callBack) {
    wx.request({
      url: _url,
      method: method,
      data: {
        data
      },
      header: {
        'content-type': 'json'
      },
      success: function (res) {
        callBack(res);
      },
      fail: function (res) {
        console("error res=" + res.data);
      }
    })
  }
  
}

module.exports = common;