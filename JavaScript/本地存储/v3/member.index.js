/**
 * Created by Dreamslink on 16/9/2.
 * 会员中心首页事件处理
 */

require('./lib/hrd');
let CPM = require('./page/alert/init');
require('./page/page/PageAjax');

$(function () {

    // I 标签补签规则弹出信息
    $('.sign-txt div.i').hover(function(){
        $(this).children().show();
    },function(){
        $(this).children().hide();
    });
    //待领礼包特效
    $(".giftBag").slide({mainCell:".bd ul",autoPage:true,effect:"left",vis:3,prevCell:'.gift-prev',nextCell:'.gift-next',pnLoop:'false'});
});


/**
 * 会员首页： 签到*/
{
    let VipRegister = require('./page/VipRegister/VipRegister');
    let vipsign = $('#vipSign');
    VipRegister({
        vipSign   : vipsign,                     //父元素
        vipsignarr : $('.sign-txt b'),           //补签机会
        vipText   : vipsign.children('ul'),      //签到日期
        vipButton : vipsign.children('strong'),  //签到按钮
        vipsignarrID : $('.Integral'),           //补签后积分特效元素位置
        vipsignarrFloat: 'right',                //补签后积分特效显示方位
        localName:'text'                         //判断补签刷新标签类型
    });
}


/**
 * 会员图表文字位置特效 */
{
    let canvas =  $('.charts-canvas label.text'),
        //奖牌结束距离定位, [bottom, left]
        chart = [[0, 0],[63, 118], [120, 283], [174, 451], [226, 617]],
        //奖杯区间距离
        distance = [],
        //成长值
        Growth = parseInt(canvas.attr('data-Growth'));


    if(canvas[0]){


        //计算每个奖杯区间的距离数值
        for(let i = 0; i < 4; i++) {
            distance[i] = [-(chart[i][0] - chart[i+1][0]),-(chart[i][1] - chart[i+1][1]) ];
        }

        let
            //计算成长值属于是什么奖牌,每 2501 成长值升级一次,结果返回 0:铜牌 | 1:银牌 | 2:金牌 | 3:钻牌
            _Growth = Growth > 7500 ? 3 : Growth > 5000 ? 2 : Growth > 2500 ? 1 : 0,
            //计算成长值属于奖牌的多少份数之间, 每 100 成长值 为一份
            Copies = Growth < 2500 ? Math.floor(Growth / 100) : Math.floor((Growth - _Growth * 2500) / 100);

        for(let i = 0; i < distance.length; i++){
            //重新计算每一份的一个单位距离数值(每个区间共25份)
            distance[i] = [distance[i][0]/25,distance[i][1]/25];
        }

        /**
         * 添加位置 */
        switch (_Growth) {
            case 2:
                // 重新计算 2500 ~ 5000 阶段的成长值属于什么奖牌
                // _Growth = Math.floor(Growth / 2500) == 1 ? (Growth / 2500).toFixed(2) > 1 ? 2 : 1 : Math.floor(Growth / 2500);
                canvas.css({
                    bottom: chart[_Growth][0] + distance[_Growth][0] * Copies +'px',
                    left:   chart[_Growth][1] + distance[_Growth][1] * Copies +'px'
                });
                break;
            default:
                //如果成长值 >= 10000 时,位置固定,不在增长;
                if(Growth>=10000) {
                    canvas.css({
                        bottom: chart[4][0] +'px',
                        left:   chart[4][1] +'px'
                    });
                }else{
                    canvas.css({
                        bottom: chart[_Growth][0] + distance[_Growth][0] * Copies +'px',
                        left:   chart[_Growth][1] + distance[_Growth][1] * Copies +'px'
                    });
                }
                break;
        }

        /**
         * 添加文字*/
        let Spread,VIPtext;

        if(Growth <= 2500) {
            //成长值低于 2500 时,重新计算
            Spread = 2500 - Growth;
        }else{
            //节点数值与实际的成长值相等时,重新计算
            if(_Growth*2500 == Growth) Spread =  _Growth * 2500 - Growth; else Spread = (_Growth+1) * 2500 - Growth;
        }
        // 奖牌文字按照 _Growth 设置获取
        switch (_Growth) {
            case 0:
                VIPtext = '还差' + Math.floor(Spread+1) + '升级银牌会员';
                break;
            case 1:
                VIPtext = '还差' + Math.floor(Spread+1) + '升级金牌会员';
                break;
            case 2:
                VIPtext = '还差' + Math.floor(Spread+1) + '升级钻石会员';
                break;
            default:
                VIPtext = '您已是尊贵的钻石会员';
                break;
        }
        //最终输出结果
        canvas.html(`当前成长值${Growth},<br/>${VIPtext}`);


    }

}


