/**
 * Created by Dreamslink on 2017/3/8.
 * 盈计划投资
 */

require('./page/user/buttonColor');
let
    radio = require('./page/radio/radio'), //单选框
    CPM = require('./page/alert/init');


/**
 * 变量*/

let

    Input = $('#input_money'),          //购买金额输入框
    Totally = $('.totally'),            //全投按钮
    Error = $('#but-txt'),              //错误提示
    Radio = $('#profit-radio').data('radio') || true,   //自动续投按钮,默认为勾选状态
    coopXJajax,  //现金券/加息劵 AJAX 处理函数，PS：变量用作输入框输入金额时中断上一请求
    nTime,
    Ajaxs = {};

//抓取初始化基础数据
function Initialize(obj){

    let data = JSON.parse($('#_Detail').val());

    if(data.data.detail.length === 0) { $('body').hide(); location.href = '/404'; return; }  //如果 detail 为空 ，则页面 404

    Ajaxs.data = data.data; //全部克隆

    Ajaxs.else = {
                     id: parseFloat(data.data.detail.id),                 //盈计划ID
              is_novice: parseFloat(data.data.detail.is_novice),          //是否是新手
              is_keepon: parseFloat(data.data.detail.is_keepon),          //是否可续投
                  limit: parseFloat(data.data.detail.limit),              //期数
                    apr: parseFloat(data.data.detail.apr),                //年化利率
                 inrate: data.data.detail.inrate === '' ? 0 : parseFloat(data.data.detail.inrate),    //加息利率
                  other: parseFloat(data.data.detail.other),              //剩余可投
                is_over: parseFloat(data.data.detail.is_over),            //是否已投完 0:未投完 1 已投完
             min_amount: parseFloat(data.data.detail.min_amount),         //最低投资额
        max_amount_each: parseFloat(data.data.detail.max_amount_each),    //单笔最大投资限额
         max_amount_day: parseFloat(data.data.detail.max_amount_day),     //每天最大投资限额
            each_income: parseFloat(data.data.detail.each_income),        //每百元收益
            part_amount: parseFloat(data.data.detail.part_amount),        //基础投资倍率额
           invest_mutex: parseFloat(data.data.detail.invest_mutex),       //是否为互斥标 0:非 1:是

                account: parseFloat(data.data.user.account) === 0 ? 0 : parseFloat(data.data.user.account.replace(/,/g,'')), //用户账户余额
               isnewbie: parseFloat(data.data.user.isnewbie),                          //是否新手：0 非新手 / 1 新手
                user_id: parseFloat(data.data.user.user_id),                           //用户ID :等于0是未登录
           is_setpaypwd: data.data.user.is_setpaypwd,                                  //是否设置支付密码：N 未设置 Y已设置

        money: 0,        //输入金额
        cash: 0,         //现金劵
        useful: 0,       //加息劵
        cash_amt: 0,     //现金券可释放总金额  PS:只在 ajax 中取值，现金券按钮 中判断使用
        useful_amt: 0    //加息劵可释放总金额  PS:只在 ajax 中取值，现金券按钮 中判断使用
    };

    obj();

}

/**
 * 投资事件处理*/

