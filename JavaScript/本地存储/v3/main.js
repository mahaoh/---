require('./page/RightTop/RightTop');
require('./page/sinosig/sinosig');
require('./page/alert/login');
require('./page/alert/calc');
require('./page/page/PagePHP');
require('./page/drawCurtain/drawCurtain');
require('./page/SendStock/SendStock');
require('./page/overdueBill/overdueBill');

var
    timeCountdown = require('./page/timeCountdown/timeCountdown'),
    Item_animtion = require('./page/ItemAnimtion/ItemAnimtion'),
    eptitle = require('./page/eptitle/eptitle'),
    Increase = require('./page/other/Number_Increase'),
    transforms = require('./page/transforms/transforms');

$(function () {

    /*首页/盈计划首页数据从零增加特效*/
    $('.indexDate .info label strong').each(function (index,value) { Increase($(value)) });
    //首页标的倒计时
    $(".invest-submitTime .invest-soTime").each(function (v,n) {
        var that = $(n);
        timeCountdown(that,that.attr('data-openTime'),that.attr('data-remainTime'),{
            remainOn:function(data) {
                data.parents('div.invest-info').children('a.invest-submit').html("立即加入")
            }
        });
    });
    //列表页标的倒计时
    $(".submit .action .soTime").each(function (v,n) {
        var that = $(n);
        timeCountdown(that,that.attr('data-openTime'),that.attr('data-remainTime'),{
            remainOn:function(data) {
                data.parents('span.action').children('a').html('立即加入');
            }
        });

    });
    // 动态获取宽度增加定位
$('.indexCaptain .Invest-ment').children('ul.Invest-item').children('li').children('.invest-title').children('p').each(function(i,v){
    var b=$(this).width()/2;
    $(this).css('margin-left','-'+b+'px')
});
    //谷歌浏览器特殊处理
    if (!!window.chrome) {
        /*首页卡片弹出信息*/
        $('.Invest-item li .click').each(function(){ $(this).addClass('isFontChrome') });
        /*用户中心收益/资产/优惠模块间距*/
        $('.profit').each(function(){ $(this).css('margin','15px 0 8px 0') });
    }
    //首页卡片提示
    Item_animtion.Case();
    //首页标的翻转
    // transforms($('.invest-money-style'),100,[{'width':0},{'width':'130px'}]);
    //首页公告图标翻转
    transforms($('.bulletin ul li'),100,[{'width':0},{'width':'70px'}]);

    //title提示弹窗
    eptitle('em.zhuan-30','center');
    eptitle('em.zhuan-90','center');
    eptitle('.t', 'right');
    eptitle('.i', 'center');

    //圆形利率带小数点字体样式处理
    $('.invest-first-strong').each(function(index,value){
        if($(value).text().length > 2) $(value).addClass('invest-strong-rate');
    });

    /*列表页标的图片位置样式修改*/
    $('.invest-list .invest-item').each(function (index,value) {
        // 如果标的没有活动图标,则修改小图标样式
        var attrClass = $(value).attr('class');
        // 新手专享 | 加息秒杀 | 限时开抢 | 夺宝
        if(attrClass.indexOf('newbie') < 0 && attrClass.indexOf('seckilling') < 0 && attrClass.indexOf('deseno') < 0 && attrClass.indexOf('dig') < 0) $(value).children('div.invest-title').css('padding-right', '0px');
    });



});
//投资成功页面自动返回
{
    $(".Inv-info .Inv-last em").each(function(){
        retoryTime(5,this,'秒后自动返回');
    });
    function retoryTime(iTime,ob,text,Manner){
        var iSecond;
        var sDay="",sTime="",Account;
        iSecond = parseInt(iTime%60);
        sTime =sDay + iSecond + text;
        if(iTime==0){
            clearTimeout(Account);
            Manner == 'reload' ? location.reload() : history.go(-1);
        }else{
            Account = setTimeout(function(){retoryTime(iTime,ob,text,Manner)},1000);
        }
        iTime=iTime-1;

        ob.innerHTML = sTime;
    }

}
/**
 * 导航链接跳转样式固定 */
{
    $(function(){
        let
            path = location.pathname.replace(location.host,''),
            header = $('header ul.user li'),
            pathname = [
                'welcome', // 首页
                'invest',  // 理财投资
                'plan',    // 盈计划
                'loanCredit',  // 债权转让
                'member',  // 会员中心
                'account' // 我的惠人贷
            ];
        let
            //如果删除 host 部分后的路径为 空 或者 '/' 时,则返回 '' ,否则如果路径的第一位为 '/' 时,则删除第一位,否者为空;
            paths = path == '' ? '' : path == '/' ? '' : path.charAt(0) == '/' ? path.substring(1) : '',
            //获取连接地址第一个 // 中的参数
            pathso = paths.split('/')[0];

        $.each(pathname, function (v, n) {
            if(v === 0){
                if(pathso == n || pathso == '' || pathso == undefined) header.eq(v).addClass('show').siblings().removeClass('show');
            }else{
                if(pathso == n) header.eq(v).addClass('show').siblings().removeClass('show');
            }

        });

    });
}