/**
 * 通用问题弹窗*/
{
    var GiftError = {};
    GiftError.off = function(data,Boolean){
        let heig = Boolean === false ? 150 : 200;
        CPM({
            title:'提示',
            ID:$('#Gift-alert-GiftError'),
            width:400,
            height:heig,
            titleClose:false,
            culling:function(){
                let BooTxt = Boolean === false ? '' : '<a class="Gift-alert-cash-integral-hidden" href="javascript:">确定</a>';
                let html = `
                    <style type="text/css">
                        #Gift-alert-GiftError .Gift-alert-cash-integral{font-size:14px;color:#999999;width:300px;margin:20px auto 0;overflow:hidden}
                        #Gift-alert-GiftError .Gift-alert-cash-integral p{margin:15px 0 20px;display:block;line-height:25px;text-align: center}
                        #Gift-alert-GiftError .Gift-alert-cash-integral a{display:block;margin:0 auto;background:#fff;border:1px solid #38c0ff;color:#38c0ff;line-height:40px;width:140px;text-align: center}
                    </style>
                    <div class="Gift-alert-cash-integral">
                        <p>${data}</p>
                        ${BooTxt}
                    </div>
                `;
                return html;
            },
            success:function(){
                $('.Gift-alert-cash-integral-hidden').off('click').on('click',function(){ $("#Gift-alert-GiftError").remove() });
            }
        });
    };
    GiftError.remove = function(){ $("#Gift-alert-GiftError").remove() };

}

