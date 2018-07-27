/**
 * Created by Dreamslink on 16/11/7.
 * 夺宝详情 - 投资
 */

let alertYard = require('./page/snakch/alertYard/alertYard');
let CPM = require('./page/alert/init');
let radio = require('./page/radio/radio');
let timeCountdown = require('./page/timeCountdown/timeCountdown');
require('./page/timeCountdowns/timeCountdowns');
require('./page/user/buttonColor');


//标ID
let invest_id = $('#invest_id').val();

/**
 * 投资 */
{
    let
        /**取值*/
         money = parseInt($('#money').text()),           //账户余额
        single = parseInt($('#single').text()),          //每份金额
       surplus = parseInt($('#surplus').text()),         //剩余可投金额
   each_income = parseFloat($('#each_income').val()),    //每百元收益

       /**打印/获取*/
       buy = $('#buy'),          //购买金额
       err = $('#snakch-error'), //错误信息
     input = $('#snakch-value'); //输入框


    /*核心验算*/
    let
    UIsurplus = surplus / single,           //标的剩余份数
    IDsurplus = Math.ceil(money / single);  //余额可购买份数

    input.on('keyup',function(){
        let that = $(this);
        let Boo = /^\d+(\d{0})?$/.test(that.val());

        that.css('color','#333');

        if(!Boo){
            if(that.val() == '') err.html('<b style="color:red">请输入投资份数</b>'); else err.html('<b style="color:red">投资份数必须是整数</b>');
            that.data('submit',false);
        } else {
            err.html('&nbsp;');

            let value = parseInt(that.val());

            if($("#is_newbie_invest").val() == 1 && $("#is_newbie").val() == 2){
                //如果是新手标
                err.html('您已经不是新手用户，不能投新手标');
                that.data('submit',false)
            } else if( $('#is_setpaypwd').val() == 0 ) {
                //如果未设置支付密码
                err.html('您未设置支付密码，请<a href="/index.php?user&q=user/paypwd/setting" target="_blank">设置支付密码</a>后继续投资');
                that.data('submit',false)
            } else if(value > UIsurplus) {
                //如果投资份数大于剩余可投份数:
                err.html('您的投资份数需小于剩余份数');
                that.data('submit',false);
            } else if(value > IDsurplus) {
                //如果投资份数大于账户余额可购买份数：
                err.html('您的账户余额不足');
                that.data('submit',false);
            } else {
                err.html('&nbsp;');
                that.data('submit',true);

                var buys = (single * value).toFixed(2);
                buy.html(buys);
            }

        }


    });

    $('#snakch-submit').bind('click',function(){

        let
            that = $(this),
            $fen = input.val(),  //投资份数
            $cen = $('#repeat').val(),  //防重复
            $award = $('#PC-award').text(),  //夺宝奖励
            $buy = parseInt(buy.text()); //加入金额

        let emu = $buy * (each_income / 100); //预期收益

        if(input.data('submit')) {

            that.buttonColorOff(err,'提交中,请稍后...');
            CPM({
                title:'确认支付',
                ID: $('#snakch-button-submit-alert'),
                width: 500 ,
                height: 405 ,
                action: '/seize/pay',
                culling: function(){
                    return `
                          <style type="text/css">
                            #snakch-button-submit-alert p {line-height:35px}
                            #snakch-button-submit-alert strong {color:#38c0ff}
                            #snakch-button-submit-alert #snakch-button-submit-alert-input {width:82%;line-height:45px; padding:0 10px;margin-bottom:5px;}
                            #snakch-button-submit-alert #snakch-button-submit-alert-submit {margin:5px 0 10px 0;text-align:center;border:none;background:#38c0ff;color:#fff;width:100%;line-height:45px;font-size:18px;}
                            #snakch-button-submit-alert a {color:#38c0ff}
                            #snakch-button-submit-alert #snakch-button-submit-alert-error {color:red;height:25px;line-height:25px;margin:10px 0;text-align:center}
                            #snakch-button-submit-alert #snakch-button-submit-alert-radio {float:left}
                            #snakch-button-submit-alert em {float:right;color:#888}
                            #snakch-button-submit-alert p {}
                          </style>
                          <div style="width:90%;margin:0 auto">
                              <p style="margin-bottom:10px">夺宝成功将获得 ${$award} 元现金奖励，请确认无误后进行支付：</p>
                              <p>加入金额：<strong>${$buy}</strong> 元（${$fen}份）</p>
                              <p>预期收益：<strong>${emu}</strong> 元 </p>
                              <input id="repeat" type="hidden" value="${$cen}">
                              <input type="hidden" name="borrowId" title="标的ID" value="${invest_id}">
                              <input type="hidden" name="partCount" title="份数" value="${$fen}">
                              <p style="margin-top:20px;">支付密码：<input id="snakch-button-submit-alert-input" name="payPassword" type="password" placeholder="请输入支付密码" value="" disabled="disabled"  autocomplete="off"></p>
                              <span id="snakch-button-submit-alert-error">&nbsp;</span>
                              <input id="snakch-button-submit-alert-submit" type="submit" value="确定">
                              <div class="login-sport">
                                    <div id="snakch-button-submit-alert-radio">
                                        <input name="sport" type="radio" class="radioShi">
                                        <label id="sport" class="radioShi">我同意相关 <a href="${ '/invest/agreement/'+invest_id }">《借款协议》</a></label>
                                    </div>
                                    <em>投资有风险</em>
                              </div>
                          </div>
                    `;
                },
                success: function(){

                    let
                        Submit = $('#snakch-button-submit-alert-submit'),
                           err = $('#snakch-button-submit-alert-error'),
                         input = $('#snakch-button-submit-alert-input');

                    //提交状态清除
                    that.buttonColorOn();
                    $('#snakch-error').html('');

                    //单选框
                    radio(
                    '#snakch-button-submit-alert-radio',
                    function(){
                        err.html('&nbsp;');
                        Submit.data('radio',true);
                    },function(){
                        err.html('请认真阅读协议书，并勾选');
                        Submit.data('radio',false);
                    });


                    $(document).off('mouseover','#snakch-button-submit-alert-input').on('mouseover','#snakch-button-submit-alert-input',function(){ input.removeAttr('disabled') });
                    setTimeout(function(){ input.removeAttr('disabled') },2000);

                    $(document).on('keyup','#snakch-button-submit-alert-input',function(){
                        if( $(this).val() == '') {
                            err.html('密码不能为空');
                            Submit.data('input',false);
                        } else {
                            err.html('&nbsp;');
                            Submit.data('input',true);
                        }
                    });

                    $(document).on('click','#snakch-button-submit-alert-submit',function(){
                        let that = $(this);
                        if(that.data('radio') && that.data('input')) {
                            err.html('<b style="color:#38c0ff">提交中，请稍后...</b>');
                            that.css({'color':'#fff','background': '#666666'});
                            return true;
                        } else {
                            if(!Submit.data('input')) err.html('密码不能为空');
                            if(!Submit.data('radio')) err.html('请认真阅读协议书，并勾选');
                            return false;
                        }
                    });
                }
            });
        }
    });


    /**
     * 投资剩余时间 */
    $(".calc-Time").each(function () {
        var that = $(this);
        timeCountdown(that,0,that.attr('data-remainTime'),{
            remainOn:function(){},
            remainOut:function(){
                that.html('<em style="color:#f90">此标已过期!</em>');
                //禁用提交按钮以及输入框
                $('#snakch-submit').css('background','#666666').attr('disabled','disabled');
                $('#snakch-value').attr('disabled','disabled');
            }
        });
    });
}

