//ajax掉用
define(['config'],function(config){
	var ajaxInit = function(options){
		var settings = {
			url: '',
			type: "post",
            dataType: 'json',
			params: {ajax:1},
			yzlogin:false,
			isloading:false,
			callback: function(){},
			errCallback: function(){}
		};	
		if(options){
			$.extend(true,settings,options);
		};
		//console.log(settings.params);
		if(settings.yzlogin){
			var loginflag = config.loginCheck();
			if(!loginflag){
				return false;
			}
		};
		if(settings.isloading == true){
			config.base.loadInit({status:1});
		}
		
		$.ajax({
			url:settings.url,
            type:settings.type,
			dataType: settings.dataType,
			data: settings.params ,
            success: function(result) {
				if(settings.isloading == true){
					config.base.loadInit({status:0});
				}
				if(result.status == 900){
					$(".loadingMask").remove();
					config.tip.tips({
						htmlmsg:'<div style="padding:30px">'+config.base.lang.js_base_login_tip+'</div>',
						callback:function(){
							$(".btnTipsubmit").find(".buttonText").text(config.base.lang.js_base_login_btn);	
						},
						scallback:function(){
							var loginhref = window.location.href;
							window.location.href = '/index/reg.html?loginurl='+loginhref+'';
						}
					});	
					return false;
				}else{
					if(options.callback){
						settings.callback(result)
					}
				}
				
			},
			error: function(msg) {
				config.base.loadInit({status:0});
				if (options.errCallback) {
					settings.errCallback(msg)
				}else{
					config.tip.tips({
						htmlmsg:'<div style="padding:30px">请求超时，请重试！</div>',
						type:0,
						scallback:function(){
							window.location.reload();	
						}
					});
				}
			}
        });
    };
	return {
		ajaxInit:ajaxInit	
	}	
});