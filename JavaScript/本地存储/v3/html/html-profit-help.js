/**
 * Created by Dreamslink on 2017/3/14.
 * 我的盈计划
 */

let PageAjaxs = require('../page/page/PageAjaxs');

{
    /*我的盈计划*/
    if($('#help-profit-call-0')[0]){

        PageAjaxs({
            page_id : $('#profit-help-call-page'),
            html_id : $('#profit-help-call'),
            type : 'POST',
            url : '/plan/json',
            data : `action=myplans`,
            code : '00000',
            contents : function(data){

                $("#total_join_money").html(data.data.total_join_money+'元');//总加入金额
                $("#total_setl_revenue").html(data.data.total_setl_revenue+'元');//总收益

                let html = `<ul class="profit-help-list">`;

                if(data.data.list.length === 0) { $('#profit-help-call-page').remove(); return '<div class="disableds">您还没有加入盈计划，马上加入赚收益吧！<a href="/plan/index">加入盈计划</a></div>'; }

                for(let i=0; i < data.data.list.length; i++) {

                    let newbie = parseFloat(data.data.list[i].is_novice) === 0 ? '' : 'newbie';

                    html += `
                    <li>
                        <span class="first"><a href="javascript:;">${data.data.list[i].plan_name}</a><strong>${data.data.list[i].mtd_cde_desc}</strong></span>
                        <span>${data.data.list[i].join_money} <b>元</b><strong>加入金额</strong></span>
                        <span style="width:18%">${data.data.list[i].amount} <b>元</b><strong>应收本息</strong></span>
                        <span style="width:18%">${data.data.list[i].wait_amount} <b>元</b><strong>待收本息</strong></span>
                        <span style="width:12%"><a href="/plan/orders/${data.data.list[i].id}">加入记录</a></span>
                        <span style="width:12%;border-left: 1px solid #E8E8E8;"><a href="/plan/back/${data.data.list[i].id}">回款计划</a></span>
                        <label class="type ${newbie}">&nbsp;</label>
                    </li>
                `;
                }

                html += '</ul>';

                return html;
            }
        });

    }
}


{
    //加入记录
    function pages(ops){
        PageAjaxs({
            page_id : ops.page_id,
            html_id : ops.html_id,
            type : 'POST',
            url : '/plan/json',
            data : ops.data,
            code : '00000',
            contents : function(data){

                let html = `
                        <div class="row blue">
                            <span class="col-1-05 mar-05">加入日期</span>
                            <span class="col-1-05">加入金额</span>
                            <span class="col-1-05">年利率</span>
                            <span class="col-1-05">到期日</span>
                            <span class="col-1-05">状态</span>
                            <span class="col-1-05">操作</span>
                            <span class="col-1-05">&nbsp;</span>
                        </div>
                `;

                if(parseFloat(data.data.total_count) === 0) { $('#profit-help-call-page').remove(); return '<div class="disableds">您还没有加入盈计划，马上加入赚收益吧！<a href="/plan/index">加入盈计划</a></div>'; }

                for(let i=0; i < data.data.list.length; i++) {

                    let
                        repay_status = data.data.list[i].repay_status === 1 ? '未结清' : '已结清',
                        keepon;

                    switch(parseFloat(data.data.list[i].is_keepon)){
                        case 0:  //显示续投
                            keepon = `<a class="xt" href="javascript:;"
                                        data-plan_id="${data.data.list[i].plan_id}" 
                                        data-log_id="${data.data.list[i].id}" 
                                        data-name="${data.data.list[i].plan_name}"
                                        data-time="${data.data.list[i].create_time}"
                                    >续投</a>`;
                            break;
                        case 1:  //取消续投
                            keepon = `<a class="disr" 
                                        data-plan_id="${data.data.list[i].plan_id}" 
                                        data-log_id="${data.data.list[i].id}" 
                                        data-name="${data.data.list[i].plan_name}"
                                        data-time="${data.data.list[i].create_time}"
                                        href="javascript:;">取消续投</a>`;
                            break;
                        case 10: //不能续投
                            keepon = '-';
                            break;
                        case 11: //不能取消续投
                            keepon = '<b>取消续投</b>';
                            break;
                        default:
                            break;
                    }

                    html += `
                        <div class="row">
                            <span class="col-1-05 mar-05">${data.data.list[i].create_time}</span>
                            <span class="col-1-05">${data.data.list[i].invest_amount}元</span>
                            <span class="col-1-05">${data.data.list[i].apr}%</span>
                            <span class="col-1-05">${data.data.list[i].end_date}</span>
                            <span class="col-1-05">${repay_status}</span>
                            <span class="col-1-05">${keepon}</span>
                            <span class="col-1-05"><a href="/plan/agreement/${data.data.list[i].plan_id}/${data.data.list[i].id}">《盈计划协议》</a></span>
                        </div>
                    `;
                }

                html += '</ul>';

                return html;
            }
        });
    }


    if($('#help-profit-call-1')[0]){
        let _planId = $("#_planId").val();
        pages({page_id:$('#profit-help-record-page-1'),html_id:$('#profit-help-record-1'),data:'action=mine&plan_id='+_planId+'&repay_status='});
        pages({page_id:$('#profit-help-record-page-2'),html_id:$('#profit-help-record-2'),data:'action=mine&plan_id='+_planId+'&repay_status=1'});
        pages({page_id:$('#profit-help-record-page-3'),html_id:$('#profit-help-record-3'),data:'action=mine&plan_id='+_planId+'&repay_status=2'});
    }

}


