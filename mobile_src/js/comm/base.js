define(['ajax'],function(AjaxFunUtils){
	var init = function(){
		infomore();
	};
	//顶部消息
	var infomore = function(){
		var suid = $("#send").attr("data-suid");
		AjaxFunUtils.ajaxInit({
			"url":'/message/getmsgnum.html',
			"params":{suid:suid},
			"callback":function (res) {
				if(res.status ==1){
					$("#infomore_num,#infomnum").text(res.data.num).show();
				}
			}
		});
		$(".infomore_btn").unbind("click").bind("click",function(){
			var $thisparnt = $(this).parents(".top_r");
			var isshow = $thisparnt.find(".infomore").is(":hidden");
			if(isshow){
				$thisparnt.find(".infomore").show();
			}else{
				$thisparnt.find(".infomore").hide();
			}
			$(document).unbind("click").bind('click',function(e){
				var target = $(e.target);
				if(target.closest($(".infomore_btn")).length == 0){
					$thisparnt.find(".infomore").hide();
				};
			});
		});
	};
	return {init:init}
})//公共模块