/**
 * 积分兑换弹窗 */
{

    /**
     * 积分不足提示弹窗*/
    function GiftCashOff(){
        CPM({
            title:'提示',
            ID:$('#Gift-alert-cashOff'),
            width:400,
            height:200,
            culling:function(){
                let html = `
                    <style type="text/css">
                        #Gift-alert-cashOff .Gift-alert-cash-integral{font-size:14px;color:#999999;width:300px;margin:20px auto 0;overflow:hidden}
                        #Gift-alert-cashOff .Gift-alert-cash-integral p{margin:15px 0 20px;display:block;line-height:25px;text-align: center}
                        #Gift-alert-cashOff .Gift-alert-cash-integral a{display:inline-block;background:#38c0ff;color:#fff;line-height:40px;width:140px;text-align: center;float:left}
                        #Gift-alert-cashOff .Gift-alert-cash-integral a.Gift-alert-cash-integral-hidden{background:#fff;border:1px solid #38c0ff;color:#38c0ff;float:right}
                    </style>
                    <div class="Gift-alert-cash-integral">
                        <p>对不起，您的积分不足，赚够积分再换吧！</p>
                        <a href="/member/point">赚积分</a>
                        <a class="Gift-alert-cash-integral-hidden" href="javascript:">取消</a>
                    </div>
                `;
                return html;
            },
            success:function(){
                $('.Gift-alert-cash-integral-hidden').off('click').on('click',function(){ $("#Gift-alert-cashOff").remove() });
            }
        });
    }

    /**
     * 成功后提示弹窗*/
    function GiftCashs(gral,rule){
        CPM({
            title:'提示',
            ID:$('#Gift-alert-cashs'),
            width:400,
            height:370,
            culling:function(){
                let __FILE__, scripts = document.getElementsByTagName("script");
                __FILE__ = scripts[scripts.length - 1].getAttribute("src").split('/static/')[0];
                let html = `
                    <style type="text/css">
                        #Gift-alert-cashs .Gift-alert-cash-integral{font-size:14px;color:#999999;width:300px;margin:20px auto 0;overflow:hidden}
                        #Gift-alert-cashs .Gift-alert-cash-integral div{overflow:hidden;background:url("+__FILE__+"/static/images/v3/builtv3/member/alert-back.png) no-repeat;width:300px;height:125px;margin:10px 0 20px;position: relative;color:#fff}
                        #Gift-alert-cashs .Gift-alert-cash-integral div label{font-size:66px;width:123px;text-align: center;position: absolute;top:0;left:93px;line-height:90px}
                        #Gift-alert-cashs .Gift-alert-cash-integral div span{font-size:14px;position: absolute;bottom:8px;left:0;width:100%;text-align: center}
                        #Gift-alert-cashs .Gift-alert-cash-integral p{margin:15px 0 20px;display:block;line-height:25px;}
                        #Gift-alert-cashs .Gift-alert-cash-integral strong{font-size:24px;color:#ff605d;}
                        #Gift-alert-cashs .Gift-alert-cash-integral a{display:inline-block;background:#38c0ff;color:#fff;line-height:40px;width:140px;text-align: center;float:left}
                        #Gift-alert-cashs .Gift-alert-cash-integral a.Gift-alert-cash-integral-hidden{background:#fff;border:1px solid #38c0ff;color:#38c0ff;float:right}
                    </style>
                    <div class="Gift-alert-cash-integral">
                        <div><label>${gral}</label><span>${rule}</span></div>
                        <p>恭喜您成功兑换一张面值 ${gral} 元的现金券，请尽快使用哦！</p>
                        <a href="/invest/list">去使用</a>
                        <a class="Gift-alert-cash-integral-hidden" href="javascript:">取消</a>
                    </div>
                `;
                return html;
            },
            success:function(){
                $('.Gift-alert-cash-integral-hidden').off('click').on('click',function(){ $("#Gift-alert-cashs").remove() });
            }
        });
    }
    
    /**
     * 兑换事件*/
    $('.Gift li').on('click', function () {

            //未登录时弹出登录窗口并退出函数
            if( $('#isLogin').val() == 0 ) { $('.figt-login').click(); return; }
    
            let
                    that = $(this),
                   rules =   $('.register .pic a').text(),    //用户积分数量(取值来自当前页面 签到栏 用户信息-我的积分)
                    gral =   that.children('label').text(),     //现金券
                ExpiryDate = that.children('span').text(),      //有效期
                Integral =   Math.floor(gral)*100,                 //积分兑换
                    rule =   that.children('p').text();         //使用条件

            //用户积分小于所选兑换积分时显示 - 积分不足提示,否则执行兑换函数
            if(Math.floor(rules) <  Integral){

                GiftCashOff();
            }else{


                    /**
                     * 兑换确认弹窗 */
                    CPM({
                        title:'确定兑换',
                        ID:$('#Gift-alert-cash'),
                        width:400,
                        height:295,
                        culling:function(){
                            let html = `
                            <style type="text/css">
                                #Gift-alert-cash .Gift-alert-cash-integral{font-size:14px;color:#999999;width:80%;margin:-5px auto 0;overflow:hidden}
                                #Gift-alert-cash .Gift-alert-cash-integral p{margin:15px 0 5px;display:block;width:90%;line-height:25px}
                                #Gift-alert-cash .Gift-alert-cash-integral strong{font-size:24px;color:#ff605d;}
                                #Gift-alert-cash .Gift-alert-cash-integral p.Gift-alert-cash-error{margin:0 0 5px;display:block;width:90%;height:25px;line-height:25px;color:red}
                                #Gift-alert-cash .Gift-alert-cash-integral a.Gift-alert-cash-integral-submit{display:block;margin:0 auto;text-align:center;padding:10px 0;font-size:16px;color:#fff;width:100%;background:#38c0ff}
                            </style>
                            <div class="Gift-alert-cash-integral">
                                <p>可用积分: <strong>${rules}</strong></p>
                                <p>确认消耗 ${Integral} 积分兑换一张面值 ${gral} 元的现金券？（ ${rule} , ${ExpiryDate} ）</p>
                                <p class="Gift-alert-cash-error"></p>
                                <a class="Gift-alert-cash-integral-submit" href="javascript:">确定</a>
                            </div>
                        `;

                            return html;
                        },
                        success:function(){

                            $('.Gift-alert-cash-integral-submit').on('click', function () {

                                let errors = $('.Gift-alert-cash-error');

                                errors.html('<b style="color:#38c0ff">提交中,请稍后...</b>');

                                $.ajax({
                                    type:'POST',
                                    url:'/member/json',
                                    data:'action=point_exchange&id='+that.attr('point-ID'),
                                    dataType:'json',
                                    async:'false',
                                    complete:function(){
                                        $('#Gift-alert-cash').remove();
                                    },
                                    success:function(data){
                                        if(data.code == '00000'){
                                             //结果弹窗
                                             GiftCashs(gral,rule);
                                             //减去使用积分
                                             $('.Integral').text(rules-Integral);

                                        }else{
                                            GiftError.off(data.msg);
                                        }
                                    },
                                    error:function(){
                                        GiftError.off('本次提交失败，请稍后重试！');
                                    }
                                });

                            });

                        }
                    });


            }

    });


}




