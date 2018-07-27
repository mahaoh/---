/**
 * Created by Dreamslink on 2017/3/13.
 * 我的盈计划
 */

let CPM = require('./page/alert/init');
let radio = require('./page/radio/radio');

require('./html/html-profit-help');


$(function () {

    /**
     * 加入记录*/

    function Sub(text,num){
        CPM({
            title:'提示',
            ID: $('#profit-alert-cashOn'),
            width: 480 ,
            height: 230 ,
            titleClose:false,
            culling: function(){
                let txts = num ? `<p style="margin-top:40px">${text}</p>` : `<p>${text}</p> <a class="profit-alert-cash-integral-Submit" href="javascript:;">确认</a>`;
                var html = `
                <style type="text/css">
                    #profit-alert-cashOn .profit-alert-cash-integral{font-size:14px;color:#999999;width:400px;margin:20px auto 0;overflow:hidden;text-align:center}
                    #profit-alert-cashOn .profit-alert-cash-integral p{margin:15px 0 20px;display:block;line-height:25px;text-align: center}
                    #profit-alert-cashOn .profit-alert-cash-integral a{display:inline-block;background:#38c0ff;color:#fff;line-height:40px;width:140px;text-align: center;}
                </style>
                <div class="profit-alert-cash-integral">
                    <p>${text}</p>
                    <a class="profit-alert-cash-integral-Submit" href="javascript:;">确认</a>
                </div>
            `;

                return html;
            },
            success: function(){

                $('.profit-alert-cash-integral-Submit').on('click',function(){ location.reload() })
            }
        });
    }

    $(document).on('click', '.xt', function () {

        let
            that = $(this),
            plan_id = that.data('plan_id'),//盈计划id
            log_id = that.data('log_id'),//标id
            name = that.data('name'),//盈计划名称
            time = that.data('time').replace(/-/g,'');//标加入时间

        CPM({
            title:'确认续投',
            ID: $('#profit-alert-cashOff'),
            width: 480 ,
            height: 230 ,
            culling: function(){
                var html = `
                <style type="text/css">
                    #profit-alert-cashOff .profit-alert-cash-integral{font-size:14px;color:#999999;width:400px;margin:20px auto 0;overflow:hidden}
                    #profit-alert-cashOff .profit-alert-cash-integral p{margin:15px 0 20px;display:block;line-height:25px;text-align: center}
                    #profit-alert-cashOff .profit-alert-cash-integral a{display:inline-block;background:#38c0ff;color:#fff;line-height:40px;width:140px;text-align: center;float:left;margin-left:40px;}
                    #profit-alert-cashOff .profit-alert-cash-integral a.profit-alert-cash-integral-hidden{background:#fff;border:1px solid #38c0ff;color:#38c0ff;float:right;margin-left:0;margin-right:40px;}
                </style>
                <div class="profit-alert-cash-integral">
                    <p>是否开通“${name}(${time})”续投功能？自动续投可使您的资金不闲置，保证收益最大化！</p>
                    <a class="profit-alert-cash-integral-hidden" href="javascript:;">再想想</a>
                    <a class="profit-alert-cash-integral-Submit" href="javascript:;">确认</a>
                </div>
            `;

                return html;
            },
            success: function(){

                $('.profit-alert-cash-integral-hidden').on('click',function(){ $('#profit-alert-cashOff').remove(); });
                $('.profit-alert-cash-integral-Submit').on('click', function () {

                    $(this).css({'color':'#fff','background': '#666666'}).attr('disabled', 'disabled');

                    $.ajax({
                        type:'POST',
                        url:'/plan/json',
                        data:`action=set&plan_id=${plan_id}&log_id=${log_id}&type=on`,
                        dataType:'json',
                        async:'false',
                        success:function(data){

                            $('#profit-alert-cashOff').remove();

                            if(data.code === '00000') Sub(`您已成功开通“${name}(${time})”的自动续投功能。`); else  Sub(data.msg);
                        }
                    });
                });
            }
        });

    });

    $(document).on('click', '.disr', function () {

        let
            that = $(this),
         plan_id = that.data('plan_id'),//盈计划id
          log_id = that.data('log_id'),//标id
            name = that.data('name'),//盈计划名称
            time = that.data('time').replace(/-/g,'');//标加入时间

        CPM({
            title:'确认取消续投',
            ID: $('#profit-myfrom'),
            width: 480 ,
            height: 230 ,
            culling: function(){
                var html = `
                <style type="text/css">
                    #profit-myfrom .profit-alert-cash-integral{font-size:14px;color:#999999;width:400px;margin:20px auto 0;overflow:hidden}
                    #profit-myfrom .profit-alert-cash-integral p{margin:15px 0 20px;display:block;line-height:25px;text-align: center}
                    #profit-myfrom .profit-alert-cash-integral a{display:inline-block;background:#38c0ff;color:#fff;line-height:40px;width:140px;text-align: center;float:left;margin-left:40px;}
                    #profit-myfrom .profit-alert-cash-integral a.profit-alert-cash-integral-hidden{background:#fff;border:1px solid #38c0ff;color:#38c0ff;float:right;margin-left:0;margin-right:40px;}
                </style>
                <div class="profit-alert-cash-integral">
                    <p>确认取消“${name}(${time})”自动续投功能？自动续投可使您的资金不闲置，保证收益最大化！</p>
                    <a class="profit-alert-cash-integral-hidden" href="javascript:;">再想想</a>
                    <a class="profit-alert-cash-integral-Submit" href="javascript:;">确认</a>
                </div>
            `;

                return html;
            },
            success: function(){

                $('.profit-alert-cash-integral-hidden').on('click',function(){ $('#profit-myfrom').remove(); });
                $('.profit-alert-cash-integral-Submit').on('click', function () {

                    $(this).css({'color':'#fff','background': '#666666'}).attr('disabled', 'disabled');

                    $.ajax({
                        type:'POST',
                        url:'/plan/json',
                        data:`action=set&plan_id=${plan_id}&log_id=${log_id}&type=off`,
                        dataType:'json',
                        async:'false',
                        success:function(data){

                            $('#profit-myfrom').remove();

                            if(data.code === '00000') Sub(`您已成功取消“${name}(${time})”的自动续投功能。`); else  Sub(data.msg);
                        }
                    });
                });
            }
        });
    });



    /**
     * 回款计划*/
    $(document).on('click', '.details', function () {

        let
            that = $(this),
            borrow_id = that.data('borrow_id'),
            credit_id = that.data('credit_id'),
            htmls='';

        $.ajax({
            type:'GET',
            url:`/account/credit/detail/${credit_id}/${borrow_id}/0/WINPLAN`,
            dataType:'json',
            async:'false',
            success:function(data){

                let cos = data.length > 5 ? 'style="height:205px;overflow:auto"' : '';

                htmls += `<div ${cos}>`;

                for(let i = 0; i < data.length; i++) {
                    htmls += `
                        <div class="row">
                            <span class="col-1-05">${data[i].repaymentDate}</span>
                            <span class="col-05">${data[i].nper}</span>
                            <span class="col-1-05">${data[i].psPrcpAmt}</span>
                            <span class="col-1-05">${data[i].interest}</span>
                            <span class="col-1">${data[i].lateDays}</span>
                            <span class="col-1-05">${data[i].psOdIntAmt}</span>
                            <span class="col-1-05">${data[i].totalAmount}</span>
                            <span class="col-1-05">${data[i].repaymentTime}</span>
                            <span class="col-05">${data[i].state}</span>
                            <span class="col-1">${data[i].prepayment}</span>
                        </div>
                    `;
                }

                htmls += '</div>';

                CPM({
                    title:'还款明细',
                    ID: $('#profit-alert-details'),
                    width: 900 ,
                    height: 400 ,
                    culling: function(){
                        let html = `
                                <style type="text/css">
                                    #profit-alert-details .ther-body{ width:95% }
                                    #profit-alert-details .row{ text-align:center;font-size:13px;border:1px solid #E8E8E8;border-bottom:none;line-height:40px }
                                    #profit-alert-details label{width: 100%;display: block;text-align: center;line-height: 40px;border: 1px solid #E8E8E8;}
                                    #profit-alert-details label a{color:#38c0ff}
                                </style>
                                <div class="row">
                                    <span class="col-1-05">应还日期</span>
                                    <span class="col-05">期数</span>
                                    <span class="col-1-05">应收本金</span>
                                    <span class="col-1-05">应收息费</span>
                                    <span class="col-1">逾期天数</span>
                                    <span class="col-1-05">逾期利息</span>
                                    <span class="col-1-05">实收总额</span>
                                    <span class="col-1-05">实还日期</span>
                                    <span class="col-05">状态</span>
                                    <span class="col-1">提前还款</span>
                                </div>
                                ${htmls}
                                <label><a href="/invest/agreement/${borrow_id }">《借款协议》</a></label>
                                
                            `;
                        return html;
                    },
                    success: function(){ }
                });
            }
        });

    });



});





