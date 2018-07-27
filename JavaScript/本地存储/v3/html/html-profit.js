/**
 * Created by Dreamslink on 2017/3/13.
 * 盈计划页面嵌套模板
 */


let PageAjaxs = require('../page/page/PageAjaxs');

let that;

function profits(defaults,options){

    if(typeof defaults === 'object') {
        options = defaults;
        defaults = undefined;
    }

    that = this;
    that.options = options = options || {};
    that.init();

}


profits.prototype.init = function () {
    that.html();
    that.project_details();
};

/**
 * 基础数据嵌套*/
profits.prototype.html = function () {
    let ops = that.options,

        queen = $('.queen-login'),
        front = $('.front-login');

    // 未登录与登录状态
    if(ops.else.user_id === 0) {queen.remove();front.removeAttr('style') } else { front.remove();queen.removeAttr('style') }
    // 是否可续投 0 否 1 是
    if(parseFloat(ops.data.detail.is_keepon) === 0) $('.calc-input').remove();
    // 输入框初始化信息
    $('#input_money').attr('placeholder', ops.else.part_amount >= 1 ? '' : `购买金额需为${ops.else.part_amount}的整数倍`);

    //标信息
    let
        inrate = ops.else.inrate != '' ? `<em class="rate-xi">${ops.else.inrate}</em>` : '', //加息利率
        novice = ops.else.is_novice == 0 ? '' : '<label class="newbie"></label>'; //是否新手
    let HTMLprofit_biao = `
        <div class="calc-title">
            ${novice}
            <h3><a href="javascript:">${ops.data.detail.plan_name}</a></h3>
        </div>
        <div class="calc-info">
            <dl>
                <dd class="first">
                    ${ inrate }
                    <label><strong class="invest-first-strong">${ops.else.apr}</strong>%</label>
                    <span>年利率</span>
                </dd>
                <dd class="child">
                    <label><strong>${ops.else.limit}</strong>个月</label>
                    <span>投资期限</span>
                </dd>
                <dd class="moddle">
                    <label><strong>${ops.else.other}</strong>元</label>
                    <span>剩余可购</span>
                </dd>
            </dl>
        </div>
        <div class="profit-txt">
            <span><label>购买上限：</label><strong>${ops.data.detail.max_amount_each}</strong>元</span>
            <span><label>还款方式：</label>${ops.data.detail.mtd_cde_desc}</span>
            <span><label>计息日：</label>${ops.data.detail.value_date} <i class="i" data-title="既投资成功后次日开始计息">&nbsp;</i></span>
        </div>
    `;
    $('#HTMLprofit-biao').html(HTMLprofit_biao);
    //剩余金额
    $('.remaining').html(ops.data.user.account);
    //加息按钮
    $('a.jx').attr({
        'data-count-key':'',                        //标的编号
        'data-count-limit':ops.else.limit+'个月',    //标的借款期限
        'data-count_income':ops.else.each_income,   //标的每百元收益
        'data-count-apr':ops.else.apr,              //标的年化利率
        'data-amount':10000,                        //标的利率变化起始金额
        'data-rates':ops.else.inrate                //标的增加利率
    });

};


/**
 * 盈计划详情页 */
profits.prototype.project_details = function(){
    let ops = that.options;

    /*项目详情*/
    PageAjaxs({
        page_id : $('#profit-details-page'),
        html_id : $('#project-details'),
        type : 'POST',
        url : '/plan/json',
        data : `action=items&plan_id=${ops.else.id}`,
        code : '00000',
        contents : function(data){
            let html = `<h3>该计划当前共包含 <b>${data.data.total_count}</b> 个借款项目，您的资金将会依次投资到以下借款项目中：</h3>`;

            html += `
                <div class="row blue">
                    <span class="col-3">项目编号</span>
                    <span class="col-2">期限</span>
                    <span class="col-2">年利率</span>
                    <span class="col-2">借款总额</span>
                    <span class="col-3">操作</span>
                </div>
            `;

            if(data.data.list.length === 0) { $('#profit-details-page').remove(); return '<div class="label-center">暂无记录</div>'; }

            for(let i=0; i < data.data.list.length; i++) {

                //图表判断
                let attr_labels = data.data.list[i].ATTR_LABELS[0] === 'ge' ? 'ge' : 'qi';

                html += `
                    <div class="row">
                        <span class="col-3"><label class="${attr_labels}">${data.data.list[i].BUS_NUM}</label></span>
                        <span class="col-2">${data.data.list[i].TIME_LIMIT_DESC}</span>
                        <span class="col-2">${parseFloat(data.data.list[i].INT_RATE)}%</span>
                        <span class="col-2">${data.data.list[i].ACCOUNT}元</span>
                        <span class="col-3"><a href="${data.data.list[i].PAGE_PC_URL_DESC}">详情</a></span>
                    </div>
                `;
            }

            return html;
        }
    });


    /*购买记录*/
    PageAjaxs({
        page_id : $('#profit-history-page'),
        html_id : $('#purchase-history'),
        type : 'POST',
        url : '/plan/json',
        data : `action=logs&plan_id=${ops.else.id}`,
        code : '00000',
        contents : function(data){
            let html = `
                <div class="row blue">
                    <span class="col-4">购买人</span>
                    <span class="col-4">购买金额</span>
                    <span class="col-4">购买时间</span>
                </div>
            `;


            if(data.data.list.length === 0) { $('#profit-history-page').remove(); return '<div class="label-center">暂无记录</div>'; }

            for(let i=0; i < data.data.list.length; i++) {
                html += `
                    <div class="row">
                        <span class="col-4">${data.data.list[i].username}</span>
                        <span class="col-4">${parseFloat(data.data.list[i].invest_amount)} 元</span>
                        <span class="col-4">${data.data.list[i].end_date}</span>
                    </div>
                `;
            }

            return html;
        }
    });


};



module.exports = function(defaults,options){
    return new profits(defaults,options);
};