/**
 * 礼包领取弹窗 */
{

    $('.giftBag .bd ul.list li').on('click', function () {

        let that = $(this);

        GiftError.off('<b style="color:#38c0ff">提交中,请稍后...</b>',false);
        $.ajax({
            type:'POST',
            url:'/member/json',
            data:'action=giftbag_draw&giftbag_id='+that.attr('gift-ID'),
            dataType:'json',
            async:'false',
            complete:function(){
                GiftError.remove();
            },
            success:function(data) {
                if(data.code === '00000'){

                    CPM({
                        title: '提示',
                        ID: $('#Gift-alert-OEM'),
                        width: 400,
                        height: 380,
                        culling: function () {
                            let __FILE__, scripts = document.getElementsByTagName("script");
                            __FILE__ = scripts[scripts.length - 1].getAttribute("src").split('/static/')[0];

                            //链接文字
                            let href = '',message = data.data.giftbags[0].message;
                            if( message.indexOf('现金劵') >= 0 ){
                                href = '<a href="/account/cashcoupon" class="Gift-alert-OEM-text">查看我的现金券</a>';
                            }else if( message.indexOf('加息劵') >= 0 ){
                                href = '<a href="/account/interest/1" class="Gift-alert-OEM-text">查看我的加息劵</a>';
                            }else if( message.indexOf('惠人币') >= 0 ){
                                href = '<a href="/account/hrcoin" class="Gift-alert-OEM-text">查看我的惠人币</a>';
                            }else if( message.indexOf('积分') >= 0 ) {
                                href = '';
                            }

                            let html = `
                                <style type="text/css">
                                    #Gift-alert-OEM .Gift-alert-OEM-integral{font-size:14px;color:#999999;width:300px;margin:20px auto 0;overflow:hidden}
                                    #Gift-alert-OEM .Gift-alert-OEM-integral div{overflow:hidden;background:url("+__FILE__+"/static/images/v3/builtv3/member/OEM-alert.png) no-repeat;width:184px;height:135px;margin:10px auto 20px auto;position: relative;color:#fff}
                                    #Gift-alert-OEM .Gift-alert-OEM-integral p{margin:15px 0 20px;display:block;line-height:25px;text-align: center}
                                    #Gift-alert-OEM .Gift-alert-OEM-integral a.Gift-alert-OEM-integral-hidden{display:block;margin:20px auto 0;text-align:center;padding:10px 0;font-size:16px;color:#fff;width:100%;background:#38c0ff}
                                    #Gift-alert-OEM .Gift-alert-OEM-integral a.Gift-alert-OEM-text{display:block;margin:10px auto 0;text-align:center;color:#38c0ff}
                                </style>
                                <div class="Gift-alert-OEM-integral">
                                    <div></div>
                                    <p>恭喜您获得${message}！</p>
                                    <a class="Gift-alert-OEM-integral-hidden" href="javascript:">确定</a>
                                    ${href}
                                </div>
                            `;
                            return html;
                        },
                        success: function () {
                            $('.Gift-alert-OEM-integral-hidden').off('click').on('click', function () { window.location.reload() });
                        }
                    });

                }else{
                    GiftError.off(data.msg);
                }

            },
            error:function(data) {
                GiftError.off('本次提交失败，请稍后重试！');
            }
        });



    });


}




