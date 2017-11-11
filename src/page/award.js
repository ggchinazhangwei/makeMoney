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