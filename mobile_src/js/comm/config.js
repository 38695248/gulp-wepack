//公共模块
define(function(){
	//公告模块
	var base = {
		//国际化
		lang:{
			js_base_login_tip:'您还没有登录，请先登录！',
			js_base_login_btn:'登录',
			js_base_del_text:'你确定删除吗？',
			js_base_delbord_text:'你确定删除这个分类吗？',
			js_base_error:'系统异常，请稍后再试！',
			js_base_email:'Not a valid email.',
			js_base_password:'valid',
			js_base_mb:'请填写正确的手机号码',
			js_base_code:'',
			js_base_deltag:'您要删除当前标签吗？',
			js_base_money:'valid',
			js_base_prev:'上一页',
			js_base_next:'下一页',
			js_base_tip:'系统提示',
			js_base_cancel:'取消',
			js_base_del:'删除',
			js_base_confirm:'确认',
			js_base_des:'描述',
			js_base_qty:'数量',
			js_base_price:'价格',
			js_base_total:'总价',
			js_base_checkout:'去结算',
			js_base_cart:'购物车内暂时没有商品。',
			js_base_scoretomoney:'请正确输入享金。',
			js_base_myscore:'请正确输入金额。',
			js_base_emailyz:'马上去验证',
			js_reg_maxMsg:'最多只能选择10个',
			js_shareView_like:'赞TA',
			js_shareView_unlike:'已赞TA',
			js_shareView_follow:'关注',
			js_shareView_unfollow:'已关注',
			js_shareView_want:'想要',
			js_shareView_unwant:'不想要',
			js_upload_chooseimage:'选择图片',
			js_cart_canceluse:'取消使用',
			js_cart_theuse:'本次使用',
			js_cart_coupons:'优惠卷',
			js_cart_Integral:'享金',
			js_cart_pay:'支付',
			js_cart_folding:'折合',
			js_cart_currency:'人民币',
			js_cart_payType:'百享',
			js_Q_EXCEED_NUM_LIMIT:'超过最大上传数',
			js_myshare_inviteSuccess:'邀请成功！',
			js_myshare_mailSuccess:"邮件发送成功！",
			js_myshare_orderNo:"订单编号",
			js_myshare_Onlinepayment:"在线支付",
			js_myshare_view:"查看",
			js_myshare_reup:"重新上传",
			js_myshare_perform:"您确定执行该操作吗?",
			js_myshare_Myself:"我自己",
			js_index_copytext:'邀请链接地址已经复制到粘贴板，你可以使用Ctrl+V贴到需要的地方去了哦！',
			js_base_categorytext:'选择分类！',
			js_base_yourself:'自己不能给自己发信息。',
			Q_EXCEED_SIZE_LIMIT:'图片文件总大小超过系统限制大小。',
			F_EXCEED_SIZE:'图片大小超过系统限制大小5M，请重新选择。',
			Q_TYPE_DENIED:'图片格式不对，只能上传jgif,jpg,jpeg,png图片',
			error:'系统提示',
			uptimeout:'亲，您的网络太慢，上传超时！请重新上传！',
			maxCategoryNum:'最多只能选15个分类。',
			certification:'你还没有通过实名认证，请先认证。',
			js_upavatartitle:'请从您手机选择头像上传',
			js_upshareimg:'请从手机相册选择图片',
			js_upproimg:'请从手机相册选择图片',
			js_shippingtotal:'包邮',
			js_order_sizes:'尺码',
			js_order_color:'颜色',
			js_order_for:'私定人',
			js_order_type_t:'团',
			js_order_type_p:'私'
		},
		//获取手机屏幕高度
		getHeightBody:function(){
			var bodyHeight = 0;
			if (this.browser.versions.ios || this.browser.versions.iPhone || this.browser.versions.iPad) {
				bodyHeight = window.screen.availHeight;
			}else if (this.browser.versions.android) {
				bodyHeight = $(window).height();
			}else{
				bodyHeight = $(window).height();
			}
			return bodyHeight;
		},
		//获取手机屏幕高度
		getWidthBody : function(){
			var bodyWidth = 0;
			if (this.browser.versions.ios || this.browser.versions.iPhone || this.browser.versions.iPad) {
				bodyWidth = window.screen.availWidth;
			}else if (this.browser.versions.android) {
				bodyWidth = $("body").width();
			}else{
				bodyWidth = $("body").width();
			}
			return bodyWidth;
		},
		//检测是android还是ios系统
		browser:{
			versions: function() {
				var u = navigator.userAgent, app = navigator.appVersion;
				return {//移动终端浏览器版本信息 
					trident: u.indexOf('Trident') > -1, //IE内核
					presto: u.indexOf('Presto') > -1, //opera内核
					webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
					gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
					ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
					android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
					iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
					iPad: u.indexOf('iPad') > -1, //是否iPad
					webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
				};
			}(),
			language: (navigator.browserLanguage || navigator.language).toLowerCase()
		},
		//判断输入字符串是否为空或者全部都是空格
		isNull:function( str ){
			if ( str == "" ) return true;
			var regu = "^[ ]+$";
			var re = new RegExp(regu);
			return re.test(str);
		},
		//获取url参数值
		getQueryString : function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]); return null;
		},
		//loading加载
		loadInit:function(options){
			var $loadingBox = $('<div id="loadingMask" class="loadingMask" style="z-index:999999"></div>');
			var settings = {
				status:1	
			};
			if(options){
				$.extend(settings,options);
			};
			if(settings.status==1){
				$("body").append($loadingBox);	
			}else{
				$("#loadingMask").remove();
			};
		}
	};
	//弹窗的常用方法
	var tip = {
		tips:function(options){
			var settings = {
				htmlmsg:'',
				title:base.lang.js_base_tip,
				type:1,
				istop:false,
				position:"fixed",
				isShade:true,
				touchmove:0,
				callback:function(){},
				scallback:function(){},
				dcallback:function(){},
				closeback:function(){},
				w:"96%"
			};
			if(options){
				$.extend(settings,options);
			};
			var tipHtml ='<div class="tipbox-in" data-index="0">'+
					'<h1 class="tiptop">'+settings.title+'</h1>'+
					'<span class="ico tipclose closeBtn"></span>'+
					'<form class="tipForm">'+
					'<div class="tipcont">'+settings.htmlmsg+'</div>'+
					'<div id="tipbottom" class="tipbottom">'+
						'<div class="fr formFooterButtons">'+
							'<button class="btn-border btn rounded mr-5 btnCancel closeBtn" type="button">'+
								'<span class="buttonText">'+base.lang.js_base_cancel+'</span>'+
							'</button>'+
							'<button type="button" class="btn btn-danger btnTipsubmit">'+
								'<span class="buttonText">'+base.lang.js_base_confirm+'</span>'+
							'</button>'+
						'</div>'+
						'<div class="blank0"></div>'+
					'</div></form>'+
			'</div>',
			num = $(".modalMask").size(),
			tipDiv = $('<div id="tipbox_'+num+'" data-index="'+num+'" class="tipbox fade" style="width:'+settings.w+'">'+tipHtml+'</div>');
			if(settings.type == 0){
				tipDiv.find(".btnCancel").remove();
			};
			$("body").append(tipDiv);	
			if(options.callback){
				settings.callback();	
			};
			var myTipId = "tipbox_"+num;
			this.currentPosition({divId:myTipId,num:num,shade:settings.isShade,position:settings.position,istop:settings.istop,touchmove:settings.touchmove});
			
			tipDiv.find(".closeBtn").unbind("click").bind("click",function(){
				var numIndex = $(this).parents(".tipbox").attr("data-index");
				var myIndeTipDiv = $(this).parents(".tipbox");
				tip.tipsClosed({myIndeTipDiv:myIndeTipDiv,numIndex:numIndex});	
				if(options.closeback){
					settings.closeback();	
				};
			});
			tipDiv.find(".btnTipsubmit").unbind("click").bind("click",function(){
				var numIndex = $(this).parents(".tipbox").attr("data-index");
				var myIndeTipDiv = $(this).parents(".tipbox");
				if(options.scallback){
					settings.scallback();	
				};
				tip.tipsClosed({myIndeTipDiv:myIndeTipDiv,numIndex:numIndex});
				if(options.dcallback){
					settings.dcallback();	
				};
					
			});
		},
		centerDiv:function(options){
			var settings = {
				divId:'',
				isShade:true,
				w:"96%",
				type:0,
				istop:false,
				isbottom:false,
				position:"absolute",
				p_new:0,
				touchmove:0,
				callback:function(){},
				zcallback:function(){},
				closeback:function(){}
			};
			if(options){
				$.extend(settings,options);
			};
			var num = $(".modalMask").size();
			$("#" + settings.divId).attr("data-index",num);
			$("#" + settings.divId).css({"width":settings.w});
			if(options.callback){
				settings.callback({num:num});	
			};
			this.currentPosition({divId:settings.divId,num:num,shade:settings.isShade,position:settings.position,callback:settings.zcallback,istop:settings.istop,touchmove:settings.touchmove,isbottom:settings.isbottom});
			$(".closeBtnHtml").unbind("click").bind("click",function(){
				var mynumIndex = $(this).parents(".tipbox").attr("data-index");
				var myIndeTipDiv = $(this).parents(".tipbox");
				tip.centerDivClosed({"indexTipDiv":myIndeTipDiv,"indexNum":mynumIndex,"type":settings.type});
				var num = $("#bigcategorybox").attr("data-index");
				tip.centerDivClosed({indexNum:num,indexTipDiv:$("#bigcategorybox"),type:1});	
				if(options.closeback){
					settings.closeback();
				}
			});
		},
		currentPosition:function(opt) {
			var mypos = opt.position;
			if(mypos == "absolute"){
				var c_left = this.getPageOffset().x + ($("body").width() - $("#" + opt.divId).width()) / 2;
				var c_top = this.getPageOffset().y + (base.getHeightBody() - $("#" + opt.divId).height()) / 2;
			}else{
				var c_left = ($("body").width() - $("#" + opt.divId).width()) / 2;
				var c_top = (base.getHeightBody() - $("#" + opt.divId).height()) / 2;
			};
			
			var len = $(".modalMask").size() *90 + 9999;
			var shodenum = opt.num;
			if(opt.shade){
				this.addShade({num:shodenum,touchmove:opt.touchmove});	
			};
			if (c_top <= 0 && !opt.istop) {
				c_top = 20;
			}else if(opt.istop){
				c_top = 0;	
			};
			if (c_left <= 0 && !opt.istop) {
				c_left = 20;
			}else if(opt.istop){
				c_left = 0;	
			};
			if(opt.isbottom == true){
				$("#" + opt.divId).css({
					"z-index":len + 1
				}).show();
			}else{
				$("#" + opt.divId).css({
					"left": c_left,
					"top": c_top,
					"position":mypos,
					"z-index":len + 1
				}).addClass("show loaded").show();
			}
			if(opt.callback){
				opt.callback();	
			};
		},
		tipsClosed:function(opt){
			var myIndeNum = opt.numIndex;
			var myIndeTipDiv = opt.myIndeTipDiv;
			myIndeTipDiv.remove();
			$("#modalMask_" + myIndeNum).remove();
			if(opt.callback){
				opt.callback();	
			};
		},
		centerDivClosed:function(options){
			var settings = {
				indexNum:'',
				indexTipDiv:'',
				type:0,
				callback:function(){}
			};
			if(options){
				$.extend(settings,options);
			};
			if(settings.type == 1){
				settings.indexTipDiv.remove();	
				$("#modalMask_" + settings.indexNum).remove();	
			}else if(settings.type == 2){
				settings.indexTipDiv.hide();	
				$("#modalMask_" + settings.indexNum).remove();
			}else{
				settings.indexTipDiv.hide();	
				$("#modalMask_" + settings.indexNum).hide();
			};
			
			if(options.callback){
				settings.callback();	
			};
		},
		addShade:function(opt){
			var myIndex = opt.num;
			var len = opt.num *90 + 9998;
			var shadDiv = document.createElement('div');
			shadDiv.id = "modalMask_" + myIndex;
			shadDiv.className = "modalMask";
			$("body").append(shadDiv);
			$("#modalMask_" + myIndex).show().css({"z-index":len});
			//禁止浏览滚动条
			if(opt.touchmove == 1){
				$('#modalMask_' + myIndex).bind("touchmove",function(e){  
					e.preventDefault();  
				});
			}
		},
		getPageOffset:function() {
			var pageOffset = {};
			if (window.innerWidth) {
				pageOffset.x = window.pageXOffset;
				pageOffset.y = window.pageYOffset;
			} else if (document.documentElement && document.documentElement.clientWidth) {
				pageOffset.x = document.documentElement.scrollLeft;
				pageOffset.y = document.documentElement.scrollTop;
			} else if (document.body.clientWidth) {
				pageOffset.x = document.body.scrollLeft;
				pageOffset.y = document.body.scrollTop;
			};
			return pageOffset;
		}
	};
	//检查是否登录
	var loginCheck = function(otip){
		var res = true;
		if(islogin == 0){
			if(otip != 1){
				tip.tips({
					htmlmsg:'<div style="padding:30px">'+base.lang.js_base_login_tip+'</div>',
					callback:function(){
						$(".btnTipsubmit").find(".buttonText").text(base.lang.js_base_login_btn);	
					},
					scallback:function(){
						var loginhref = encodeURIComponent(window.location.href);
						//console.log(loginhref);
						window.location.href = '/index/reg.html?loginurl='+loginhref+'';	
					}
				});
			}
			res = false;	
		};	
		return res;
	};
	//微信朋友圈分享提示
	var shareweinxtip = function(opt){
		var num = $(".share_tip").size();
		var share_bg = $('<div id="share_bg_'+num+'" class="share_bg" data-index="'+num+'"></div>');
		var share_tip = $('<div id="share_tip_'+num+'" class="share_tip '+opt.class+'" data-index="'+num+'"></div>');
		$('body').append(share_bg);
		$('body').append(share_tip);
		$("#share_bg_"+num).show().css({"z-index":num+99990});
		$("#share_tip_"+num).show().css({"z-index":num+99991});
		if(opt.callback){
			opt.callback($("#share_tip_"+num),$("#share_bg_"+num));	
		}
		if(opt.isclose != 0){
			$("#share_tip_"+num).unbind("click").bind("click",function(){
				$("#share_tip_"+num).remove();
				$("#share_bg_"+num).remove();
				//$("#btn-bysshare-wx").addClass("current").removeClass("btn-danger");	
			});
			$("#share_bg_"+num).unbind("click").bind("click",function(){
				$("#share_tip_"+num).remove();
				$("#share_bg_"+num).remove();
				//$("#btn-bysshare-wx").addClass("current").removeClass("btn-danger");	
			});		
		}
		
	};
	
	//关闭弹窗
	var closeTip = function(obj,otype){
		var num = obj.attr("data-index");
		var type = 1;
		if(otype){
			type = otype;	
		}
		tip.centerDivClosed({
			indexNum:num,
			indexTipDiv:obj,
			type:type
		});		
	};
	//百度分享
	var baiduShare = function(options){
		var settings = {
			bdPic:'',
			bdText:'',
			url:'',
			title:'',
			desc:'',
			summary:'',
			site:'www.byshare.com',
			baidu:0
		};
		if(options){
			$.extend(settings,options);	
		}
		if(settings.baidu == 1){	
			window._bd_share_config={"common":{"bdSnsKey":{"tsina":3171756207},"bdText":"","bdMini":"2","bdPic":settings.bdPic,"bdStyle":"0","bdSize":"16"},"share":{}};
			with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];
		}else{
			var share_Sina = function(){
				return '<a href="http://v.t.sina.com.cn/share/share.php?url='+encodeURIComponent(settings.url)+'&amp;title='+settings.title+'&amp;appkey=3171756207&amp;pic='+settings.bdPic+'" target="_blank" class="byshare_sns byshare_tsina" title="分享到新浪微博"></a>';
			};
			var share_qqQzone = function(){
				return '<a href="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+encodeURIComponent(settings.url)+'&title='+encodeURI(settings.title)+'&pics='+settings.bdPic+'&summary='+encodeURI(settings.summary)+'" target="_blank" class="byshare_sns byshare_qzone" data-cmd="qzone" title="分享到QQ空间"></a>';	
			};
			var share_qq = function(){
				return '<a href="http://connect.qq.com/widget/shareqq/index.html?url='+settings.url+'&showcount=0&desc='+encodeURI(settings.desc)+'&summary='+encodeURI(settings.summary)+encodeURI(settings.url)+'&title='+encodeURI(settings.title)+'&site='+settings.site+'&pics='+settings.bdPic+'" class="byshare_sns byshare_qzone" data-cmd="qzone" title="分享到QQ空间"></a>';
			};	
			var share_weiXin = function(){
				wx.onMenuShareTimeline({
					title: '', // 分享标题
					link: '', // 分享链接
					imgUrl: '', // 分享图标
					success: function () { 
						alert(11);// 用户确认分享后执行的回调函数
					},
					cancel: function () { 
						alert(222);// 用户取消分享后执行的回调函数
					}
				});
			};
			var html = ''; 
			html += share_qqQzone();
			html += share_Sina();
			$('#share_sns').html(html);
			//share_weiXin();
		}
	};
	//关注微信检测
	var gzweixin = function(opt){
		var settings = {
			callback:null,
			errcallback:null	
		};
		$.extend(true,settings,opt);
		ajax.ajaxInit({
			"url":'/user/weixin_isguanzhu.html', 
			"params":{}, 
			"callback":function (res) {
				isback = 1;
				$("#testStatus").text(res.status);
				if(res.status == 1){
					//$(".btn-bysharedz").addClass("btn-bysharedz").removeClass("btn-danger-gray");
					isgzweixin = 1;	
					//$("#btn-gzbysharewx").addClass("current").removeClass("btn-danger");
					if(opt.callback){
						settings.callback();	
					}
				}else if(res.status == -1){
					if(islogin == 0){
						window.location.href = '/index/reg.html';
					}
					config.tip.tips({
						htmlmsg:'<div style="padding:30px">'+res.msg+'</div>',
						type:0,
						scallback:function(){
							window.location.href = "http://mp.weixin.qq.com/s?__biz=MzA3NTM5Mzg2NA==&mid=206134523&idx=1&sn=b052274af6c6633a2e2db14c7a10e577#rd";	
						}
					});
				}else{
					var top = 0;
					if($(".headerbox").length>0){
						top = $(".headerbox").height();	
					}
					$("#gzweixin").css({"top":top}).show();
					$("#gzclose").unbind("click").bind("click",function(){
						$("#gzweixin").hide();	
					});	
					if(opt.errcallback){
						settings.errcallback(res.msg);	
					}	
				}
			}
		});
	};
	/*回到顶部*/
	var goTopExUtils = function(opt){
		var $this = opt.divid;
		$this.bind("click",function(){
			$("html,body").animate({scrollTop:0},100);
			$this.hide();
		});
		var getScrollTop = function(){
			return (document.body.scrollTop+document.documentElement.scrollTop);
		};
		var setScrollTop = function(value){
			if(navigator.appName=="Netscape" && navigator.userAgent.toUpperCase().indexOf("CHROME")>0){
				document.body.scrollTop=value;
			}else{
				document.documentElement.scrollTop=value;
			}
		};    
		window.onscroll=function(){getScrollTop()>0?$this.fadeIn():$this.fadeOut();};
	};
	return {
		base:base,
		tip:tip,
		loginCheck:loginCheck,
		shareweinxtip:shareweinxtip,
		closeTip:closeTip,
		baiduShare:baiduShare,
		gzweixin:gzweixin,
		goTopExUtils:goTopExUtils
	}	
});