/**
 * 会员专享理财：能否投资判断 */
{
    //验证标的等级
    function cosol(that){
        let pic = that.parents('.vip-invest-item').attr('class');
        return pic.indexOf('gold') >= 0 ? 2 : pic.indexOf('silver') >= 0 ? 3 : pic.indexOf('jewel') >= 0 ? 4 : 1;
    }
    //验证用户等级
    $('.vip-invest-list-judge').on('click',function(){
        let that = $(this);
        let
            pic = $('.chief .pic p label').attr('class'),
            sos = cosol(that),
            cos;

        switch(pic){
            case 'bronze': //铜牌
                cos = 1;
                break;
            case 'silver': //银牌
                cos = 2;
                break;
            case 'gold': //金牌
                cos = 3;
                break;
            default: //钻石
                cos = 4;
                break;
        }

        CPM({
            title:'提示',
            ID:$('#vip-alert-judge'),
            width:400,
            height:270,
            culling:function(){
                let html = `
                <style type="text/css">
                    #vip-alert-judge .vip-alert-judge-integral{font-size:14px;color:#999999;width:300px;margin:20px auto 0;overflow:hidden}
                    #vip-alert-judge .vip-alert-judge-integral p{margin:15px 0 20px;display:block;line-height:25px;text-align: center}
                    #vip-alert-judge .vip-alert-judge-integral a{display:inline-block;background:#38c0ff;color:#fff;margin-top:25px;line-height:40px;width:140px;text-align: center;float:left}
                    #vip-alert-judge .vip-alert-judge-integral a.vip-alert-judge-integral-hidden{background:#fff;border:1px solid #38c0ff;color:#38c0ff;float:right}
                </style>
                <div class="vip-alert-judge-integral">
                    <p>对不起，您的会员等级为H${cos}，此项目为H${sos}会员专享理财标，请您选择其他理财项目进行投资！</p>
                    <span>（注：签到和投资可提升会员等级哦~）</span>
                    <a href="/invest/list">其他理财项目</a>
                    <a class="vip-alert-judge-integral-hidden" href="javascript:">取消</a>
                </div>
            `;
                return html;
            },
            success:function(){
                $('.vip-alert-judge-integral-hidden').off('click').on('click',function(){ $("#vip-alert-judge").remove() });
            }
        });

        return false;

    });
}