/**
 * 夺宝码查看条：点击查看全部*/
{
    let snck = $('#snck p');

    if(snck.children('span').length > 5) snck.addClass('cos');

    $(document).on('click', '.cos', function () {

        $.ajax({
            type: 'POST',
            url: '/seize/nums',
            data: 'uId=&borrowId='+invest_id+'&page=1',
            dataType: 'json',
            async: 'false',
            success: function (data) {
                alertYard(data,'uId=&borrowId='+invest_id);
            }
        });

    });
}

/**
 * ajax分页(信息打印)
 * */
require('./page/page/PageAjax');
{
    //通用
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
                        if(data.code == '00000' || data.code == '000') {
                            success(data);
                        }
                    }
                });

            }
        });
    }


    /**
     * 往期夺宝
     * */
    function txt(logs){
        let awaits;
        switch (logs.announce_status) {
            case 0 :
                /**夺宝中*/
                awaits = `<span class="col-7 mar-2" style="text-align:center;font-weight:bold"><label>夺宝进行中...</label></span><span class="col-1 mar-1"><a class="snak-list-alert" href="${logs.pc_url}">查看详情</a></span>`;
                break;
            case 1 :
                /**等待揭晓*/
                awaits = `
                        <span class="col-1 mar-2"><label>等待揭晓</label></span>
                        <span class="col-6">
                            <!--<div class="digitsTwo"></div>-->
                            <div class="digitsTwo" style="line-height:75px"></div>
                        </span>
                        <span class="col-1 mar-1"><a class="snak-list-alert" href="${logs.pc_url}">查看详情</a></span>
                    `;
                break;
            case 2 :
                /**夺宝公布*/
                awaits = `
                        <span class="col-3 mar-2">
                            夺宝成功用户：${logs.winner_username} <br>
                            夺宝奖励：<b>${logs.winning_amount}元</b> <br>
                            购买份数：${logs.winner_partnum}份
                        </span>
                        <span class="col-3 run-1">
                            幸运夺宝码：<b>${logs.winning_num}</b> <br>
                            夺宝时间：${logs.seize_time} <br>
                            揭晓时间：${logs.winning_time} <br>
                        </span>
                        <span class="col-1 mar-1"><a class="snak-list-alert" href="${logs.pc_url}">查看详情</a></span>
                    `;
                break;
            default :
                /**中心异常*/
                awaits = `<span class="col-6"><label><b>福彩中心异常，结果延迟揭晓，请耐心等待</b></label></span> <span class="col-1 mar-1"><a class="snak-list-alert" href="${logs.pc_url}">查看详情</a></span>`;
                break;
        }
        /**最终拼接代码*/
        return `<div class="row"> <span class="col-1"> ${logs.periods} </span> ${awaits} </div>`;
    }
    $.ajax({
        type:'POST',
        url:'/seize/pastlogs',
        data:'page=1',
        dataType:'json',
        async:'false',
        success:function(data){

            if(data.code == '00000') {

                function TEXTS(data){
                    var test = '', undaArr = [], dTime = '0', logs = data.data.logs;

                    //修改数据顺序
                    for(let i = 0; i < logs.length; i++) { undaArr[i] = logs[i] }
                    //遍历最终信息
                    for(let i = 0; i < undaArr.length; i++) {
                        //拼接数据
                        test += txt(undaArr[i]);
                        //查找倒计时间
                        if (undaArr[i].announce_status == 1) {
                            if(undaArr[i].last_announce_time != '0') dTime = undaArr[i].last_announce_time;
                        }
                    }
                    //打印
                    $("#snakch-list").html(test);
                    //倒计时动态渲染
                    $(function(){
                        $(".digitsTwo").each(function () {
                            var that = $(this);
                            timeCountdown(that,0,dTime,{
                                remainOn:function(){},
                                remainOut:function(){ if(dTime != '0') location.reload() }//剩余时间结束,刷新
                            });
                        });
                    });

                }

                TEXTS(data);
                Page({
                    id:$('#snatch-list-page'),
                    pageCount:data.data.total_page,
                    total:data.data.total_count,
                    current:data.data.current_page,
                    url:'/seize/pastlogs',
                    data:''
                },function(data){ TEXTS(data) });

            }
        }
    });
    /**
     * 借入者借款记录
     * */
    $.ajax({
        type:'POST',
        url:'/invest/borrowlogs',
        data:'borrow_uId='+$('#borrow_uid').val()+'&page=1',
        dataType:'json',
        async:'false',
        success:function(data) {

            if(data.code == '000') {

                function Text(data){
                    let html = `<div class="row col-cor-blue font-center"><div class="col-2 run-1 font-left">项目编号</div><div class="col-2">借款金额</div><div class="col-1 run-05">借款期限</div><div class="col-1 run-05">年利率</div><div class="col-2">投资时间</div><div class="col-1">状态</div></div>`;
                    for(var i = 0; i<data.data.length; i++){
                        html += `
                        <div class="row col-cor-grey font-center">
                            <div class="col-2 run-1 font-left">${data.data[i].BUS_NUM}</div>
                            <div class="col-2">${data.data[i].ACCOUNT}元</div>
                            <div class="col-1 run-05">${data.data[i].TIME_LIMIT_DESC}</div>
                            <div class="col-1 run-05">${data.data[i].INT_RATE}</div>
                            <div class="col-2">${data.data[i].REPAYMENT_TIME_DESC}</div>
                            <div class="col-1">${data.data[i].STATUS == 'paid' ? '已还清' : '还款中'}</div>
                        </div>
                        `;
                    }
                    $('#invest-table').html(html);
                }
                Text(data);
                Page({
                    id:$('#invest-page'),
                    total:data.total,
                    pageCount:data.totalPage,
                    current:data.currentPage,
                    url:'/invest/borrowlogs',
                    data:'borrow_uId='+$('#borrow_uid').val()
                },function(data){ Text(data) });
            }

        }
    });
    /**
     * 夺宝记录
     * */
    $.ajax({
        type:'POST',
        url:'/invest/investlogs',
        data:'borrowId='+invest_id+'&page=1',
        dataType:'json',
        async:'false',
        success:function(data) {

            if(data.code == '000') {

                /**
                 * 会员领投 */
                if(data.member != '' && data.member != undefined){
                    let lod = $('#memberled'),mem;

                    //等级选择
                    switch(data.member.LEVEL_NAME){
                        case 'H2':
                            mem = 'silver';
                            break;
                        case 'H3':
                            mem = 'gold';
                            break;
                        case 'H4':
                            mem = 'diamond';
                            break;
                        default:
                            break;
                    }

                    let rgba = `<span class="col-3"><label class="mem ${mem}" style="font-size:16px">${data.member.NICK}</label></span>
                                <span class="col-3">用户名：<strong>${data.member.USERNAME_DESC}</strong></span>
                                <span class="col-3">领投金额：<strong>${data.member.ACCOUNT}元</strong></span>`;

                    lod.css('margin-bottom','-10px').children('div').css('line-height','33px').html(rgba);
                    lod.show();

                }

                /**
                 * 分页信息*/
                function Text(data){
                    let html = `
                                <div class="row col-cor-blue font-center">
                                    <div class="col-1-05 run-05 font-left font-left">夺宝用户</div>
                                    <div class="col-3">夺宝金额</div>
                                    <div class="col-2">有效金额</div>
                                    <div class="col-2">夺宝时间</div>
                                    <div class="col-1">状态</div>
                                    <div class="col-2">夺宝码</div>
                                </div>
                                `;
                    for(var i = 0; i<data.data.length; i++){
                        html += `
                                <div class="row col-cor-grey font-center">
                                    <div class="col-1-05 run-05 font-left font-left">${data.data[i].USERNAME_DESC}</div>
                                    <div class="col-3">${data.data[i].MONEY}元（${data.data[i].INVEST_COUNT}份）</div>
                                    <div class="col-2">${data.data[i].ACCOUNT}元</div>
                                    <div class="col-2">${data.data[i].ADDTIME_DESC}</div>
                                    <div class="col-1">通过</div>
                                    <div class="col-2"><a style="color:#38c0ff" class="uld" data-uld="${data.data[i].USER_ID}" data-tender="${data.data[i].ID}" href="javascript:;">详情</a></div>
                                </div>`;
                    }
                    $('#borrowing-table').html(html);
                }
                Text(data);
                Page({
                    id:$('#borrowing-page'),
                    total:data.total,
                    pageCount:data.totalPage,
                    current:data.currentPage,
                    url:'/invest/investlogs',
                    data:'borrowId='+invest_id
                },function(data){ Text(data) });
            }

        }
    });




}

