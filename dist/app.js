;(function() {
/* ========== main.js ========== */

/*
 |--------------------------------------------------------------------------
 | 设置本地模拟接口的目录
 |--------------------------------------------------------------------------
 | 如果不需要模拟 则删除此行
 |
 |
 */

ued.ajax.mock('mock')

/*
 |--------------------------------------------------------------------------
 | 解决移动端 click 300ms 延迟
 |--------------------------------------------------------------------------
 | 如果页面比较特殊会出现 BUG 则删除此行
 |
 |
 */

ued.fastclick()

/*
 |--------------------------------------------------------------------------
 | 微信 JSSDK 配置
 |--------------------------------------------------------------------------
 | 上线后，如果是 umaman.com 结尾的域名，这里不用改动
 | 如果是外部接口或者有特殊需求，请查看文档 /frontend/public/ued.js/doc/api.html
 |
 */

//ued.weixin.uma()

/*
 |--------------------------------------------------------------------------
 | 隐藏微信右上角分享按钮
 |--------------------------------------------------------------------------
 | 如果不需要隐藏，则删除此行
 | 如果想刚开始隐藏，等待 JSSDK 加载成功后才显示，也可以保留这行代码，不用删
 |
 */

//wx.ready(function () {
//  wx.hideOptionMenu()
//})

/*
 |--------------------------------------------------------------------------
 | 设置微信分享
 |--------------------------------------------------------------------------
 | 会在 config 成功后自动触发
 | 可以多次设置，会覆盖前面的设置
 |
 */

// ued.weixin.share({
//     title: '',
//     desc: '',
//     link: '',
//     imgUrl: ''
// })

/*
 |--------------------------------------------------------------------------
 | 百度统计
 |--------------------------------------------------------------------------
 | ued.baidu.track('百度统计代码问号后面那一串内容')，多个可以用数组
 |
 |
 */

// ued.baidu.track('???')

/*
 |--------------------------------------------------------------------------
 | ICC 统计
 |--------------------------------------------------------------------------
 | ued.track('填 openid')
 | 如果这个时候还拿不到openid 就在拿到之后再调用一次 ued.track() 和 ued.trackPage()
 |
 */

// ued.track('???')
//ued.trackPage()

/*
 |--------------------------------------------------------------------------
 | 定义 angular 模块
 |--------------------------------------------------------------------------
 | run 里可以注入 service 执行一些初始化逻辑
 | 如果不涉及 service 的调用，可以直接写在 run 外面
 |
 */

angular.module('ued', []).run(function (WebApi) {
		

})

/*
 |--------------------------------------------------------------------------
 | 加载主题
 |--------------------------------------------------------------------------
 | 主题名：通常是从接口获取、或者从 cookie 获取
 | 是否插入模式：如果是从异步接口获取的数据再加载主题，需要设置为 true
 |
 */

loadTheme('default')

function loadTheme (theme, append) {
    if (theme && theme != 'default') {
        var version = $('html').data('version')
        var css = 'dist/theme-' + theme + '.css?' + version
        var js = 'dist/theme-' + theme + '.js?' + version
        if (append) {
            Promise.all([ued.loadStyle(css), ued.loadScript(js)]).then(bootstrap)
            return
        }
        document.write('<link rel="stylesheet" href="' + css + '">')
        document.write('<script src="' + js + '"></script>')
    }
    bootstrap()
}

function bootstrap () {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['ued'])   //angular.bootstarp只会绑定第一次加载的对象   后面重复绑定或者其他对象绑定 都会在控制台输出错误
//      angular.bootstrap(element,['module'],['config']); //手动加载angularjs的模板   参数1：绑定的ng-app的dom元素  参数2：绑定的模块  参数3：附加的配置
    })
}


})();

