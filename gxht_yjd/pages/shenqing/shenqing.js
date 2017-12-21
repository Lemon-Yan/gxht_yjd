// shenqing.js
var common = require("../../utils/common.js");
var config = require('../../config');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //imageUrl: "../../images/shenqing.png",
    VerifyCode: "获取验证码",
    btnDis: false,
    btnSq: false
  },
  //获取输入的姓名
  bindNameInput: function (e) {
    this.setData({
      Name: e.detail.value
    })
  },
  //手机输入框遗失光标则获取value然后把数据放入this.data.phoneNum中去
  blurTel: function (e) {
    var phoneNum = e.detail.value.replace(/\s/g, "");
    //console.log(phoneNum + "...phoneNum");
    this.setData({
      phoneNum: phoneNum
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
        title: '手机格式错误',
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
      //console.log(JSON.stringify(res)+"...验证码..."+res.data.message);
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
    var that = this;
    var _name = that.data.Name;
    var _phone = that.data.phoneNum;
    var _code = that.data.Code;
    var _pictureId = that.data.listId;

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
    }
    // wx.showLoading({
    //   title: '提交中',
    // }) 
    // setTimeout(function () {
    //   wx.hideLoading();
    // }, 3000);
    wx.showToast({
      title: '已提交！',
      icon: 'success',
      duration: 1000
    })

    that.setData({
      btnSq: true
    })

    that.setData({
      resetName: '',
      resetPhone: '',
      resetCode: ''
    })

    wx.showLoading({
      title: '请稍候...',
    })

    setTimeout(function () {
      wx.hideLoading();
    }, 5000);

    var sqUrl = "https://www.gxht.net.cn/yjdPlatform/doApplication.do?name=" + _name + "&code=" + _code + "&pictureId=" + _pictureId + "&phone=" + _phone;
    sqUrl = encodeURI(sqUrl);
    //console.log(_name + "...phone..." + _phone + "...code.." + _code + "...listId..." + _pictureId);
    //console.log(sqUrl);
    common.Request(sqUrl, "get", "", function (res) { 
      //console.log(res + "...立即申请...." + res.data.message);
      if (res.data.state == "1") {
        wx.showModal({
          title: '提示',
          content: "申请成功，稍后工作人员将与您联系！",
          showCancel: false,
          success: function (res) {
            wx.redirectTo({
              url: '../sqSuccess/sqSuccess',  //sqFail/sqFail
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
              // wx.navigateBack({
              //   delta: 1
              // })
              wx.redirectTo({
                url: '../sqFail/sqFail',  //sqFail/sqFail
              })
            }
          }
        })
      }
      wx.hideLoading();
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //console.log("id..." + options.id);
    wx.setNavigationBarTitle({
      title: options.headName//页面标题为路由参数
    })
    that.setData({
      listId: options.id
    })

    wx.showLoading({
      title: '加载中',
    })

    //获取申请背景图
    wx.showNavigationBarLoading();
    common.Request(config.getSqBackgroundImg + options.id, "post", "", function (res) {
      that.setData({
        imageUrl: res.data.data
      })
      wx.hideNavigationBarLoading();
      wx.hideLoading();
    })
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