/**
 * 积分抽奖：中奖榜 */
{

    //中奖榜滚动信息
    function items() {
        let item = $('.Draw .prize ul.item');
        if (item.children().length > 6) {
            item.children().first().stop().animate({'height': '0'}, 2000, function () {
                let coop = $(this).remove();
                item.append(coop);
                item.children().last().removeAttr('style');
                items()
            });
        }
    }
    items();


    //分页代码
    function Page(obj,success){
        obj.id.PageAjax({
            pageCount:obj.pageCount,//总页数
            total : obj.total,      //数据总条数
            current:obj.current,    //当前页数
            backFn:function(page){

                $.ajax({
                    type:'POST',
                    url:obj.url,
                    data:obj.data + '&page='+page,
                    dataType:'json',
                    async:'false',
                    success:function(data) {
                        if(data.code == '000') {
                            success(data);
                        }
                    }
                });

            }
        });
    }

    //抽奖规则弹窗
    $('.Draw_rule').bind('click',function(){
        CPM({
            title:'抽奖规则',
            ID:$('#Draw-rule'),
            width:500,
            height:370,
            culling:function() {
                let html = `
                <style type="text/css">
                    #Draw-rule .rule_text { line-height:30px;width:100%;height:215px;overflow:auto; } 
                    #Draw-rule a{display:block;margin:20px auto 0;text-align:center;padding:10px 0;font-size:16px;color:#fff;width:40%;background:#38c0ff}
                </style>
                 <div class="rule_text">${$('.DDescription').val()}</div>
                <a id="Draw-rule-submit" href="javascript:;">关闭</a>
            `;

                return html;
            },
            success:function(){

                $('#Draw-rule-submit').on('click',function(){ $('#Draw-rule').remove() })

            }
        });
    });



    //计算附加高度
    function altitude(DataLength){
        //如果大于 7 行，则停止增加高度，否则每多一行增加 30 高度 (每5条为一行)，最后返回增加高度
        if( Math.ceil(DataLength) > 9 ) return parseInt( 10 * 33 ) + 60; else return DataLength <= 1 ? 0 :parseInt( Math.ceil(DataLength) * 33 );
    }
    //我的中奖记录
    $(document).off('click','.Draw_record').on('click','.Draw_record',function(){

        //检查是否登录
        if(parseInt($('#isLogin').val()) != 1) { $('.login').click(); return; }

        $.ajax({
            type:'POST',
            url:'/member/info',
            data:'type=drawlog',
            dataType:'json',
            async:'flase',
            success:function(data){
                if(data.code === '000'){

                    CPM({
                        title:'我的中奖记录',
                        ID:$('#Draw-record'),
                        width:650,
                        height:150+altitude(data.data.logs.length),
                        culling:function() {
                            let html = `
                                <style type="text/css">
                                    #alert-Draw-record-SnatchRecord { width:95%;margin:0 auto;text-align:center;line-height:30px;}
                                    #alert-Draw-record-SnatchRecord ol,#alert-Draw-record-SnatchRecord ul{width:100%;overflow:hidden;}
                                    #alert-Draw-record-SnatchRecord ol{background:#38c0ff;color:#fff}
                                    #alert-Draw-record-SnatchRecord ul li{background:#cccccc;margin:5px 0;}
                                    #alert-Draw-record-SnatchRecord ol li,#alert-Draw-record-SnatchRecord ul li span{display:inline-block;width:40%;margin:0 2.5%;}
                                    #Draw-record #alert-Draw-record-list-page.page-nav a{width: 24px;font-size:12px}
                                    #Draw-record #alert-Draw-record-list-page.page-nav a.prev, 
                                    #Draw-record #alert-Draw-record-list-page.page-nav a.next,
                                    #Draw-record #alert-Draw-record-list-page.page-nav a.first, 
                                    #Draw-record #alert-Draw-record-list-page.page-nav a.last{width:65px}
                                    #Draw-record #alert-Draw-record-list-page.page-nav .total,
                                    #Draw-record #alert-Draw-record-list-page.page-nav .totalPage{margin:0 5px}
                                </style>
                                <div id="alert-Draw-record-SnatchRecord">
                                    <ol>
                                        <li>获得奖品</li>
                                        <li>时间</li>
                                    </ol>
                                    <ul id="alert-Draw-record-nums"></ul>
                                </div>
                                <div id="alert-Draw-record-list-page" class="page-nav"></div>
                                
                            `;

                            return html;
                        },
                        success:function(){

                            function txt(data){
                                let txt = '';
                                for(let i = 0; i < data.data.logs.length; i++) {
                                    txt += `<li><span>${data.data.logs[i].prize_name}</span><span>${data.data.logs[i].prize_time}</span></li>`
                                }
                                $('#alert-Draw-record-nums').html(txt);
                            }
                            txt(data);

                            if(Math.floor(data.data.logs.length) < 9) $('#alert-Draw-record-list-page').hide();

                            Page({
                                id:$('#alert-Draw-record-list-page'),
                                pageCount:data.data.total_page,//总页数
                                total:data.data.total_count,//数据总条数
                                current:data.data.current_page,//当前页数
                                url:'/member/info',
                                data:'type=drawlog'
                            },function(data){ txt(data) });

                        }
                    });

                }
            },
            error:function(){

            }
        })
    });

}





/**
 * 会员抽奖 */