;(function() {
/* ========== component/uAnchor.js ========== */

/**
 * 处理 <a> 的 href 属性，让跳转不受 <base> 影响
 * 如果 href 为 空、#、javascript: 开头，点击会阻止
 *
 * 如果不需要处理 或者 遇到严重 BUG，删除本文件，使用 JS 跳转: ued.href() ued.replace()
 */
angular.module('ued').directive('a', function () { //directive自定义指令 指令名称为a
    return {
        restrict: 'E', //取值有三种     A：用于元素Attribute   E:用于元素的名称        C：用于css中的class
        link: function (scope, element, attrs) { //link函数可以用于绑定一些事件
            $(element).on('click', function (event) {
                var href = $.trim($(this).attr('href')) //$.trim去除字符串两端空白字符 获取目标a元素的href值
                var target = $.trim($(this).attr('target')) //获取目标a元素的href值
                if (href === '' || href === '#' || href.indexOf('javascript:') === 0) {
                    return false
                }
                href = ued.path(href)
                switch (target) {
                    case '_blank':
                        window.open(href) 
                        break
                    case '_parent':
                        window.parent.open(href) 
                        break
                    case '_top':
                        window.top.open(href) 
                        break
                    default:
                        var iframe = $('iframe[name="' + target + '"]')
                        if (target !== '_self' && iframe.length) {
                            iframe.attr('src', href)
                        } else {
                            ued.href(href)
                        }
                }
                return false
            })
        }
    }
})

})();

;(function() {
/* ========== component/uRender.js ========== */

/**
 * 拿到标签渲染完的回调
 *
 * @example
 *  <div u-render="onRender()"></div>
 */
angular.module('ued').directive('uRender', function ($timeout) { //定义一个名为uRender的指令
    return {
        restrict: 'A', //attribute属性  用在元素的属性上
        link: function (scope, element, attrs) { //link函数用于绑定一些事件 和数据
            scope.$watch(function () {            //绑定监听事件
                scope.$eval(attrs.ngBindHtml)
            }, function (value) {
                $timeout(function () {
                    scope.$eval(attrs.uRender, {$element: element})
                })
            })
        }
    }
})

})();

;(function() {
/* ========== page/award.js ========== */

angular.module('ued').directive('pageAward', function (WebApi) {
    return {
        templateUrl: 'page/award.html',
        restrict: 'E',
        link: function (scope) {
            ued.title('中奖了！')
            
            scope.showHintCover = false;
            
            if(!ued.query('user_id')){
            	ued.href('index.html')
            	return
            }            
            //获取奖品
            scope.user_id = ued.query('user_id')
            getTimes(scope.user_id)
                        
            scope.showOne = true;
            scope.showFreeOpen = false;
            scope.showCredits = false;
            scope.showTicketOne = false;
            scope.showTicketTwo = false;
            scope.showCloth = false;           
            scope.showBuilding = false;
            scope.showThreePiece = false;
            
            
            //获取剩余敲门次数           
            function getTimes(user_id){
            	WebApi.getTimes({user_id: user_id}).always(function(){					
				}).then(function(res){
					console.info(res)
					if(res.result==0){
						scope.showHintCover = true;
						return;
					}
					//获取奖品
					getAward(scope.user_id)					
					
				},function(res){
					console.info(res)
				})
            }
                        
            //获取奖品
            function getAward(user_id){
            	WebApi.getAward({user_id: user_id}).always(function(){					
				}).then(function(res){
					console.info(res)
					if(res.result==1){ //游乐场免费解锁
						scope.showOne = true;
						scope.showFreeOpen = true;
						scope.$apply()
						return
					}
					if(res.result==2){ //积木玩具
						scope.showOne = false;
						scope.showBuilding = true;
						scope.prize_id = 2;
						scope.$apply()
						return
					}
					if(res.result==3){ //教具三件套
						scope.showOne = false;
						scope.showThreePiece = true;
						scope.prize_id = 3;
						scope.$apply()
						return
					}
					if(res.result==4){ //20-10优惠券
						scope.showOne = true;
						scope.showTicketOne = true;
						scope.$apply()
						return
					}
					if(res.result==5){ //30-20优惠券
						scope.showOne = true;
						scope.showTicketTwo = true;
						scope.$apply()
						return
					}
					if(res.result==6){ //小鬼服装
						scope.showOne = true;
						scope.showCloth = true;
						scope.$apply()
						return
					}
					if(res.result==7){ //积分100
						scope.showOne = true;
						scope.showCredits = true;
						scope.$apply()
						return
					}					
				},function(res){
					console.info(res)
				})
            }
            
            
            //抽奖次数用光了
            scope.closeHintCover = function(){
            	scope.showHintCover = false;
            }
            
            //返回
            var token = ued.cookie.get('bodoo_token')
            scope.goBack = function(){
            	ued.href('index.html?bodoo_token='+token+'')
            }
            //购买
            scope.goPay = function(){
            	ued.href('http://oauth.bbpapp.com/payment/alipay_web?access_token='+token+'&product_id=100001&amount=0.1&call_back_url=http://campaigns.bbpapp.com/cc266c08/index/paySuccess?access_token='+token+'')
            }
            //提交表单
            scope.goUpdata = function(){
            	scope.name = $('.ipt-name').val()
            	scope.loco = $('.ipt-loco').val()
            	scope.phone = $('.ipt-phone').val()
            	if(!scope.name || !scope.loco || !scope.phone){
            		alert('请填写收货信息！')
            		return
            	}
            	WebApi.updataLoco({user_id: scope.user_id,prize_id: scope.prize_id,name: scope.name,address: scope.loco,phone_number: scope.phone}).always(function(){					
				}).then(function(res){
					alert('提交成功！')
					var token = ued.cookie.get('bodoo_token')
            	    ued.href('index.html?bodoo_token='+token+'')
				},function(res){
					console.info(res)
				})
            	
            }
            
            

            
            function showLoading () {
                loading = weui.loading('加载中...')
            }

            function hideLoading () {
                loading && loading.hide()
            }
        }
    }
})

})();