/**
 * 同接口夺宝码弹窗*/
{
    $(document).on('click','.uld',function(){
        let that = $(this);
        let tender = that.data('tender') == undefined ? ' ' : that.data('tender');
        $.ajax({
            type: 'POST',
            url: '/seize/nums',
            data:`uId=${parseInt(that.data('uld'))}&tenderId=${tender}&borrowId=${invest_id}&page=1`,
            dataType: 'json',
            async: 'false',
            success: function (data) {
                alertYard(data,`uId=${parseInt(that.data('uld'))}+&tenderId=${tender}&borrowId=${invest_id}`);
            }
        });
    })
}

/**
 * 借款证明特效 */
{
    require('./lib/hrd');
    require.ensure(['./lib/DeriveImg'], function (require) {

        //左右切换按钮
        $(".partnerDerive").slide({mainCell:".bd ul",autoPage:true,effect:"left",vis:6,prevCell:'.f-prev',nextCell:'.f-next',pnLoop:'false'});

        require('./lib/DeriveImg');

        $(function(){

            $("#DeriveImg").DeriveImg({
                speed : 200,
                listSpeed : 200,
                setLood : {
                    path : "/static/images/v3/loading.gif",
                    width : 32,
                    height : 32
                },
                setModal : {
                    bgColor : "#000",
                    opacity : .6
                },
                state : "fade"
            });

        });

    },'DeriveImg');
}


