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