;(function() {
/* ========== page/index.js ========== */

angular.module('ued').directive('pageIndex', function (WebApi) {
    return {
        templateUrl: 'page/index.html',
        restrict: 'E',
        link: function (scope) {
            ued.title('糖果大狂欢')
            
            isIpad()
            
            scope.showHintCover = false;
            scope.showPaybtn = false;
            if(!ued.query('bodoo_token')){
        		scope.showHintCover = true;        		
        	}            
            if(ued.query('bodoo_token')){
            	//获取是否登录  和  剩余抽奖次数
            	ued.cookie.set('bodoo_token',ued.query('bodoo_token'))           	
            	
            	isLogin(ued.query('bodoo_token'))
            }
            
            scope.playAudio = function(){
            	clickPlay({
			    	audio: document.querySelector('#audio'),
					src: $('.center').attr('data-audio')
			    })
            }
                       
            //敲门讨糖
            scope.getCondy = function(){
            	//判断登录
            	if(!ued.query('bodoo_token')){
            		scope.showHintCover = true;
            		return
            	}
            	if(!scope.user_id){
            		scope.showHintCover = true;
            		return
            	}
            	if(scope.times==0){
            		scope.showHintCover = true;
            		scope.showPaybtn = true;
            		$('.hint-title').hide()
            		$('.hint-text').hide()
            		$('.hint-title-two').show()
            		$('.hint-title-three').show()
            		return
            	}
            	clickPlay({
			    	audio: document.querySelector('#audio'),
					src: $('.btn-get').attr('data-audio')
			    })
            	setTimeout(function(){
            		clickPlay({
				    	audio: document.querySelector('#audio'),
						src: $('.right').attr('data-audio')
				    })
            	},2000)
            	$('.condy-one').addClass('bounceInDown')
            	$('.condy-two').addClass('bounceInDownTwo')
            	$('.condy-three').addClass('bounceInDownThree')
            	            	
            }
            
            //点击糖果 跳转下一页
            scope.goNextPage = function($event){           	
            	if($($event.target).css('opacity')>=0.9 && scope.user_id){
            		ued.href('award.html?user_id='+scope.user_id+'')
            	}
            }
            
            
                       
            //活动规则
            scope.showCover = false;
            scope.openCover = function(){
            	scope.showCover = true;
            }
            scope.closeCover = function(){
            	scope.showCover = false;
            }
            
            //登录提示
            scope.closeHintCover = function(){
            	scope.showHintCover = false;
            }
            
            //购买
            var token = ued.query('bodoo_token');
            
            scope.goPay = function(){
            	if(!token){
            		scope.showHintCover = true;
            		return
            	}
            	ued.href('http://oauth.bbpapp.com/payment/alipay_web?access_token='+token+'&product_id=100001&amount=0.1&call_back_url=http://campaigns.bbpapp.com/cc266c08/index/paySuccess?access_token='+token+'')
            }
            
            //判断登录
            function isLogin(access_token){
            	WebApi.isLogin({access_token: access_token}).always(function(){					
				}).then(function(res){
					console.info(res)
					if(res.code==0){
						scope.showHintCover = true;
						return
					}
					scope.user_id = res.result.id
					//获取剩余抽奖次数
					getTimes(scope.user_id)					
				},function(res){
					console.info(res)
				})
            }
            
            //获取剩余敲门次数
            scope.times = 0;
            function getTimes(user_id){
            	WebApi.getTimes({user_id: user_id}).always(function(){					
				}).then(function(res){
					console.info(res)
					scope.times = res.result
					
					
				},function(res){
					console.info(res)
				})
            }
            
            //查看我的奖品
            scope.showMyPrize = function(){
            	if(!ued.query('bodoo_token')){
            		scope.showHintCover = true;
            		return
            	}
            	
            	getPrize(ued.query('bodoo_token'))
            }
            //关闭奖品弹层
            scope.showPrizeCover = false;
            scope.closePrizeCover = function(){
            	scope.showPrizeCover = false;
            }
            
            
            //获取我的奖品
            function getPrize(access_token){
            	WebApi.getMyPrize({access_token: access_token}).always(function(){					
				}).then(function(res){
					console.info(res)
					scope.prizeList = res.result
					scope.showPrizeCover = true;
					
				},function(res){
					console.info(res)
				})
            }
            
            //ipad
            function isIpad(){
           	   var ua = navigator.userAgent;  
           	   if (ua.indexOf("iPad") > 0) {
           	   	   $('.center').addClass('center-ipad')
           	   	   $('.top').addClass('top-ipad')
           	   	   $('.condy-one').addClass('condy-one-ipad')
           	   	   $('.condy-two').addClass('condy-two-ipad')
           	   	   $('.condy-three').addClass('condy-three-ipad')
           	   	   $('.rule-box').addClass('rule-box-ipad')
//         	   	   $('.btn-get').addClass('btn-get-ipad')
//         	   	   $('.btn-rule').addClass('btn-rule-ipad')
			   }
            }
            
            	
            
            function initPlay(opts){
            	opts.audio.src = opts.src;
		        opts.audio.play();       
				play = function(){
					opts.audio.play();
					
				};
				document.addEventListener("WeixinJSBridgeReady",function(){
					play();
				},false);
				
            }
            function clickPlay(opts){
            	opts.audio.src = opts.src;
			    opts.audio.play();			
			    if(opts.stepbystep) {
			        $(opts.audio).attr('data-isplaying', 'true');
			    }			
			    $(opts.audio).off('ended').on('ended', function(e) {
			        opts.audio.pause();
			        if(opts.stepbystep) {
			            $(opts.audio).attr('data-isplaying', 'false');
			        }
			        opts.callback && opts.callback();
			    });	
            }
            
            function showLoading () {
                loading = weui.loading('加载中...')
            }

            function hideLoading () {
                loading && loading.hide()
            }
        }
    }
})

})();

