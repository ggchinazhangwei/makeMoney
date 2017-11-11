

angular.module('ued').service('WebApi', function () {
    /**
     * 示例，应该删除
     */
//  this.test = function () {
//      return ued.get('/hello').then(function (res) {
//          // 可以先做一些数据处理等操作 再返回想要的内容，
//          // 下一次 then 就是这里 return 的值
//          var result = res.result
//          result.abcd = 1234
//          return result
//      })
//  }
//
//  this.abc = function () {
//      return ued.post('/abc', {d: 'e'})
//  }
    
    //获取微信
    this.getWeiXin = function (data) {
    	return ued.get('http://weixin.bbpapp.com/lesson/weixin/getwxjsconfig',data)
    }
    
    //判断登录
    this.isLogin = function(data){
    	return ued.get('http://campaigns.bbpapp.com/cc266c08/index/checkLogin',data)
    }
    
    //获取抽奖次数
    this.getTimes = function(data){
    	return ued.get('http://campaigns.bbpapp.com/cc266c08/index/UserSweepstakesNum',data)
    }
    
    //获取奖品
    this.getAward = function (data) {
    	return ued.get('http://campaigns.bbpapp.com/cc266c08/index/startSweepstakes',data)
    }
    
    //提交地址
    this.updataLoco = function(data){
    	return ued.post('http://campaigns.bbpapp.com/cc266c08/index/createAddress',data)
    }
    
    //获取我的奖品
    this.getMyPrize = function(data){
    	return ued.get('http://campaigns.bbpapp.com/cc266c08/index/myPrizeList',data)
    }
    
    
})
