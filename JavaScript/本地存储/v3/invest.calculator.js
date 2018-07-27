// 投资详情逻辑计算


(function(){

    var radio = require('./page/radio/radio');
    var CPM = require('./page/alert/init');
    var timeCountdown = require('./page/timeCountdown/timeCountdown');
    require('./page/user/buttonColor');

    //变量
    let
           Calc_Input = $('#input_money'), // 舞台
            Calc_text = $('#but-txt'), // 错误提示信息
          Calc_button = $("#calc-nth"), //提交
          timeout,numAjax = 0,coopAjax,

         Calc_balance = Number($("#calc-balance").text()),  //账户余额
          Calc_invest = Number($("#calc-invest").text()),   //剩余可投金额
                  max = Number($("#most_account").val()),   //最大投资额
                  min = Number($("#lowest_account").val()), //最小投资额
            invest_id = Number($("#invest_id").val()),      //标ID
               SetPwd = Number($("#is_setpaypwd").val()),   //密码是否设置
                  xsb = Number($("#is_newbie_invest").val()), //是否新手标
                   xs = Number($("#is_newbie").val()),  //是否新手
                 soxs = $("#newbie_invest_hint").val(), //新手标信息提示
               isFool = $("#isFool").val(), //是否是投资自己的项目
         isPlanBorrow = $('#isPlanBorrow'), //盈计划专享标
              rate_xi = parseInt($('.rate-xi').text()), //自动加息比率
             rate_May = 50;                          //自动加息比率开启起始金额

    let
          input_meny = 0,  //公共总额
         input_value = 0,  //输入金额
           input_val = 0,  //公共金额
             ajax_hr = 0,Array_hr='',   //惠人币
             ajax_xj = 0,Array_xj = '', //现金劵
           ajax_xjoo = 0, //现金劵限额
             ajax_jx = 0,Array_jx = '',soJx=0, //加息劵
            ajax_zjx = 0,
           ajax_jxoo = 0, //加息劵限额
             ajax_hm = 0, //惠米
            ajax_hmm = 0; //惠米

    //加息存在时预期收益计算
    let rate = {
        a : Number($('#each_income').val()),//初始每百元收益
        b : Number($('.jx').attr('data-count-apr')), //初始年利率
        //每 1% 年利率收益
        art : function(an) {
            var that = this;
            //（ 加入金额份数(不包含现金劵等）或投资总金额份数 ）* 每1%年利率百元收益
            return ( Number(an) / 100 ) * (that.a / that.b);
        },
        //基本规则
        init : function(){
            var that = this,cor;
            if(xsb == 1) {//是否新手标
                //如果输入金额大于 rate_May 则添加标的加息预期收益
                if( Number(input_value) >= rate_May ) cor = ( (Number(input_meny) / 100) * that.a ) + that.art(input_meny) * rate_xi; else cor = (Number(input_meny) / 100) * that.a;
            } else{
                if( Number(input_value) >= rate_May ) cor = ( (Number(input_meny) / 100) * that.a ) + that.art(input_value) * Number(ajax_zjx); else cor = (Number(input_meny) / 100) * that.a;
            }
            return cor;
        },
        //使用加息劵时
        ajaxJXs : function(){
            var that = this;
            return that.init() + that.art(input_value) * Number(ajax_jx);
        },
    };
    //核心验算参数
    var IFnum = {
        // 输入基本规则
        test: /^[0-9]+$/,
        getInput: function (value) {
            if (value == '') {
                return 0;
            }
            if( value.length > 9 ){
                return value.substr(0, 9);
            }
            var reNum = this.test;
            if (!reNum.test(value)) {
                return 0;
            } else if (value.length >= 2) {

                if (value.slice(0, 1) == 0) {
                    return value.substr(1);
                } else {
                    return value;
                }

            } else {
                return value;
            }
        },
        //项目总额
        Meny : function(a,b,c,d){
            return Number(a) + Number(b) + Number(c) + Number(d);
        },
        //错误信息提示
        errorText: function(value,Inp,ajax_jx){

            //盈计划专享标
            if( Number(isPlanBorrow.val()) == 1 ) return '盈计划专享标的，不支持单独出借';
            //是否是投资自己的项目
            if( isFool == 1 ) return '对不起，不能购买自己的借款项目，请选择其他项目';
            //是否新手标
            if( xsb == 1 && xs == 0 ) return soxs;
            //空值
            if( value == -1 ) return;
            //0值
            if( value == 0 ) return '请输入加入金额';
            //是否设置支付密码
            if( SetPwd == 0 ) return '您未设置支付密码，请<a href="/index.php?user&q=user/paypwd/setting" target="_blank">设置支付密码</a>后继续投资';
            //最高投资额度
            if( max != 0 ){
                if( max > Calc_invest ) {
                    if (value > Calc_invest) return '本次加入金额大于剩余金额，请重新输入';
                }else{
                    if( value > max ) return '本次加入金额不能高于'+ max.toFixed(2) +'元，请重新输入';
                }
            }else{
                if (value > Calc_invest) return '本次加入金额大于剩余金额，请重新输入';
            }
            //最低投资额度
            if( value < min ) return '本次加入金额不能低于'+ min.toFixed(2) +'元，请重新输入';
            //最小剩余投资额度
            if( Calc_invest - value < min && Calc_invest - value !==0  ) return '本次加入之后剩余金额不足'+ min.toFixed(2) +'元，请重新输入';
            //余额不足
            if( Inp > Calc_balance ) return '您的余额不足，请先充值';

            var a = Number($('#each_income').val()),
                b = Number($('.jx').attr('data-count-apr'));

            //加息劵为 0 时不计算加息部分收益，反则计算；
            if( ajax_jx == 0 ){
                return '<b style="color:#38c0ff;">您的加入金额为：' + Number(value).toFixed(2) + '元，预期收益：'+ (rate.init()).toFixed(2) +' 元</b>';
            }else{
                return '<b style="color:#38c0ff;">您的加入金额为：' + Number(value).toFixed(2) + '元，预期收益：'+ (rate.ajaxJXs()).toFixed(2) +' 元</b>';
            }
        },
        //ajax默认勾选判断
        getCheckStatus: function(i,j,k,l) {
            var a = '';

            if ( Number(j) == 0 && l == 1) a =  ' disabled="disabled"  ';
            if (Number(j) < Number(k) && l==1) a =  ' disabled="disabled"  ';
            if (Number(j) >= Number(k) && Number(parseInt(i)) == 1 && l == 1) a =  ' checked="checked" style="color:#000;"';

            return a;

        },
        //提交验算
        submitInput: function(meny,val,value,min,max,coo){
            if( numAjax == 0 ){

                if( Number(isPlanBorrow.val()) == 1 ) return false;

                if( SetPwd == 0 ) return false;

                if( isFool == 1 ) return false;

                if( xsb == 1 && xs == 0 ) return false;

                if( max != 0 ){
                    if( meny != 0 && val <= value && (Calc_invest - meny > min || Calc_invest - meny == 0) && meny >= min && meny <= max && meny <= coo ) return true;
                }else{
                    if( meny != 0 && val <= value  && (Calc_invest - meny > min || Calc_invest - meny == 0) &&  meny >= min && meny > max && meny <= coo ) return true;
                }

            }
        }
    };

    //ajax预留空间
    var _ajax = {
        //惠米
        soHm: function () {
            radio(
                '#mey-input',
                function () {
                    var meny = Number($('#nba').val());
                    ajax_hmm = Number($('#nba').attr('mm'));
                    ajax_hm = Number(meny);
                    input_meny = IFnum.Meny(input_value,ajax_hm,ajax_hr,ajax_xj);
                    Calc_text.html(IFnum.errorText(input_meny,Number(Calc_Input.val()),ajax_jx));
                },
                function () {
                    ajax_hm = Number(0);
                    ajax_hmm = Number(0);
                    input_meny = IFnum.Meny(input_value,ajax_hm,ajax_hr,ajax_xj);
                    Calc_text.html(IFnum.errorText(input_meny,Number(Calc_Input.val()),ajax_jx));
                }
            );

        },
        //现金劵
        soXj : function(){
            $('#calc-xj .but-off-text').on('click','input',function(){
                var o = Number($(this).attr('is_aut'));
                var value = Number($(this).attr('nominal'));
                input_val = Number(Calc_Input.val());
                var html;

                //为互斥标时,现金券与加息劵不能同时使用
                if($('#isMutex').val() == 1) { if(ajax_jx > 0){ alert('您已使用过加息劵,无法同时使用现金券'); $(this).removeAttr('checked'); return } }

                if( !$(this).is(':checked') ){
                    ajax_xj -= value;
                    ajax_xjoo -= o;
                    $(this).parents('.row').css('color','#666');
                }else{
                    ajax_xjoo += o;
                    if( input_val >= ajax_xjoo ){
                        ajax_xj += value;
                        $(this).parents('.row').css('color','#000');
                    }else{
                        $(this).removeAttr('checked');
                        ajax_xjoo -= o;
                        alert("当前投标金额无法释放更多现金券！");
                    }
                }
                if(ajax_xj==0) html = '未使用'; else html = '<strong>'+ajax_xj+'</strong>元';
                input_meny = IFnum.Meny(input_value,ajax_hm,ajax_hr,ajax_xj);
                $('#calc-xj span b').html(html);
                Calc_text.html(IFnum.errorText(input_meny,input_val,ajax_jx));
            });

        },
        //加息劵
        soJx : function(){

            $('#calc-jx .but-off-text').on('click','input',function(){
                var o = Number($(this).attr('is_aut'));
                var value = Number($(this).attr('nominal'));
                input_val = Number(Calc_Input.val());
                var html;

                //为互斥标时,现金券与加息劵不能同时使用
                if($('#isMutex').val() == 1) { if(ajax_xj > 0){ alert('您已使用过现金券,无法同时使用加息劵'); $(this).removeAttr('checked'); return } }

                if( !$(this).is(':checked') ){
                    ajax_jx -= value;
                    ajax_jxoo = 0;
                    $(this).parents('.row').css('color','#666');
                }else{
                    ajax_jxoo = o;

                    if( input_val >= ajax_jxoo ){

                        var ros = $(this).attr('soJx');
                        for( var i = 0; i < soJx; i++) {

                            var paren = $('.soJx-' + i);
                            if( i == ros ) {
                                paren.attr('checked', 'checked');
                                ajax_jx = paren.attr('nominal');
                                ajax_jxoo = Number(paren.attr('is_aut'));
                                paren.parents('.row').css('color','#000');
                            }else{
                                paren.removeAttr('checked');
                                paren.parents('.row').css('color','#666');
                            }

                        }

                    }else{
                        $(this).removeAttr('checked');
                        alert("当前投标无法释放更多加息券！");
                    }
                }
                if(ajax_jx==0) html = '未使用'; else html = '<strong> '+ajax_jx+'%</strong>';
                $('#calc-jx span b').html(html);
                Calc_text.html(IFnum.errorText(input_meny,input_val,ajax_jx));
            });

        },
        //惠人币
        soHr : function(){
            if( !$('#calc-hr .but-off-text .row')[0] ) $('#calc-hr span b').html('无可用');
            $('#calc-hr .but-off-text').on('click','input',function(){
                var value = Number($(this).attr('nominal'));
                var html;
                if( !$(this).is(':checked') ){
                    ajax_hr -= value;
                    $(this).parents('.row').css('color','#666');
                }else{
                    ajax_hr += value;
                    $(this).parents('.row').css('color','#000');
                }
                if(ajax_hr==0) html = '未使用'; else html = '&nbsp;<strong>'+ajax_hr+'</strong>';
                input_meny = IFnum.Meny(input_value,ajax_hm,ajax_hr,ajax_xj);
                $('#calc-hr span b').html(html);
                Calc_text.html(IFnum.errorText(input_meny,Number(Calc_Input.val()),ajax_jx));
            });
        },
        //全投
        soly : function(){
            $('.totally').on('click', function () {
                if(Calc_balance > Calc_invest) input_value = Calc_invest; else input_value = Math.floor(Calc_balance);
                input_val = input_value;
                input_meny = IFnum.Meny(input_value,ajax_hm,ajax_hr,ajax_xj);
                Calc_Input.val(input_value).css('color','#333');
                Calc_text.html(IFnum.errorText(input_meny,Calc_balance,ajax_jx));
                _ajax._(invest_id,input_value);

            });
        },

        _: function (invest_id,Meny,cooper) {

            coopAjax = $.ajax({
                type: 'GET',
                url: '/invest/borrower/cashcoupon/'+invest_id+'/'+ Meny,
                dataType: 'json',
                async: 'false',
                complete: function(){
                    numAjax -= 1;
                },
                success: function (data) {
                    //通用
                    var html = '',html2 = '',html3 = '',html4 = '';
                    var rebgo = Calc_Input.val() == undefined ? '' : Calc_Input.val();


                    //惠米
                    var hm_value = $('#calc-hm .calc-input #nba');
                    var hm_text = $('#calc-hm .calc-input span');

                    if( rebgo.indexOf('加入金额') >= 0 || rebgo == '0' ){
                        ajax_hm = 0;
                        hm_value.removeAttr('checked');
                        hm_value.next().removeClass('checked');
                        hm_text.html('您还有' + data.myPoint + '惠米，可兑换' + data.myPointConvert + '元');
                        hm_value.attr({ 'value': '0' ,'mm': 0 });
                    }else if( Number(rebgo) >= 10 && data.myPoint != 0 ){
                        ajax_hm = 0;
                        hm_value.removeAttr('checked');
                        hm_value.next().removeClass('checked');
                        hm_text.html('使用' + data.myPoint + '惠米，兑换' + data.myPointConvert + '元');
                        hm_value.removeAttr('disabled');
                        hm_value.attr({ 'value': data.myPointConvert,'mm': data.myPoint });

                    }else{
                        ajax_hm = 0;
                        hm_value.removeAttr('checked');
                        hm_value.next().removeClass('checked');
                        hm_value.attr({ 'value': 0  ,'mm': 0});
                        hm_text.html('使用0惠米，兑换0元');
                    }
                    //现金劵
                    var len = data.use.length;
                    var cool = 0;
                    var xjoo = 0;
                    if (len == 0) {
                        ajax_xj = 0;
                        html= '<b class="but-off-txt">暂无可用现金劵</b>';
                        html2= '无可用';
                    } else {
                        for (var i = 0; i < len; i++) {

                            html += '<div class="row mar-on"' + IFnum.getCheckStatus(data.use[i].is_use, Number(rebgo), data.use[i].every_tender_amt, 1) + '>' +
                                '<div class="col-3">' +
                                '<div class="calc-input-check" >' +
                                '<input type="checkbox" class="c-box" name="myCoupon[]"'+IFnum.getCheckStatus(data.use[i].is_use, Number(rebgo), data.use[i].every_tender_amt, 1) +
                                'nominal='+ data.use[i].nominal+
                                ' id="'+ data.use[i].id +'"'+
                                ' is_aut="'+ data.use[i].every_tender_amt +
                                '" is_use="' + data.use[i].is_use +
                                '" value="' + data.use[i].coding +
                                '">&nbsp;' +
                                data.use[i].nominal + '元' +
                                '</div>' +
                                '</div>' +
                                '<div class="col-5">' + data.use[i].ruleset_memo + '</div>' +
                                '<div class="col-4">' + '有效期至 ' + data.use[i].validity + '</div>' +
                                '</div>';

                            //现金劵金额打印
                            if (Number(input_value) >= Number(data.use[i].every_tender_amt) && parseInt(data.use[i].is_use) == 1) {
                                cool += Number(data.use[i].nominal);
                                ajax_xj = cool;
                                xjoo += Number(data.use[i].every_tender_amt); ajax_xjoo = xjoo;
                            }else{
                                ajax_xj = cool;
                            }
                            if (cool == 0) html2 = '无可用'; else html2 = '<strong>' + cool + '</strong>元';
                        }
                    }
                    $('#calc-xj .but-off-text').html(html);
                    $('#calc-xj span b').html(html2);



                    //加息劵
                    var lenJx = data.iic_use.length;
                    var coolJx = 0;
                    var xjooJx = 0;
                    if( lenJx == 0 ){
                        html3 = '<b class="but-off-txt">暂无可用加息劵</b>';
                        html4 = '无可用';
                    } else{
                        for (var i = 0; i < lenJx; i++) {
                            html3 += '<div class="row mar-on"' + IFnum.getCheckStatus(data.iic_use[i].is_use, Number(rebgo), data.iic_use[i].every_tender_amt, 1) + '>' +
                                '<div class="col-2">' +
                                '<div class="calc-input-check" >' +
                                '<input type="checkbox" class="c-box soJx-'+ i +'" soJx="'+ i +'" name="interest[]"'+IFnum.getCheckStatus(data.iic_use[i].is_use, Number(rebgo), data.iic_use[i].every_tender_amt, 1) +
                                'nominal='+ data.iic_use[i].increaseInterest+
                                ' id="'+ data.iic_use[i].coding +'"'+
                                ' is_aut="'+ data.iic_use[i].every_tender_amt +
                                '" is_use="' + data.iic_use[i].is_use +
                                '" value="' + data.iic_use[i].id +
                                '">&nbsp;' +
                                data.iic_use[i].increaseInterest + '%' +
                                '</div>' +
                                '</div>' +
                                '<div class="col-6">' + data.iic_use[i].rulesetMemo + '</div>' +
                                '<div class="col-4">' + '有效期至 ' + data.iic_use[i].validity + '</div>' +
                                '</div>';
                            
                            soJx=i+1;

                            //加息卷比例打印
                            if (Number(input_value) >= Number(data.iic_use[i].every_tender_amt) && parseInt(data.iic_use[i].is_use) == 1) {
                                coolJx += Number(data.iic_use[i].increaseInterest);
                                ajax_jx = coolJx;
                                xjooJx += Number(data.iic_use[i].every_tender_amt); ajax_jxoo = xjooJx;
                            }else{
                                ajax_jx = coolJx;
                            }
                            html4 = '未使用';
                        }
                    }
                    $('#calc-jx .but-off-text').html(html3);
                    $('#calc-jx span b').html(html4);

                    ajax_zjx = (data.inrateqh == '' || data.inrateqh == undefined) ? 0 : Number(data.inrateqh);

                    //现金劵
                    input_meny = IFnum.Meny(input_value,ajax_hm,ajax_hr,ajax_xj);
                    if( rebgo.indexOf('加入金额') >= 0 ) { input_meny = -1; }
                    if(cooper != 'yes') Calc_text.html(IFnum.errorText(input_meny,rebgo,ajax_jx));
                    Calc_button.data('Calc_button', true);
                },
                error: function (xhr, type) {
                    Calc_button.data('Calc_button', false);
                }
            });
            numAjax +=1;
            Calc_button.data('Calc_button', false);
        }
    };
    //返回值提取
    var inputText = {
        hr : function(o){
            var name = o.attr('name');
            var nominal = o.attr('nominal');
            var id = o.attr('id');
            var is_aut = o.attr('is_aut');
            var is_use = o.attr('is_use');
            var value = o.attr('value');
            var html = '<input type="checkbox" checked="checked" name="myCurrency[]" nominal="'+ nominal +'" value="'+ value +'">';
            return html;
        },
        xj : function(o){
            var _class = o.attr('class');
            var name = o.attr('name');
            var nominal = o.attr('nominal');
            var id = o.attr('id');
            var is_aut = o.attr('is_aut');
            var is_use = o.attr('is_use');
            var value = o.attr('value');
            var html = '<input type="checkbox" checked="checked" class="'+ _class +'" name="'+ name +'" nominal="'+ nominal +'" id="'+ id +'" is_aut="'+ is_aut +'" is_use="'+ is_use +'" value="'+ value +'">\n';
                html += '<input type="checkbox" checked="checked" class="'+ _class +'" name="myCouponID[]" nominal="'+ nominal +'" id="'+ id +'" is_aut="'+ is_aut +'" is_use="'+ is_use +'" value="'+ id +'">\n';
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
                html += '<input type="checkbox" checked="checked" class="'+ _class +'" name="interestCoding[]" nominal="'+ nominal +'" id="'+ id +'" is_aut="'+ is_aut +'" is_use="'+ is_use +'" value="'+ id +'">\n';
            return html;
        }

    };



    //下拉菜单
    function dropDown() {

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




    }
    $(function(){
        //核心处理
        $(window).unload(function(){ Calc_Input.val('加入金额('+min+'~'+Calc_invest+'元)') });
        _ajax._(invest_id,Number(input_meny),'yes');
        dropDown();

        /**
         * 其他操作*/
        if( Calc_invest == 0 ) {
            Calc_Input.attr('disabled', 'disabled');
            Calc_button.attr('disabled', 'disabled').css({"background":"#DDD","cursor":"text"});
            return;
        }
        _ajax.soHm();_ajax.soXj();_ajax.soJx();_ajax.soHr();_ajax.soly();
        Calc_Input.bind('focus',function () { Calc_text.html(''); if( $(this).val().indexOf('加入金额') >= 0 ) $(this).val(0);$(this).css('color', '#000') });
        Calc_Input.bind('blur',function () { Calc_text.html( IFnum.errorText( input_meny , Number($(this).val()),ajax_jx)) });
        Calc_Input.bind('keyup',function () {
            input_value = Number(IFnum.getInput($(this).val()));
            input_val = input_value;
            $(this).val(input_value);
            input_meny = IFnum.Meny(input_value,ajax_hm,ajax_hr,ajax_xj);
            Calc_text.html( IFnum.errorText( input_meny , input_value , ajax_jx) );
            clearTimeout(timeout);
            coopAjax.abort();Calc_button.data('Calc_button', false);
            timeout = setTimeout(function(){ _ajax._(invest_id,input_val) },500);
        });

        /**
         * 提交设定 */
        function CalcButton() {
            if( IFnum.submitInput(Number(input_meny),Number(input_value),Number(Calc_balance),Number(min),Number(max),Number(Calc_invest)) && Calc_button.data('Calc_button') ){

                Calc_button.buttonColorOff(Calc_text,'提交中,请稍后...');

                Array_hr = '';
                Array_xj = '';
                Array_jx = '';
                $('#calc-hr .but-off-text input:checked').each(function(){Array_hr += inputText.hr($(this));});
                $('#calc-xj .but-off-text input:checked').each(function(){Array_xj += inputText.xj($(this));});
                $('#calc-jx .but-off-text input:checked').each(function(){Array_jx += inputText.jx($(this));});

                var Exp,xjsy,xjsyss;
                //预期收益多种计算方式
                if( ajax_jx == 0 ) Exp = rate.init(); else Exp = rate.ajaxJXs();

                // 加息参数
                if( Number(input_value) >= rate_May ){ // 输入金额大于 50
                    if(xsb == 1) {
                        //新手标
                        xjsy = Number(ajax_jx) + Number(rate_xi); // 加息劵 + 标的加息(页面获取)
                        xjsyss = rate.art(input_value) * Number(ajax_jx) + rate.art(input_meny) * Number(rate_xi);
                    }else{
                        //非新手标
                        xjsy = Number(ajax_jx)+Number(ajax_zjx); // 加息劵 + 标的加息(ajax返回)
                        xjsyss = rate.art(input_value) * Number(ajax_jx) + rate.art(input_meny) * Number(ajax_zjx);
                    }
                }else{
                    xjsy = Number(ajax_jx); // 加息劵
                    xjsyss = rate.art(input_value) * Number(ajax_jx);
                }


                CPM({
                    title:'确认支付',
                    ID: $('#invest-myfrom'),
                    width: 590 ,
                    height: 405 ,
                    action: '/invest/pay/'+ invest_id,
                    culling: function(){
                        var html = `
                        <!--项目总额--><input id="Total-investment" name="Total-investment" type="hidden" value="${ Number(input_meny).toFixed(2) }"/>
                        <!--加入金额--><input id="myInvestment" name="myInvestment" type="hidden" value="${ Number(input_val).toFixed(2) }"/>
                        <!--惠人币--><div id="myCurrency" style="display: none;">${ Array_hr }</div>
                        <!--现金劵--><div id="myCoupon" style="display: none;">${ Array_xj }</div>
                        <!--加息劵--><div id="myPlusCoupons" style="display: none;">${ Array_jx }</div>
                        <!--惠米--><input id="myPoint" name="myPoint" type="hidden" value="${ Number(ajax_hm).toFixed(2) }"/>
                        <!--其他--><input id="repeat" class="tz_repeat" name="repeat" type="hidden" value="${ $('#repeat').val() }" />
                        <div class="investCalculator">
                            <div class="payment-jg">
                                <div class="gol">项目总额：<strong id="mey-Total">${ Number(input_meny).toFixed(2) }</strong>元，预期总收益：<strong id="mey-Exp">${ Number(Exp).toFixed(2) }</strong>元，请确认无误后进行支付：</div>
                                <dl class="succeed">
                                    <dd>          <label>现金出借：</label><p><em>${ Number(input_value) }</em>元</p></dd>
                                    <dd class="r"><label>使用惠米：</label><p><em>${ Number(ajax_hmm) }</em>惠米 ( 兑换<em>${ Number(ajax_hm) }</em>元 )</p></dd>
                                    <dd>          <label>使用惠人币：</label><p><em>${ Number(ajax_hr) }</em>惠人币</p></dd>
                                    <dd class="r"><label>使用现金劵：</label><p><em>${ Number(ajax_xj) }</em>元</p></dd>
                                    <dd><label>加息:</label><p>+<i>${ xjsy }</i>% ( 预期收益<em>${ (xjsyss).toFixed(2) }</em>元 )</p></dd>
                                </dl>
                            </div>
                           <div class="payment-bom">
                                <div class="payment-text">支付密码：<input id="paypassword" type="password" disabled="disabled" name="paypassword" maxlength="16" placeholder="请输入6-16位纯数字支付密码" autocomplete="off" /></div>
                                <div id="payError" class="invError"></div>
                                <input id="calculator-button" type="submit" value="确定" />
                                <div id="calculator-radio" class="login-radio">
                                    <input name="culator" type="radio" class="radio">
                                    <label id="culator" class="radio">我同意相关 <a href="${ '/invest/agreement/'+invest_id }">《借款协议》</a></label>
                                </div>
                                <div style="position: absolute;bottom:2px;right: 52px;color: #888888;">投资有风险</div>
                           </div>
                        </div>
                        `;

                        return html;
                    },
                    success: function(){

                        //提交状态清除
                        Calc_button.buttonColorOn();
                        Calc_text.html('');

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

                        $(document).off('mouseover','#paypassword').on('mouseover','#paypassword',function(){ pass.removeAttr('disabled') });
                        setTimeout(function(){ pass.removeAttr('disabled') },2000);

                        /*提交*/
                        $('#calculator-button').off('click').on('click', function () {

                            let
                                that = $(this),
                                input_meny,
                                $pass = $('#paypassword'),
                                prants = $('#invest-myfrom');

                            if(autoRadio && $pass.val().length > 0){

                                $('#Total-investment').each(function(){ input_meny = $(this).val() });
                                $.ajax({
                                    type:'GET',
                                    url:'/invest/borrower/cashcoupon/' + Number($("#invest_id").val()) + '/' + input_meny,
                                    dataType:'json',
                                    async:'false',
                                    success:function(data) {
                                        if(data.other >= Number(input_meny)){

                                            if( autoRadio ) invError.html('请认真阅读协议书，并勾选');
                                            if( pass.val() == '' ) invError.html('请输入支付密码！');

                                            if( pass.val() != '' &&  autoRadio) {
                                                that.buttonColorOff(invError,'提交中,请稍后...');
                                                prants.submit();
                                            }else{
                                                that.buttonColorOn();
                                            }

                                        }else{
                                            invError.html('您当前的加入金额大于可投金额，请重新操作');
                                            that.buttonColorOn();
                                        }

                                    },
                                    error:function(){
                                        invError.html('对不起，提交失败，请稍候重试');
                                        that.buttonColorOn();
                                    }
                                });
                                that.buttonColorOff(invError,'提交中,请稍后...');

                            }else{
                                if(!autoRadio) invError.html('请认真阅读协议书，并勾选');
                                if($pass.val().length <= 0) invError.html('请输入支付密码!');
                            }



                            return false;
                        });

                    }
                });

            }
        }
        
        /**
         * 投资详情倒计时 */
        $(".calc-Time").each(function () {
            var that = $(this);
            timeCountdown(that,that.attr('data-openTime'),that.attr('data-remainTime'),{
                remainOn:function(){
                    //开售时间结束,开放提交事件
                    Calc_button.removeClass('disabled').html('马上出借').bind("click",function(){var isRisk=$('#isRisk').val();if(isRisk==1 || isRisk==2){boxAlert();}else{CalcButton()}})
                }
            });
        });

    });

})();