/**
 * 充值状态客服*/
$(window).load(function () {
    $('.kefu-im').bind('click', function () {
        window.open("https://huirendai.udesk.cn/im_client/?web_plugin_id=1354&cur_url=" + location.href + "&pre_url=" + document.referrer, "", "width=780,height=560,top=200,left=350,resizable=yes")
    });
});
// $(".invest-money-style").mouseenter(function(){$(this).find('.first').slideUp("slow").next('.last').slideDown("slow")});
// $(".invest-money-style").mouseleave(function(){$(this).find('.first').slideDown("slow").next('.last').slideUp("slow");});
// $('.hovecolor').mouseenter(function(){$(this).find('.first').find('label').css('color','#f56b0f');$(this).find('.first').find('.aColor').css('color','#f56b0f');
//     $(this).find('.first').find('em').css('color','#f56b0f');$(this).find('.invest-info').first().find('label').find('em').css('background','#f56b0f');
//     $(this).find('.invest-info').find('.invest-submit').children('.invest-submitTime').hide();});
// $('.hovecolor').mouseleave(function(){$(this).find('.first').find('label').css('color','#353535');
//     $(this).find('.first').find('.aColor').css('color','#353535');
//     $(this).find('.first').find('em').css('color','#353535');
//     $(this).find('.invest-info').first().find('label').find('em').css('background','#66c69e');
//      $(this).find('.invest-info').find('.invest-submit').children('.invest-submitTime').show(); });



$(".invest-money-style").mouseenter(function(){$(this).find(".first").slideUp("slow").next(".last").slideDown("slow")}),
    $(".invest-money-style").mouseleave(function(){$(this).find(".first").slideDown("slow").next(".last").slideUp("slow")}),
    $(".hovecolor").mouseenter(function(){$(this).find(".invest-info").children(".invest-submitTime").hide()}),
    $(".hovecolor").mouseleave(function(){$(this).find(".invest-info").children(".invest-submitTime").show()}),
    $(".invest-item").mouseenter(function(){$(this).children(".invest-info").children(".submit").find(".action").find("p").hide(),
     $(this).children(".invest-info").children(".submit").find("p").css({background:"#f56b0f",color:"#fff"})}),
     $(".invest-item").mouseleave(function(){$(this).children(".invest-info").children(".submit").find(".action").find("p").show(),
            $(this).children(".invest-info").children(".submit").find("p").css({background:"#eaeaea",color:"#353535"})});


      var img=$('.swiper-slide [data-imghover]')
    var _url,_src;
    if(img[0]){
        img.hover(function(){
            _url=$(this).attr('data-imghover');
            _src=$(this).attr('src');
            $(this).attr('src',_src)
        },function(){
       $(this).attr('src',_url)
        })
    };
/**
 *
 * 
 * 通用标签导航*/
{
    function labelNavigation(ol, ul) {
        ol.children().off('click').on('click',function(){
            let that = $(this);
            that.addClass('show').siblings().removeClass('show');
            ul.children().eq(that.index()).addClass('show').siblings().removeClass('show');
        });
    }
    labelNavigation($('.Tab-ol-A'),$('.Tab-ul-A'));
    labelNavigation($('.Tab-ol-B'),$('.Tab-ul-B'));
}



/**
 * 外部数据插件*/
require('../stat/baidu');
require('../stat/ga');

