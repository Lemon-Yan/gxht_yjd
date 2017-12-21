// pages/serviceDetail/serviceDetail.js
var common = require("../../utils/common.js");
var config = require('../../config');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // imageUrl: "../../images/a-5.png",
    VerifyCode: "获取验证码",
    btnDis: false,
    wangdai: false,
    btnSq: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      listId: options.id
    })
    //console.log("id:" + options.id);
    if (options.id == "42") {
      that.setData({
        wangdai: true
      })
    } else {
      that.setData({
        wangdai: false
      })
    }

    wx.showLoading({
      title: '加载中',
    })
    //获取申请背景图 
    common.Request(config.getSqBackgroundImg + options.id, "post", "", function (res) {
      that.setData({
        imageUrl: res.data.data
      })
      wx.hideLoading();
    })
  },
  //获取输入的姓名
  bindNameInput: function (e) {
    this.setData({
      Name: e.detail.value
    })
  },
  //获取身份证号码
  bindIDCardInput: function (e) {
    this.setData({
      IDCard: e.detail.value
    })
  },
  //手机输入框遗失光标则获取value然后把数据放入this.data.phoneNum中去
  bindPhone: function (e) {
    var phoneNum = e.detail.value.replace(/\s/g, "");
    this.setData({
      phoneNum: phoneNum
    })
  },
  //获取查询人的手机号码
  bindPhone2: function (e) {
    var phoneNum2 = e.detail.value.replace(/\s/g, "");
    this.setData({
      phoneNum2: phoneNum2
    })
  },
  //获取输入的验证码
  bindCodeInput: function (e) {
    this.setData({
      Code: e.detail.value
    })
  },

  //点击发送验证码，获取手机号码，往后台发送数据
  setVerify: function (e) {
    var phoneNum = this.data.phoneNum;
    if (phoneNum == "" || phoneNum == null || phoneNum == undefined) {
      wx.showToast({
        title: '请输入手机号',
        image: "../../images/tishi6.png"
      })
      return false;
    } else if (!(/^1[34578]\d{9}$/.test(phoneNum))) {
      wx.showToast({
        title: '手机号格式错误',
        image: "../../images/tishi5.png"
      })
      return false;
    }
    //这个由后台或者你们公司的短信平台提供，一般是http://ip:prot/短信验证项目和具体地址
    var _Url = "https://www.gxht.net.cn/yjdPlatform/getCode.do?phone=" + phoneNum;
    //表示60秒倒计时，想要变长就把60修改更大 
    var total_micro_second = 60 * 1000;
    //验证码倒计时
    count_down(this, total_micro_second);
    common.Request(config.getCode + phoneNum, "get", "", function (res) {
      //console.log(JSON.stringify(res) + "...验证码..." + res.data.message);
      if (res.data.state == "1") {
        wx.showToast({
          title: '验证码发送成功！',
          icon: 'success',
          duration: 2000
        })
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.message,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              //返回上一页
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
    })
  },

  //点击申请
  submit: function () {
    // wx.redirectTo({
    //   url: '../queryResult/queryResult',
    // })
    // return false;

    var that = this;
    var _name = that.data.Name; 
    var _phone = that.data.phoneNum;
    var _code = that.data.Code;
    var _pictureId = that.data.listId;
    var _IDCard = that.data.IDCard;
    var queyrPhone = (that.data.phoneNum2 == undefined) ? "" : that.data.phoneNum2;
    //console.log(_name + "...phoneNum2..." + queyrPhone + "...code.." + _code + "...listId..." + _pictureId + _phone);
    if (_name == "" || _name == null || _name == undefined) {
      wx.showToast({
        title: '请输入姓名',
        image: "../../images/tishi6.png"
      })
      return false;
    } else if (_phone == "" || _phone == null || _phone == undefined) {
      wx.showToast({
        title: '请输入手机号',
        image: "../../images/tishi6.png"
      })
      return false;
    } else if (_code == "" || _code == null || _code == undefined) {
      wx.showToast({
        title: '请输入验证码',
        image: "../../images/tishi6.png"
      })
      return false;
    } else if (_IDCard == "" || _IDCard == null || _IDCard == undefined) {
      wx.showToast({
        title: '请输入身份证',
        image: "../../images/tishi6.png"
      })
      return false;
    }
    wx.showToast({
      title: '已提交！',
      icon: 'success',
      duration: 1000
    })
    //设置提交按钮禁用
    that.setData({
      btnSq: true
    })
    //清空输入框
    that.setData({
      resetName: '',
      resetIDCard: '',
      resetPhone: '',
      resetPhone2: '',
      resetCode: ''
    })

    wx.showLoading({
      title: '查询中,请稍候！',
    })

    setTimeout(function () {
      wx.hideLoading();
    }, 5000);

    var _url = "https://www.gxht.net.cn/yjdPlatform/getAuthenticationInfo.do?name=" + _name + "&code=" + _code + "&id=" + _pictureId + "&sendPhone=" + _phone + "&cardNo=" + _IDCard + "&queryPhone=" + queyrPhone; 
    _url = encodeURI(_url); 
    common.Request(_url, "get", "", function (res) {
      //console.log("...查询结果...." + JSON.stringify(res)); 
      //成功跳转到返回结果页面，失败弹出错误信息
      if (res.data.state == 1) {
        wx.setStorageSync('queryResult', res.data.data);
        wx.showModal({
          title: '提示',
          content: "查询成功！",
          showCancel: false,
          success: function (res) {
            wx.redirectTo({
              url: '../queryResult/queryResult',
            })
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.message,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              //返回上一页
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
      wx.hideLoading();
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

//下面的代码在page({})外面
/* 毫秒级倒计时 */
function count_down(that, total_micro_second) {
  that.setData({
    btnDis: true
  });
  if (total_micro_second <= 0) {
    that.setData({
      VerifyCode: "重新发送",
      btnDis: false
    });
    // timeout则跳出递归 
    return;
  }

  // 渲染倒计时时钟
  that.setData({
    VerifyCode: date_format(total_micro_second) + " 秒"
  });

  setTimeout(function () {
    // 放在最后--
    total_micro_second -= 10;
    count_down(that, total_micro_second);
  }, 10)
}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

  return sec;
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}