{
    let that;

    function ProfitAajx(defaults,options){

        if(typeof defaults === 'object'){
            options = defaults;
            defaults = undefined;
        }

        that = this;
        that.options = options = options || {};
        that.init();
    }

    ProfitAajx.prototype = {

        init : function(){

            that.dropDown();
            that.XJajax(0);
            that.scattered();
            that.Submits();

        },

        /**
         * 投资逻辑处理*/
        // 输入基本规则
        getInput : function(value){
            let reNum =  /^[0-9]+$/;
            if ( value == '' ) return 0;
            if ( value.length > 9 ) return value.substr(0, 9);
            if ( !reNum.test(value) ) {
                return 0;
            } else if ( value.length >= 2 ) {
                if ( value.slice(0, 1) == 0 ) return value.substr(1); else return value;
            } else {
                return value;
            }
        },

        // 项目总额 = 输入购买金额 + 现金券
        Sum : function(M,X){ return Number(M) + Number(X) },

        // 预期收益 : 项目总额 , 加息劵 , 是否只判断加息部分收益
        E : function(M,J,obj){
            let ops = that.options;
            //预期收益: 加息劵为 0 时不计算加息部分收益，反则计算
            let E;
            if( J != 0 ){
                //预期收益 = [ (每百元收益 / 年利率) * (加息劵 + 年利率) ] *（项目总额 / 100)
                E = [ (ops.each_income / ops.apr) * (J + ops.apr) ] * (M / 100);
            } else {
                //预期收益 = 每百元收益 *（项目总额 / 100)
                E = ops.each_income * (M / 100);
            }

            //只计算加息部分收益：[ (每百元收益 / 年利率) * 加息劵 ] *（项目总额 / 100)
            if(obj) E = [ (ops.each_income / ops.apr) * J ] * (M / 100);

            return E;
        },

        // 错误信息提示: 项目总额 , 输入购买金额 , 加息劵
        Errors : function(M,V,J){
            let ops = that.options;

            M = parseFloat(M);
            V = parseFloat(V);
            J = parseFloat(J);

            Error.data('submit',false);

            //是否新手标
            if( ops.is_novice === 1 ) return '您已经不是新手用户，不能投新手标';
            //0值
            if( V === 0 ) return `请输入购买金额,购买金额需为${ops.part_amount}的整数倍`;
            //加入金额是否是 规定金额 的整数倍
            if( M / ops.part_amount != parseInt(M/ops.part_amount) ) return `购买金额需为${ops.part_amount}的整数倍，请重新输入`;
            //是否设置支付密码
            if( ops.is_setpaypwd === 'N' ) return '您未设置支付密码，请<a href="/index.php?user&q=user/paypwd/setting" target="_blank">设置支付密码</a>后继续投资';
            //是否大于剩余可投金额
            if( M > ops.other ) return '本次加入金额大于剩余金额，请重新输入';
            //最高投资额度: 单笔最大投资限额
            if( M > ops.max_amount_each ) return `本次加入金额不能高于${ops.max_amount_each}元，请重新输入`;
            //最低投资额
            if( M < ops.min_amount ) return `本次加入金额不能低于${ops.min_amount}元，请重新输入`;
            //盈计划投资: 剩余金额 - 项目总额 < 盈计划最小投资限额 && 剩余金额 - 项目总额 != 0
            if( ops.other - M < ops.min_amount && ops.other - M !== 0 ) return `本次投资之后剩余金额不足${ops.min_amount}元，请重新输入`;

            //余额不足
            if( V > ops.account ) return '您的余额不足，请先充值';

            let E = that.E(M,J);

            //成功
            Error.data('submit',true);
            return `<b style="color:#38c0ff;">您的加入金额为：${M.toFixed(2)}元，预期收益：${E.toFixed(2)} 元</b>`;

        },

        // 现金/加息 劵默认是否选中条件判断:
        getCheckStatus : function(is_use,amt,Money,Color,nominal){
            /*
             is_use: 接口默认劵选中(是1/否0)
                amt: 劵可使用最低限额
              Money: 输入金额
              Color: 返回样式/返回 input属性 (true 返回样式 / false 返回input属性)
            nominal: 现金券金额(存在则调用现金券专属，反则调用加息劵专属)

                 PS: 默认最多勾选一个
             * */
            let ops = that.options;

            is_use = parseFloat(is_use);
            amt = parseFloat(amt);
            Money = parseFloat(Money);
            nominal = parseFloat(nominal);


            if( Money < amt ) { if(Color) return 'color:#ccc'; else return 'disabled="disabled'; }
            // //隐藏内容为过滤所有不是指定投资倍率的所有现金券
            // if(nominal){
            //     //现金券专属
            //     let part_amount = (nominal+Money) / ops.part_amount === parseInt((nominal+Money) / ops.part_amount); //购买总金额是否是指定投资倍率的倍数
            //     if( !part_amount ) {  if(Color) return 'color:#ccc'; else return 'disabled=disabled'; }
            //     if( Money >= amt && part_amount && amt != 0 && is_use === 1 ) {  if(Color) return 'color:#000'; else return 'checked="checked"'; }
            // }else{
            //     //加息劵专属
            //     if( Money >= amt && amt != 0 && is_use === 1 ) { if(Color) return 'color:#000'; else return 'checked="checked"'; }
            // }
            if( Money >= amt && is_use === 1 ) { if(Color) return 'color:#000'; else return 'checked="checked"'; }

        },

        /**
         * 普通事件处理*/
        // 现金券/加息劵 AJAX 处理
        XJajax : function(M){

            let ops = that.options;
            Error.data('submit',false);

            coopXJajax = $.ajax({
                type: 'GET',
                url: `/invest/borrower/cashcoupon/0/${ops.money}/${ops.id}/${ops.apr}/${ops.limit}/0`,
                dataType: 'json',
                async: 'false',
                success:function(data){

                    let
                        _money = M,   //输入金额
                          Xlen = data.use.length, //现金券数量
                         _cash = 0, //临时现金券存储
                     _cash_amt = 0, //临时现金券可释放总金额存储
                      text_X_1 = '',
                      text_X_2 = '';

                    /**现金劵*/
                    if(Xlen === 0){
                        //现金券为空时
                        ops.cash = 0;
                        text_X_1 = '<b class="but-off-txt">暂无可用现金劵</b>';
                        text_X_2 = '无可用';
                    } else {
                        //现金券不为空
                        for(let i = 0; i < Xlen; i++) {
                            text_X_1 += `
                                    <div class="row mar-on" style="${that.getCheckStatus(data.use[i].is_use,data.use[i].every_tender_amt,_money,true,data.use[i].nominal)}">
                                        <div class="col-3">
                                            <div class="calc-input-check">
                                                <input 
                                                    type="checkbox" 
                                                    name="myCoupon[]" 
                                                    style="position: relative;z-index: -1"
                                                    ${that.getCheckStatus(data.use[i].is_use,data.use[i].every_tender_amt,_money,false,data.use[i].nominal)}
                                                    nominal="${data.use[i].nominal}"
                                                    coding="${data.use[i].coding}"
                                                    is_aut="${data.use[i].every_tender_amt}"
                                                    is_use="${data.use[i].is_use}"
                                                    value="${data.use[i].id}"
                                                >
                                                ${data.use[i].nominal} 元
                                            </div>
                                        </div>
                                        <div class="col-5">${data.use[i].ruleset_memo}</div>
                                        <div class="col-4">有效期至 ${data.use[i].validity}</div>
                                    </div>
                                `;

                            if( that.getCheckStatus(data.use[i].is_use,data.use[i].every_tender_amt,_money,false,data.use[i].nominal) === 'checked="checked"' ) { _cash += parseFloat(data.use[i].nominal); _cash_amt +=parseFloat(data.use[i].every_tender_amt) }

                        }

                        if( _cash === 0 ) text_X_2 = '无可用'; else text_X_2 = ` <strong id="ops_cash">${_cash}</strong> 元`;
                    }
                    $('#calc-xj .but-off-text').html(text_X_1);
                    $('#calc-xj span b').html(text_X_2);



                    /**
                     * 加息劵*/
                    let
                            Jlen = data.iic_use.length, //加息劵数量
                         _useful = 0,  //加息劵额度临时存储
                     _useful_amt = 0,  //加息劵可释放总金额临时存储
                        text_J_1 = '',
                        text_J_2 = '';

                    if(Jlen === 0){
                        //加息劵为空时
                        ops.cash = 0;
                        text_X_1 = '<b class="but-off-txt">暂无可用加息劵</b>';
                        text_X_2 = '无可用';
                    } else {
                        //加息劵不为空
                        for (let i = 0; i < Jlen; i++) {

                            text_J_1 +=`
                                    <div class="row mar-on" style="${that.getCheckStatus(data.iic_use[i].is_use,data.iic_use[i].every_tender_amt,_money,true)}">
                                        <div class="col-2"> 
                                            <div class="calc-input-check"> 
                                                <input 
                                                type="radio" 
                                                class="c-box" 
                                                name="interest[]" 
                                                ${that.getCheckStatus(data.iic_use[i].is_use,data.iic_use[i].every_tender_amt,_money,false)}
                                                nominal="${data.iic_use[i].increaseInterest}"
                                                     id="${data.iic_use[i].coding}"
                                                 is_aut="${data.iic_use[i].every_tender_amt}" 
                                                 is_use="${data.iic_use[i].is_use}" 
                                                  value="${data.iic_use[i].id}"
                                                >&nbsp; 
                                                ${data.iic_use[i].increaseInterest} %
                                            </div> 
                                        </div> 
                                        <div class="col-6">${data.iic_use[i].rulesetMemo}</div> 
                                        <div class="col-4">有效期至 ${data.iic_use[i].validity}</div> 
                                    </div>
                                `;

                            if( that.getCheckStatus(data.iic_use[i].is_use,data.iic_use[i].every_tender_amt,_money,false) === 'checked="checked"' ) { _useful += parseFloat(data.iic_use[i].increaseInterest); _useful_amt += parseFloat(data.iic_use[i].every_tender_amt) }

                        }

                        if( _useful === 0 ) text_J_2 = '无可用'; else text_J_2 = ` <strong id="ops_useful">${_useful}</strong> %`;

                        $('#calc-jx .but-off-text').html(text_J_1);
                        $('#calc-jx span b').html(text_J_2);
                    }

                    ops.cash = _cash;               //现金券
                    ops.useful = _useful;           //加息劵
                    ops.cash_amt = _cash_amt;       //现金券投资可释放总金额
                    ops.useful_amt = _useful_amt;   //加息劵投资可释放总金额

                    Error.html(that.Errors(that.Sum(ops.money,ops.cash),ops.money,ops.useful));//错误信息

                },
                error:function(){  }
            });

        },

        // 零散集中主要投资处理
        scattered : function(){

            let ops = that.options;

            //现金券按钮
            $(document).off('click', '#calc-xj .row').on('click', '#calc-xj .row', function () {

                let
                     checkbox = $(this).find('input'),
                        _cash = parseFloat(checkbox.attr('nominal')), //现金券额度获取
                    _cash_amt = parseFloat(checkbox.attr('is_aut'));  //现金券投资可释放总金额获取

                //为互斥标时,现金券与加息劵不能同时使用
                if(ops.invest_mutex === 1) { if(ops.useful > 0) { alert('您已使用过加息劵,无法同时使用现金劵'); return } }

                if(checkbox.is(':checked')) {
                    //已选中时
                    checkbox.prop('checked',false);
                    ops.cash -= _cash;
                    ops.cash_amt -= _cash_amt;
                    //点击样式添加
                    $(this).removeAttr('style')
                }else{
                    //未选中时
                    if(!checkbox.prop('disabled')) {

                        ops.cash_amt += _cash_amt;

                        if(ops.cash_amt <= ops.money){
                            //可释放总额如果小于输入金额

                            checkbox.prop('checked',true);
                            ops.cash += _cash;
                            //点击样式添加
                            $(this).attr('style','color:#000');

                        }else {
                            alert('当前投标金额无法释放更多现金券！');
                            ops.cash_amt -= _cash_amt;
                        }
                    }
                }

                if(ops.cash <= 0) ops.cash = 0;

                if(!checkbox.prop('disabled')) $('#calc-xj span b').html(' <strong>'+ops.cash+'</strong> 元');
                Error.html(that.Errors(that.Sum(ops.money,ops.cash),ops.money,ops.useful));//错误信息

            });
            //加息劵按钮
            $(document).off('click', '#calc-jx .row').on('click', '#calc-jx .row', function () {

                let
                       checkbox = $(this).find('input'),
                            did = $('#calc-jx input:disabled'),
                            rid = $('#calc-jx input'),
                       _nominal = parseFloat(checkbox.attr('nominal')),//加息劵额度获取
                    _useful_amt = parseFloat(checkbox.attr('is_aut')); //加息劵投资可释放总金额获取

                //为互斥标时,现金券与加息劵不能同时使用
                if(ops.invest_mutex === 1) { if(ops.cash > 0) { alert('您已使用过现金券,无法同时使用加息劵'); return } }

                if(checkbox.is(':checked')) {
                    //已选中时
                    checkbox.prop('checked',false);
                    ops.useful -= _nominal;
                    ops.useful_amt -= _useful_amt;
                    //点击样式添加
                    rid.parents('.row').removeAttr('style');
                    did.parents('.row').attr('style','color:#ccc');
                }else{
                    //未选中时
                    if(!checkbox.prop('disabled')) {

                        ops.useful_amt += _useful_amt;

                        if(ops.useful_amt <= ops.money) {
                            //可释放总额如果小于输入金额

                            checkbox.prop('checked',true);
                            ops.useful = _nominal;
                            //点击样式添加
                            rid.parents('.row').removeAttr('style');
                            did.parents('.row').attr('style','color:#ccc');
                            $(this).attr('style','color:#000');

                        }else {
                            alert('当前投标金额无法释放更多加息劵！');
                            ops.useful_amt -= _useful_amt;
                        }

                    }
                }

                if(ops.useful <= 0) ops.useful = 0;

                if(!checkbox.prop('disabled')) $('#calc-jx span b').html(' <strong>'+ops.useful+'</strong> %');
                Error.html(that.Errors(that.Sum(ops.money,ops.cash),ops.money,ops.useful));//错误信息

            });
            //全投
            $(document).off('click', '.totally').on('click', '.totally', function () {
                let M;
                // 全投金额 = 账户余额 > 标剩余金额 ？ 标剩余金额 ： 账户余额
                M = ops.account > ops.other ? ops.other : ops.account;
                // 单笔最大过滤
                M = M > ops.max_amount_each ? ops.max_amount_each : M;
                // 单日最大过滤
                M = M > ops.max_amount_day ? ops.max_amount_day : M;

                ops.money = M;
                Input.css('color','#000').val(M);
                Error.html(that.Errors(that.Sum(M,ops.cash),M,ops.useful));//错误信息
                coopXJajax.abort();
                setTimeout(function () { that.XJajax(ops.money) },500);
            });
            //输入框操作
            Input.on('keyup',function(){
                let _this = $(this);

                ops.money = that.getInput(_this.val());//数据金额
                _this.css('color','#000').val(ops.money);
                Error.html(that.Errors(that.Sum(ops.money,ops.cash),ops.money,ops.useful));//错误信息
                clearTimeout(nTime);
                coopXJajax.abort();Error.data('submit',false);
                nTime = setTimeout(function () { that.XJajax(ops.money) },500);

                if( _this.val() === '0' ) _this.removeAttr('style');
            });
            //单选按钮
            radio(
                '#profit-radio',
                function(){ $('#profit-radio').data('radio',true) }, //勾选
                function(){ $('#profit-radio').data('radio',false) } //取消
            );
        },

        // 现金券/加息劵 下拉菜单
        dropDown : function() {

            var ol = $('.calc-but-txt li .but-off-text'),
                span = ol.siblings('span'),
                len = 0;

            ol.each(function (index,value) {
                $(value).addClass('cos-'+index).siblings('span').addClass('dropDown-cos-' + index);
                return len += $(value).length;
            });

            if( !!window.chrome) {
                ol.each(function (index,value) {
                    $(value).addClass('chormeFont');
                });
            }
            span.off('click').on('click', function () {
                var that = $(this),
                    cos = that.attr('class').replace(/[^0-9]/ig,''),
                    li = that.parents('li');

                if(li.hasClass('show')){
                    li.removeClass('show');that.siblings('div.but-off-text').stop(false,true).slideUp();
                }else{
                    for(var i = 0; i < len; i++) {
                        if(cos == i) {
                            li.addClass('show');
                            that.siblings('div.but-off-text').stop(false, true).slideDown();
                            $('body').append('<div class="but-off-text-back" style="position:fixed;width:100%;height:100%;top:0;left:0;z-index:7"></div>');
                        }else {
                            $('.dropDown-cos-' + i).siblings('div.but-off-text').stop(false, true).slideUp().parents('li').removeClass('show');
                        }
                    }
                    $('.but-off-text-back').off('click').on('click',function(){
                        li.removeClass('show');that.siblings('div.but-off-text').stop(false,true).slideUp();
                        $(this).remove();
                    })
                }

            });
        },

        // 选中 现金券/加息劵 抓取
        inputText :{
            xj : function(o){
                var _class = o.attr('class');
                var name = o.attr('name');
                var nominal = o.attr('nominal');
                var id = o.attr('id');
                var is_aut = o.attr('is_aut');
                var is_use = o.attr('is_use');
                var value = o.attr('value');
                var html = '<input type="checkbox" checked="checked" class="'+ _class +'" name="'+ name +'" nominal="'+ nominal +'" id="'+ id +'" is_aut="'+ is_aut +'" is_use="'+ is_use +'" value="'+ value +'">\n';
                return html;
            },
            jx : function(o){
                var _class = o.attr('class');
                var name = o.attr('name');
                var nominal = o.attr('nominal');
                var id = o.attr('id');
                var is_aut = o.attr('is_aut');
                var is_use = o.attr('is_use');
                var value = o.attr('value');
                var html = '<input type="checkbox" checked="checked" class="'+ _class +'" name="'+ name +'" nominal="'+ nominal +'" id="'+ id +'" is_aut="'+ is_aut +'" is_use="'+ is_use +'" value="'+ value +'">\n';
                return html;
            }
        },

        //提交操作
        Submits : function(){
            let ops = that.options;

            let sub = $('#profit-nth');
            $(document).off('click', '#profit-nth').on('click', '#profit-nth', function () {
                if(Error.data('submit')) {

                    sub.buttonColorOff(Error,'提交中,请稍后...');

                    let
                        Array_xj = '',
                        Array_jx = '';
                    $('#calc-xj .but-off-text input:checked').each(function(){Array_xj += that.inputText.xj($(this));});
                    $('#calc-jx .but-off-text input:checked').each(function(){Array_jx += that.inputText.jx($(this));});


                    //到期处理：
                    let radios = $('#profit-radio').data('radio') === undefined ? false : $('#profit-radio').data('radio');
                    let radioss = radios ? 1 : 0; // 1 勾选 / 0 未勾选
                    let radiosT = radios ? '到期自动续投<b style="color:#CCCCCC;font-size:12px">(续投收益以续投时最新的盈计划为准)</b>' : '到期自动回款';

                    CPM({
                        title:'确认支付',
                        ID: $('#invest-myfrom'),
                        width: 590 ,
                        height: 405 ,
                        action: '/plan/payres',
                        culling: function(){
                            var html = `
                        <!--项目总额--><input id="Total-investment" name="Total-investment" type="hidden" value="${ Number(that.Sum(ops.money,ops.cash)).toFixed(2) }"/>
                        <!--加入金额--><input id="myInvestment" name="myInvestment" type="hidden" value="${ Number(ops.money).toFixed(2) }"/>
                        <!--现金劵--><div id="myCoupon" style="display: none;">${ Array_xj }</div>
                        <!--加息劵--><div id="myPlusCoupons" style="display: none;">${ Array_jx }</div>
                        <!--是否续投--><input id="radios" name="radios" type="hidden" value="${radioss}" />
                        <!--盈计划ID--><input id="profit_id" name="profit_id" type="hidden" value="${ops.id}" />
                        <!--数值--><input id="prospective" name="prospective" type="hidden" value="
                                        ${ Number(that.E(that.Sum(ops.money,ops.cash),ops.useful)).toFixed(2) },
                                        ${ (that.E(that.Sum(ops.money,ops.cash),ops.useful,true)).toFixed(2) },
                                        ${ ops.useful },
                                        ${ ops.cash }
                                    " />
                        <div class="investCalculator">
                            <div class="payment-jg">
                                <div class="gol">项目总额：<strong id="mey-Total">${ Number(that.Sum(ops.money,ops.cash)).toFixed(2) }</strong>元，预期总收益：<strong id="mey-Exp">${ Number(that.E(that.Sum(ops.money,ops.cash),ops.useful)).toFixed(2) }</strong>元，请确认无误后进行支付：</div>
                                <dl class="succeed">
                                    <dd style="width:100%"><label>现金投资：</label><p><em>${ Number(ops.money) }</em>元</p></dd>
                                    <dd><label>使用现金劵：</label><p><em>${ ops.cash }</em>元</p></dd>
                                    <dd><label>加息:</label><p>+<i>${ ops.useful }</i>% ( 预期收益<em>${ (that.E(that.Sum(ops.money,ops.cash),ops.useful,true)).toFixed(2) }</em>元 )</p></dd>
                                    <dd style="width:100%"><label>到期处理：</label><p>${radiosT}</p></dd>

                                </dl>
                            </div>
                           <div class="payment-bom">
                                <div class="payment-text">支付密码：<input id="paypassword" type="password" disabled="disabled" name="paypassword" maxlength="16" placeholder="请输入6-16位纯数字支付密码" autocomplete="off" /></div>
                                <div id="payError" class="invError"></div>
                                <input id="calculator-button" type="submit" value="确定" />
                                <div id="calculator-radio" class="login-radio">
                                    <input name="culator" type="radio" class="radio">
                                    <label id="culator" class="radio">我同意相关 <a href="/plan/agreement/${ops.id}/0">《盈计划服务协议》</a></label>
                                </div>
                                <div style="position: absolute;bottom:2px;right: 52px;color: #888888;">投资有风险</div>
                           </div>
                        </div>
                        `;

                            return html;
                        },
                        success: function(){

                            //提交状态清除
                            sub.buttonColorOn();
                            Error.html('');

                            let
                                autoRadio = false,
                                pass = $('#paypassword'),   //支付密码
                                invError = $('#payError');  //错误提示

                            //单选按钮
                            radio(
                                '#calculator-radio',
                                function(){
                                    autoRadio = true;
                                    invError.html('')
                                },
                                function(){
                                    autoRadio = false;
                                    invError.html('请认真阅读协议书，并勾选')
                                }
                            );
                            /*其他*/
                            pass.unbind('focus').bind('focus',function(){ invError.html('') });

                            $(document).off('mouseover','#paypassword').on('mouseover','#paypassword',function(){ pass.prop('disabled',false) });
                            setTimeout(function(){ pass.prop('disabled',false) },2000);

                            /*提交*/
                            $('#calculator-button').off('click').on('click', function () {

                                let
                                    thats = $(this),
                                    $pass = $('#paypassword'),
                                    prants = $('#invest-myfrom');

                                if(autoRadio && $pass.val().length > 0){

                                    $.ajax({
                                        type:'POST',
                                        url:'/plan/json',
                                        data:'action=detail&plan_id='+ops.id,
                                        dataType:'json',
                                        async:'false',
                                        success:function(data) {
                                            //剩余可投 > 项目总额
                                            if(parseFloat(data.data.detail.other) >= that.Sum(ops.money,ops.cash)){

                                                if( autoRadio ) invError.html('请认真阅读协议书，并勾选');
                                                if( pass.val() == '' ) invError.html('请输入支付密码！');

                                                if( pass.val() != '' &&  autoRadio) {
                                                    thats.buttonColorOff(invError,'提交中,请稍后...');
                                                    prants.submit();
                                                }else{
                                                    thats.buttonColorOn();
                                                }

                                            }else{
                                                invError.html('您当前的加入金额大于可投金额，请重新操作');
                                                thats.buttonColorOn();
                                            }

                                        },
                                        error:function(){
                                            invError.html('对不起，提交失败，请稍候重试');
                                            thats.buttonColorOn();
                                        }
                                    });
                                    thats.buttonColorOff(invError,'提交中,请稍后...');

                                }else{
                                    if(!autoRadio) invError.html('请认真阅读协议书，并勾选');
                                    if($pass.val().length <= 0) invError.html('请输入支付密码!');
                                }



                                return false;
                            });

                        }
                    });

                }

            });

        }

    };


    /**
     * 实例*/
    $(function(){

        Initialize(function(){

            require('./html/html-profit')(Ajaxs);
            new ProfitAajx(Ajaxs.else);
        });

    });
}