//借款证明特效
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

/**
 * 投资记录 / 借款记录 ajax分页(信息打印)
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
                        if(data.code == '000') {
                            success(data);
                        }
                    }
                });

            }
        });
    }

    /**投资记录*/
    $.ajax({
        type:'POST',
        url:'/invest/investlogs',
        data:'borrowId='+$('#invest_id').val()+'&page=1&borrowId='+$("#invest_id").val(),
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
                    let html = `<div class="row col-cor-blue font-center"><div class="col-1 run-1 font-left">出借人</div><div class="col-2">加入金额</div><div class="col-2">有效金额</div><div class="col-2">出借时间</div><div class="col-1">状态</div><div class="col-2">备注</div></div>`;
                    for(var i = 0; i<data.data.length; i++){
                        html += `<div class="row col-cor-grey font-center"><div class="col-1 run-1 font-left">${data.data[i].USERNAME_DESC}</div><div class="col-2">${data.data[i].MONEY}元</div><div class="col-2">${data.data[i].ACCOUNT}元</div><div class="col-2">${data.data[i].ADDTIME_DESC}</div><div class="col-1">通过</div><div class="col-2"></div></div>`;
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
                    data:'borrowId='+$('#invest_id').val()
                },function(data){ Text(data) });
            }

        }
    });
    /**借款记录*/
    $.ajax({
        type:'POST',
        url:'/invest/borrowlogs',
        data:'borrow_uId='+$('#borrow_uid').val()+'&page=1',
        dataType:'json',
        async:'false',
        success:function(data) {

            if(data.code == '000') {

                function Text(data){
                    let html = `<div class="row col-cor-blue font-center"><div class="col-2 run-1 font-left">项目编号</div><div class="col-2">借款金额</div><div class="col-1 run-05">借款期限</div><div class="col-1 run-05">年利率</div><div class="col-2">出借时间</div><div class="col-1">状态</div></div>`;
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


}
boxAlert();
function boxAlert() {var alertVal=$('#isRisk').val();if(alertVal==1){Alert(1)}else if(alertVal==2){Alert(2)};
    function Alert(num) {var scripts = document.getElementsByTagName("script");
        var __FILE__ = scripts[scripts.length - 2].getAttribute("src").split('/static/')[0];
        var alertHtml=`<div class=\"back\" style=\"width: 100%;height: 100%;position: fixed;top: 0;left: 0;z-index: 101;background: rgba(0,0,0,0.6);\">
                      <div class=\"alert\" style=\" width: 336px; height: 520px;position: absolute;left: 50%;top: 50%;margin-left: -168px;margin-top: -260px;z-index: 4;\">
                           <div class=\"alert_top\" style=\"  width: 100%;height: 60px; position: relative;\">
                                <em style=\" position: absolute; background:url(${__FILE__}/static/images/v3/risk/gb.png) no-repeat center;;width: 47px; height: 45px; right: -22px; top: 0; display: inline-block;\"></em>
                           </div>
                            <div class=\"alert_center\" style=\" background: #fff url(${__FILE__}/static/images/v3/risk/alert_pc.png) no-repeat center;width: 100%; height: 170px;\"></div>
                            <div class=\"alert_title\" style=\" background: #fff;height: 188px;width: 100%;\">
                                <p style=\" width: 90%;margin: 0 auto;text-indent: 24px;font-size: 16px;color: #333333; line-height: 28px;padding-top: 16px;\">您的<span style=\" color: #fb560a;\">风险测评已过期</span>，为保证您的出借权益，请重新测评，结果即时生效预计耗时60~120秒，惠人贷承诺对测评结果保密。</p>
                            </div>
                            <div class=\"alert_bottom\" style=\" width: 100%;height: 104px; background: #fff;\">
                                <button class=\"kai\" style=\" display: block;width: 90%; margin: 0 auto;border: none;height: 44px; background:#336cd3;border-radius: 5px;color: #fff; font-size: 18px;\">开始测评</button>
                                <button class=\"zan\" style=\" display: block;width: 90%; margin: 0 auto;border: none;height: 44px;background: none;color: #999999;font-size: 18px;\">暂不测评</button>
                            </div>
                        </div>
                    </div>`;

        if(num===1){
            //首次评估
            $('body').append(alertHtml);
            $('.alert_title').children('p').html('风险测评为保障您的出借权益，建议您在惠人贷平台出借前进行风险测评，便于选择适合您风险承受能力的项目，预计耗时60~120秒，惠人贷承诺对测评结果保密。');
        }else if(num===2){
            //过期评估
            $('body').append(alertHtml);
        };

        $('.alert_top').on('click','em',function () {
            $('.back').hide();
        });
        $('.alert_bottom').on('click','.kai',function () {
            location.href='/account/risktolerance'
        });
        $('.alert_bottom').on('click','.zan',function () {
            $('.back').hide();
        });
    }
}