let lottery = require('./page/lottery/lottery');
{

    //中奖/未中 弹窗
    function Evnery(data,OFF,but){
        //中奖
        let html = `
            <div id="DrawAlert">
                <div class="Drar-Alert-yeslottery">
                    <div class="info">
                        <label>恭喜您抽中：</label>
                        <span>${data.data.prizeName}</span>
                        <p>使用积分可继续抽奖（10积分/次）</p>
                        <p>当前可用积分：${data.data.points}</p>
                        <a class="Drar-Alert-lottery-submit" href="javascript:;">确定</a>
                        <i id="Drar-Alert-lottery-record" class="Draw_record">查看我的中奖记录</i>
                    </div>
                </div>
            </div>
            `;
        //未中奖
        let Over = `
            <div id="DrawAlert">
                <div class="Drar-Alert-notlottery">
                    <div class="info">
                        <strong>${data.data.prizeName}</strong>
                        <p>使用积分可继续抽奖（10积分/次）</p>
                        <p>当前可用积分：${data.data.points}</p>
                        <a class="Drar-Alert-lottery-submit" href="javascript:;">确定</a>
                        <i id="Drar-Alert-lottery-record" class="Draw_record">查看我的中奖记录</i>
                    </div>
                </div>
            </div>
            `;

        //内容填充后自动打开
        if(OFF) $('body').append(html); else $('body').append(Over);
        //关闭
        $(document).off('click','.Drar-Alert-lottery-submit').on('click','.Drar-Alert-lottery-submit',function(){ $('#DrawAlert').remove() });
        $(document).off('click','#Drar-Alert-lottery-record').on('click','#Drar-Alert-lottery-record',function(){ $('#DrawAlert').remove() });

        //开启抽奖功能
        but.data(but.attr('class'),true);
    }

    //积分不足/失败 弹窗
    function deficiency(data,OFF,but){
        CPM({
            title:'提示',
            ID:$('#lottery-alert-deficiency'),
            width:450,
            height:280,
            culling:function() {
                let html = `
                    <style type="text/css">
                        #lottery-alert-deficiency .lottery-alert-deficiency-integral{font-size:14px;color:#999999;width:330px;margin:20px auto 0;overflow:hidden;text-align: center}
                        #lottery-alert-deficiency .lottery-alert-deficiency-integral p{margin:15px 0 20px;display:block;line-height:25px;}
                        #lottery-alert-deficiency .lottery-alert-deficiency-integral span{display:block;}
                        #lottery-alert-deficiency .lottery-alert-deficiency-integral a{display:inline-block;background:#38c0ff;color:#fff;margin-top:25px;line-height:40px;width:140px;text-align: center;float:left}
                        #lottery-alert-deficiency .lottery-alert-deficiency-integral a.lottery-alert-deficiency-integral-hidden{background:#fff;border:1px solid #38c0ff;color:#38c0ff;float:right}
                    </style>
                `;
                let Evn = `
                    <div class="lottery-alert-deficiency-integral">
                        <p>您已不足10积分，不能再抽啦！赚够积分再来吧！</p>
                        <span>当前可用积分：${data}</span>
                        <a href="/account/info">赚积分</a>
                        <a class="lottery-alert-deficiency-integral-hidden" href="javascript:">取消</a>
                    </div>
                    `;
                let Ove = `
                    <div class="lottery-alert-deficiency-integral">
                        <p style="margin-top:40px">${data}</p>
                        <a class="lottery-alert-deficiency-integral-hidden" style="float:none" href="javascript:">确定</a>
                    </div>
                    `;

                if(OFF) html += Evn; else html += Ove;

                return html;
            },
            success:function(){
                $('.lottery-alert-deficiency-integral-hidden').on('click',function(){ $('#lottery-alert-deficiency').remove() })
            }
        });

        //开启抽奖功能
        but.data(but.attr('class'),true);
    }

    //初始抽奖状态
    if($('#lottery').data('employ')) $('.lottery-units a').html('10积分/次');

    lottery({
        ID:$('#lottery'),
        button:$('.lottery-units'),
        type:'POST',
        url:'/member/info',
        data:'type=draw',
        impose:true,
        success:function(data,rolls,but){

            if(data.code == '000'){
                // 等于 1 为中奖，等于 0 为未中奖
                if(data.data.result == 1) rolls(data.data.sort,function(){ Evnery(data,true,but); }); else rolls(data.data.sort,function(){ Evnery(data,false,but) });
                $('.lottery-units a').html('10积分/次');
            } else {
                if( parseInt(data.data.points) < 10 ){ deficiency(data.data.points,true,but); } else { deficiency(data.msg,false,but); }
            }

        },
        error:function(but){ deficiency('服务器连接失败，请稍后重试',false); but.data(but.attr('class'),true); }
    });


}