// //输入密码续投弹窗 ：：：加入记录
// $(document).on('click', '.xt', function () {
//
//     let
//         that = $(this),
//         name = that.data('name'), //盈计划名称
//         apr = parseFloat(that.data('apr')), //年化利率
//         money = parseFloat(that.data('money')), //续投金额
//         income = parseFloat(that.data('each_income')); //每百元收益
//
//     let E = parseFloat(income * (money / 100));//预期收益
//
//     CPM({
//         title:'确认续投',
//         ID: $('#profit-myfrom'),
//         width: 590 ,
//         height: 580 ,
//         action: '',
//         culling: function(){
//             var html = `
//                 <style type="text/css">
//                     #profit-myfrom .row {line-height:35px;}
//                     #profit-myfrom .row input{width:80%;line-height:40px;padding:0 10px}
//                     #profit-myfrom .invError{font-size:12px;color:red}
//                     #profit-myfrom #help-profit-button{margin:0 auto 10px auto;display:block;padding:10px 150px;border:none;background:#38c0ff;color:#fff;}
//                     #profit-myfrom .login-radio{margin-left:100px}
//                     #profit-myfrom a{color:#38c0ff}
//                     #profit-myfrom .text label{display:block;margin:15px 0;}
//                     #profit-myfrom .text p{display:block;line-height:30px}
//                     #profit-myfrom .text a{line-height:40px}
//
//                 </style>
//                 <div class="row"><span class="col-2-05">续投类型：</span><span class="col-9">${name}</span></div>
//                 <div class="row"><span class="col-2-05">预期年利率：</span><span class="col-9">${apr}%  <b style="font-size:12px;color:#CCCCCC">(以续投时最新的盈计划为准)</b></span></div>
//                 <div class="row"><span class="col-2-05">续投金额：</span><span class="col-9"><strong>${money}元</strong></span></div>
//                 <div class="row"><span class="col-2-05">预期收益</span><span class="col-9">${E}元</span></div>
//                 <div class="row" style="margin-top:20px;line-height:40px"><span class="col-2-05">支付密码：</span><span class="col-9"><input id="paypassword" type="password" disabled="disabled" name="paypassword" maxlength="16" placeholder="请输入6-16位纯数字支付密码" autocomplete="off" /></span></div>
//                 <div class="row"><span class="col-2-05">&nbsp;</span><span class="col-9"><div id="payError" class="invError"></div></span></div>
//
//                 <input id="help-profit-button" type="submit" value="确定" />
//                 <div id="calculator-radio" class="login-radio">
//                     <input name="culator" type="radio" class="radio">
//                     <label id="culator" class="radio">我同意相关 <a href="${ '/invest/agreement/' }">《盈计划服务协议》</a></label>
//                 </div>
//
//                 <div class="text">
//                     <label>温馨提示：</label>
//                     <p>1、 距离盈计划到期日的5天内不能取消续投。</p>
//                     <p>2、盈计划到期后3个工作日内完成续投操作。如果续投的盈计划因可投金额不足导致3个工作日内未完成，则自动终止续投。</p>
//                     <a href="javascript:;">查看更多续投说明>></a>
//                 </div>
//             `;
//
//             return html;
//         },
//         success: function(){
//
//             let
//                 autoRadio = false,
//                 pass = $('#paypassword'),   //支付密码
//                 invError = $('#payError');  //错误提示
//
//             //单选按钮
//             radio(
//                 '#calculator-radio',
//                 function(){
//                     autoRadio = true;
//                     invError.html('')
//                 },
//                 function(){
//                     autoRadio = false;
//                     invError.html('请认真阅读协议书，并勾选')
//                 }
//             );
//             /*其他*/
//             pass.unbind('focus').bind('focus',function(){ invError.html('') });
//
//             $(document).off('mouseover','#paypassword').on('mouseover','#paypassword',function(){ pass.prop('disabled',false) });
//             setTimeout(function(){ pass.prop('disabled',false) },2000);
//
//             /*提交*/
//             $('#help-profit-button').off('click').on('click', function () {
//
//                 let
//                     that = $(this),
//                     input_meny,
//                     $pass = $('#paypassword'),
//                     prants = $('#invest-myfrom');
//
//                 if(autoRadio && $pass.val().length > 0){
//
//                     $('#Total-investment').each(function(){ input_meny = $(this).val() });
//                     $.ajax({
//                         type:'GET',
//                         url:'',
//                         dataType:'json',
//                         async:'false',
//                         success:function(data) {
//                             if(data.other >= Number(input_meny)){
//
//                                 if( autoRadio ) invError.html('请认真阅读协议书，并勾选');
//                                 if( pass.val() == '' ) invError.html('请输入支付密码！');
//
//                                 if( pass.val() != '' &&  autoRadio) {
//                                     that.buttonColorOff(invError,'提交中,请稍后...');
//                                     prants.submit();
//                                 }else{
//                                     that.buttonColorOn();
//                                 }
//
//                             }else{
//                                 invError.html('您当前的投资金额大于可投金额，请重新操作');
//                                 that.buttonColorOn();
//                             }
//
//                         },
//                         error:function(){
//                             invError.html('对不起，提交失败，请稍候重试');
//                             that.buttonColorOn();
//                         }
//                     });
//                     that.buttonColorOff(invError,'提交中,请稍后...');
//
//                 }else{
//                     if(!autoRadio) invError.html('请认真阅读协议书，并勾选');
//                     if($pass.val().length <= 0) invError.html('请输入支付密码!');
//                 }
//
//
//
//                 return false;
//             });
//
//         }
//     });
// });
