/**
 * 小程序配置文件
 */

var host = "www.gxht.net.cn/yjdPlatform"

var config = {

  // 下面的地址配合Server 工作
  host,

  //首页--获取轮播图数据
  getLunboUrl: `https://${host}/findLunbo.do`,

  //首页--获取九宫格数据
  getJiuUrl: `https://${host}/findHengpai.do`,

  //首页--获取首页列表数据
  getHomeListUrl: `https://${host}/findShupai.do`,

  //首页--获取首页公告数据
  getHomeGonggaoUrl: `https://${host}/getGunDongData.do`,

  //首页--定位
  getPosition: `https://${host}/getLocation.do`,

  //申请页面--获取手机验证码
  getCode: `https://${host}/getCode.do?phone=`,

  //申请页面--获取背景图片
  getSqBackgroundImg: `https://${host}/findSonPicture.do?id=`,

  //服务--获取服务列表
  getServiceImg: `https://${host}/findPageTwoImg.do`,

  //列表页--搜索
  search: `https://${host}/findMerchant.do?title=`,

  //列表页--根据城市获取列表数据
  getList: `https://${host}/findMerchants.do?`,

  // 下载示例图片接口
  downloadExampleUrl: `https://${host}/static/weapp.jpg`
};

module.exports = config