{
    //回款计划：日历
    if($('#help-profit-call-2')[0]){

        $(function () {

            var myDate = new Date();
            var month = myDate.getMonth()+1;
            var P= ( month-1 ) < 1 ? 12 : month- 1;
            var N= ( month+1 ) > 12 ? 1 : month+ 1;

            $('#calendar').fullCalendar({
                // 基本选项与回调函数
                //weekends: true // 不填写时默认为 true , 当为 false 时将隐藏周六和周日
                customButtons: {
                    myPrev: {
                        text: P+'月'
                    },
                    myNext: {
                        text: N+'月'
                    }
                },
                header: {
                    left: 'prev,myPrev',
                    center: 'title',
                    right: 'myNext,next'
                },
                isRTL: false,
                firstDay: 0,
                monthNames: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
                buttonText:{
                    month:''
                },
                allDaySlot:false,
                selectable: true,
                selectHelper: true,
                aspectRatio:2.4,
                editable: false,
                allDayDefault:false,
                titleFormat:{
                    month:'YYYY年MMMM'
                },
                viewRender:function( view, element ){
                    $.ajax({
                        type: 'POST',
                        url: '/plan/json',
                        data:'action=month_repay&plan_id='+$("#_planId").val()+'&year='+view.title.substr(0,4)+'&month='+view.title.split('年')[1].split('月')[0],
                        dataType: 'json',
                        async: 'false',
                        success:function(data){
                            var text;

                            $('.fc-content-skeleton .fc-day-number').each(function () { $(this).addClass('unDataClick'); });

                            for(var i=0; i<data.data.list.length; i++) {

                                //回款
                                var td = $('.fc-day[data-date="'+data.data.list[i].date+'"]');
                                if(data.data.list[i].account == '0.00' || data.data.list[i].account == 0.00){
                                    text = `<div class="recev back"><dd>已回款:${data.data.list[i].account_over}元</dd>`;
                                }else{
                                    text = `<div class="recev"><dd>已回款：${data.data.list[i].account_over}元<br/><strong>待回款:${data.data.list[i].account}元</strong></dd>`;
                                }
                                td.empty().html(`${text}</div>`);

                                //添加点击事件
                                $('.fc-content-skeleton .fc-day-number[data-date="'+data.data.list[i].date+'"]').removeClass('unDataClick').addClass('DataClick').data('i',i);

                            }

                            $(document).off('click', '.unDataClick').on('click', '.unDataClick', function () {
                                var
                                    that = $(this),
                                    date = that.data('date').split('-');

                                $('.cularlist').html('<div class="dis">所选日期没有回款哦~ <label>（投资后，回款计划显示可能存在延迟）</label></div>');
                                $('.particular h3').html(date[0]+'年'+date[1]+'月'+date[2]+'日'+'回款计划');
                            });

                            $(document).off('click', '.DataClick').on('click', '.DataClick', function () {
                                var
                                    that = $(this),
                                    date = that.data('date').split('-'),
                                    i = that.data('i'),
                                    html = `
                                        <div class="row borTop">
                                            <span class="col-1-05">回款项目</span>
                                            <span class="col-1-05">项目总额</span>
                                            <span class="col-1-05">应收总额</span>
                                            <span class="col-1-05">期数</span>
                                            <span class="col-1-05">本期应收</span>
                                            <span class="col-1-05">本期已收</span>
                                            <span class="col-1-05">本期待收</span>
                                            <span class="col-1-05">操作</span>
                                        </div>
                                    `;

                                //抓取数据
                                if(data.data.list[i].list.length != 0) {
                                    for(var l=0; l < data.data.list[i].list.length; l++) {
                                        var lists = data.data.list[i].list[l];
                                        html += `
                                            <div class="row">
                                                <span class="col-1-05"><a href="javascript:;">${lists.borrow_id}</a></span>
                                                <span class="col-1-05">${lists.money}</span>
                                                <span class="col-1-05">${lists.ps_inter_money}</span>
                                                <span class="col-1-05">${lists.nper}</span>
                                                <span class="col-1-05">${lists.pstotalamt}</span>
                                                <span class="col-1-05">${lists.totalamount}</span>
                                                <span class="col-1-05">${lists.watotalamt}</span>
                                                <span class="col-1-05"><a class="details" data-borrow_id="${lists.borrow_id}" data-credit_id="${lists.credit_id}" href="javascript:;">还款明细</a></span>
                                            </div>
                                        `;
                                    }
                                }else html = '<div class="dis">所选日期没有回款哦~ <label>（投资后，回款计划显示可能存在延迟）</label></div>';


                                $('.particular h3').html(date[0]+'年'+date[1]+'月'+date[2]+'日'+'回款计划');
                                $('.cularlist').html(html);

                            });

                            //返回今天
                            $('.fc-right-click').remove();
                            $('.fc-toolbar').append(`<div class="fc-right-click" style="position: absolute;top:19px;right:3%;color:#38c0ff;cursor:pointer;">返回今天</div>`);

                            $(document).off('click', '.fc-right-click').on('click', '.fc-right-click', function () {
                                $('#calendar').fullCalendar('today');fcClick.net();
                                $('.particular h3').html('回款计划');
                                $('.cularlist').html('<div class="dis">所选日期没有回款哦~ <label>（投资后，回款计划显示可能存在延迟）</label></div>');
                            });

                        }
                    });
                }

            });

            //核心
            function fcClick(){}
            fcClick.prototype.net = function(){
                var month = Number(($('.fc-center h2').html()).replace(/[^0-9]/ig, "").substr(4,2)),
                    P= ( month-1 ) < 1 ? 12 : month-1,
                    N= ( month+1 ) > 12 ? 1 : month+1;
                $('.fc-myPrev-button').html(P+'月');
                $('.fc-myNext-button').html(N+'月');
            };
            fcClick.prototype.cick = function(id){
                $(id).on('click',function() {
                    fcClick.net();
                });
            };

            var fcClick = new fcClick();
            fcClick.cick('.fc-next-button');
            fcClick.cick('.fc-prev-button');

                   $('.fc-center').on('click',function () { $('#calendar').fullCalendar('today');fcClick.net(); });
            $('.fc-myPrev-button').on('click',function () { $('#calendar').fullCalendar('prev');fcClick.net();  });
            $('.fc-myNext-button').on('click',function () { $('#calendar').fullCalendar('next');fcClick.net();  });

        });

    }
}