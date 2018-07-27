// require('../js/paalyFor.js');
// require('../js/seach.js');
// require('../less/index.less');
// 
	var that;
	function b(i,v){
		if(typeof i=='object'){
			v=i;
			i=undefined;
		};
		that=this;
		that.v= v || {}
		console.log(that.v);
		console.log(v,22);
		that.init()
	};
	b.prototype={
		init:function(){
			var v=that.v;
			alert(22);
		}
	}



    //首页跳转
	$('.Installment-menu').on('click','dl',function(){
	    var url=$(this).attr('data-url');
	    location.href=url;
	});
	//首页头部自适应居中
	var num=($('.shName-title').width()*2)/2;
	$('.shName-title').css('margin-left','-'+num/100+'rem');


	//借款管理头部
	if($('.applayFor-swiper')[0]){
		  var swiper = new Swiper('.applayFor-swiper', {
		        pagination: '.swiper-pagination',
		        slidesPerView: 4.6,
		        paginationClickable: true,
		        spaceBetween: 0,
		        freeMode: true,
		        preventLinksPropagation : false
		   });
		
	};
		$('.applayFor-swiper').on('click','.swiper-slide',function(){
			$(this).addClass('current').siblings().removeClass('current');
			$('.content_box').children().eq($(this).index()).show().siblings().hide();
		});
   //点击搜索框事件
	// $('.applyFor-seach').off('click').on('click','.seach-div',function(){
	// 	 $(this).css({
	// 	 	'background-position-x':'.22rem',
	// 	 	'text-indent':'.64rem'
	// 	 })
	// });
	//   $('.seach-div').blur( function () {  
 //         	$(this).css({
 //                'background-position-x':'3.08rem',
 //                'text-indent':'3.44rem'
 //            });} );

 		$('.seach-list-left').on('click',function(){
 			if($('.seach-ul').css('display')=='block'){
 				$('.seach-ul').hide();
 			}else{
 			$('.seach-ul').show();
 		}
 		});
 		$('.seach-ul').on('click','li',function(){
 			$(this).parent().hide();
 			$('.seach-list-left').children('span').html($(this).children('a').html())
 		});
 		$('.seach').on('click','.seach-btn',function(){
 			$('#form').submit();
 		});

	//实名信息
	//身份证号吗验证
	function Idcard(r){var r,s,t,e,n,a=new Array("验证通过","身份证号码位数不对","身份证号码出生日期超出范围或含有非法字符","身份证号码校验错误","身份证地区非法"),p={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"},I=new Array;if(I=r.split(""),null==p[parseInt(r.substr(0,2))])return a[4];switch(r.length){case 15:return ereg=(parseInt(r.substr(6,2))+1900)%4==0||(parseInt(r.substr(6,2))+1900)%100==0&&(parseInt(r.substr(6,2))+1900)%4==0?/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/:/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/,ereg.test(r)?a[0]:a[2];case 18:return ereg=parseInt(r.substr(6,4))%4==0||parseInt(r.substr(6,4))%100==0&&parseInt(r.substr(6,4))%4==0?/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/:/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/,ereg.test(r)?(e=7*(parseInt(I[0])+parseInt(I[10]))+9*(parseInt(I[1])+parseInt(I[11]))+10*(parseInt(I[2])+parseInt(I[12]))+5*(parseInt(I[3])+parseInt(I[13]))+8*(parseInt(I[4])+parseInt(I[14]))+4*(parseInt(I[5])+parseInt(I[15]))+2*(parseInt(I[6])+parseInt(I[16]))+1*parseInt(I[7])+6*parseInt(I[8])+3*parseInt(I[9]),s=e%11,n="F",t="10X98765432",n=t.substr(s,1),n==I[17]?a[0]:a[3]):a[2];default:return a[1]}};
        $('.autonym-name').on('focus',function(){$('.autonym-err').html('')});
        $('.autonym-ID').on('focus',function(){$('.autonym-err').html('')});
		$('.autonym-btn').on('click',function(){
			var autonymName=$('.autonym-name').val(),
				autonymID=$('.autonym-ID').val(),
				autonymErr=$('.autonym-err');
				if(autonymName==="" || autonymID===""){
					autonymErr.html('姓名或身份证号不能为空');
					return false;
				}else if(!/^([\u4e00-\u9fa5]|[·]|[.]){2,6}$/.test(autonymName)){
					autonymErr.html('您的姓名格式不正确');
			        return false;
				}else if(Idcard(autonymID)!="验证通过"){
					autonymErr.html('您的身份证号输入不正确');
			        return false;
				}else{
					location.href='RealName.html'
				}
		});


    //放款管理
    if($('.makeLoans-swiper')[0]){
    	    var swiper = new Swiper('.makeLoans-swiper', {
		        pagination: '.swiper-pagination',
		        slidesPerView: 4.6,
		        paginationClickable: true,
		        spaceBetween: 0,
		        freeMode: true,
		        preventLinksPropagation : false
		   });
    }
 
	$('.makeLoans-swiper').on('click','.swiper-slide',function(){
		$(this).addClass('current').siblings().removeClass('current');
	    $('.content_box').children().eq($(this).index()).show().siblings().hide();
	});



	   //帮助中心
	   //搜索
		   function  helpSeach() {
            var seach=$('.seach-help').val();
            if(seach==''){
                $('.help-list li').show();
            }else {
                $('.help-list li').each(function () {
                    var cittitle=$(this).children('span').html();
                    if(cittitle.indexOf(seach) != -1){
                        $(this).show();
                    }else{
                        $(this).hide();
                    }
                })
            }
        };
        $('.help-list').on('click','li',function(){
            var url=$(this).attr('data-url');
            location.href=url;
        });
        $('.seach-help').bind('input',function () {
            helpSeach()
        });
         $('.seach-help').bind('click',function(){
            $(this).css({
                'background-position-x':'.2rem',
                'text-indent':'.64rem'
            });
         });
         $('.seach-help').blur( function () {  
         	$(this).css({
                'background-position-x':'3.08rem',
                'text-indent':'3.44rem'
            });} );