;(function() {
/* ========== service/uCommon.js ========== */

angular.module('ued').service('uCommon', function (WebApi) {
	var uCommon = {}
	
	//判断授权
	uCommon.getUsercookie = function(){
		if(!ued.cookie.get('Weixin_userInfo')){
			var enlink = window.location.origin+'/toutiao/index.html';
			ued.href(window.location.origin+'/headlines/auth/weixinauth?callbackUrl='+enlink+'');
			return false;
		}
		return true;
	}
	
	
	
	

	return uCommon
})

})();

;(function() {
/* ========== service/WebApi.js ========== */



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


})();

;(function() {
/* ========== filter/uHtml.js ========== */

/**
 * 输出富文本
 *
 * @example
 *  <div ng-bind-html="xxx | uHtml"></div>
 */
angular.module('ued').filter('uHtml', function ($sce) { //过滤器名称为uHtml
    return function (source) {
        return $sce.trustAsHtml(source)  //把html格式的字符串转成html格式显示
    }
})

})();

;(function() {
/* ========== templates.js ========== */

angular.module('ued').run(['$templateCache', function($templateCache) {$templateCache.put('page/award.html','\r\n<div class="top-one" ng-show="showOne">\r\n\t<div class="award-freeopen" ng-show="showFreeOpen"></div>\r\n\t<div class="award-credits" ng-show="showCredits"></div>\r\n\t<div class="award-ticketOne" ng-show="showTicketOne"></div>\r\n\t<div class="award-ticketTwo" ng-show="showTicketTwo"></div>\r\n\t<div class="award-cloth" ng-show="showCloth"></div>\r\n\t<p class="hint">\u82B10.1\u5143\u94B1\uFF0C\u5C06\u5F97\u52305\u6B21\u7EE7\u7EED\u8BA8\u7CD6\u679C\u673A\u4F1A</p>\r\n\t<div class="btn-pay" ng-click="goPay()"></div>\r\n\t<div class="btn-back" ng-click="goBack()"></div>\r\n</div>\r\n\r\n<div class="top-two" ng-show="!showOne">\r\n\t<div class="award-building" ng-show="showBuilding"></div>\r\n\t<div class="award-threePiece" ng-show="showThreePiece"></div>\r\n\t<p class="hint">\u82B10.1\u5143\u94B1\uFF0C\u5C06\u5F97\u52305\u6B21\u7EE7\u7EED\u8BA8\u7CD6\u679C\u673A\u4F1A</p>\t\r\n\t<p class="title"><img src="static/loco.png" alt="" />  \u8BF7\u586B\u5199\u6536\u8D27\u5730\u5740</p>\r\n\t<p class="box name">\u59D3\u540D\uFF1A<input class="ipt ipt-name" type="text" /></p>\r\n\t<p class="box loco">\u5730\u5740\uFF1A<input class="ipt ipt-loco" type="text" /></p>\r\n\t<p class="box phone">\u624B\u673A\uFF1A<input class="ipt ipt-phone" type="text" /></p>\t\t\t\r\n\t<div class="btn-ok" ng-click="goUpdata()"></div>\r\n</div>\r\n\r\n<div class="cover-hint" ng-show="showHintCover">\r\n\t<div class="hint-box">\t\t\t\t\r\n\t\t<p class="hint-title-two">- \u62BD\u5956\u6B21\u6570\u7528\u5149\u5566 -</p>\r\n\t\t<div class="hint-btn" ng-click="closeHintCover()">\u77E5\u9053\u4E86</div>\r\n\t</div>\r\n</div>');
$templateCache.put('page/index.html','\n\n<audio id="audio" src=""></audio>\n<div class="center" data-audio="static/index-bgm.mp3" ng-click="playAudio()">\n\t<div class="top"></div>\n\t<div class="left-ghost"></div>\n\t<div class="left"></div>\n\t<div class="right" data-audio="static/clickcondy.mp3"></div>\n\t<div class="condy-one" ng-click="goNextPage($event)"></div>\n\t<div class="condy-two" ng-click="goNextPage($event)"></div>\n\t<div class="condy-three" ng-click="goNextPage($event)"></div>\n</div>\n\n<div class="my-prize" ng-click="showMyPrize()"></div>\n\n<div class="btn-get" ng-click="getCondy()" data-audio="static/knock.mp3"></div>\n<div class="btn-rule" ng-click="openCover()"></div>\n<p class="time">\u5269\u4F59\u6572\u95E8\u6B21\u6570 <span class="point-word">{{times}}</span> \u6B21</p>\n\n<div class="cover" ng-show="showCover">\n\t<div class="rule-box">\n\t\t<div class="close-btn" ng-click="closeCover()"></div>\n\t</div>\n</div>\n\n<div class="cover-hint" ng-show="showHintCover">\n\t<div class="hint-box">\n\t\t<div class="btn-close" ng-click="closeHintCover()"></div>\n\t\t<p class="hint-title">- \u60A8\u8FD8\u672A\u767B\u5F55 -</p>\n\t\t<p class="hint-text">\u8BF7\u5728APP\u9996\u9875\uFF0C\u70B9\u51FB\u3010\u7236\u6BCD\u4E2D\u5FC3\u3011</p>\n\t\t<p class="hint-text"><img src="static/dot.png" alt="" />\u3010\u8BBE\u7F6E\u3011<img src="static/dot.png" alt="" />\u3010\u767B\u5F55\u3011\u767B\u5F55\u540E\u7EE7\u7EED</p>\n\t\t<p class="hint-title-two">- \u62BD\u5956\u6B21\u6570\u7528\u5149\u5566 -</p>\n\t\t<p class="hint-title-three">\u82B10.1\u5143\u94B1\uFF0C\u5C06\u5F97\u52305\u6B21\u7EE7\u7EED\u8BA8\u7CD6\u679C\u673A\u4F1A</p>\n\t\t<div class="hint-btn" ng-show="showPaybtn" ng-click="goPay()">\u53BB\u652F\u4ED8</div>\n\t</div>\n</div>\n\n<div class="prize-cover" ng-show="showPrizeCover">\n\t<div class="prize-close" ng-click="closePrizeCover()"></div>\n\t<div class="prize-box">\n\t\t<div class="prize-list">\n\t\t\t<p class="prize-item" ng-repeat="prize in prizeList"><img src="static/head.png" alt="" />{{prize.prize_name}}</p>\t\t\t\n\t\t</div>\n\t</div>\n</div>\n\n<img style="display: none;" src="static/rule.png" alt="" />');}]);

})();

//# sourceMappingURL=app.js.map
