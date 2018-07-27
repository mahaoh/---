//债券转让详情

import CPM from './page/alert/init';
import radio from './page/radio/radio';
// import {xinwAlert} from './page/alert/manage_not';

{
    let
        User_Input = $('#pay_text'),           // 舞台
         User_text = $('#pay-IFtext'),         // 验证内容
       User_income = Number($('#pay-income').text()),  // 剩余份数
      User_balance = Number($('#pay-balance').text()), // 账户余额
       User_lowest = Number($('#pay-lowest').text()),  // 单价
          User_ben = Number($('#osOriginalInvestAmt').val()), // 转让本金、剩余原始投资额
         User_fair = Number($('#pay-fair').text()), //公允价值
               pay = Number( Number( $('#pay-Coefficient').text().replace('%','') ) / 100), // 转让系数
        User_money = $('#pay-money'),  // 购买金额
         map_money = $('#map-money'),  // 预期收益
        User_video = $('#pay-video'),  // 全部剩余
       input_value = 0,video_text = 0; // 演员

    //核心验算参数
    let IFnum = {
        getInput(value){
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
        getVideo(value){
            if( value == null ){
                return '0.00';
            }else if( value == User_income ){
                return Number( ( User_ben / 100 ) * User_fair * pay ).toFixed(2);
            }else{
                return Number(value * User_lowest).toFixed(2);
            }
        },
        getError(value){
            let Cssbay = 'color:red;font-size:14px;';
            //为空
            if( value === 0 || value === undefined ) return '<strong style="'+ Cssbay +'">请输入购买份数</strong>';
            //余额不足
            if( value > User_balance ) return '<strong style="'+ Cssbay +'">您的余额不足，请先充值。</strong>';
            return '';
        },
        getButton(value,balance,inp,income){
            if ( inp != 0 && value <= balance && inp <= income ) return true; else return false;
        }
    };

    let Each = Number($('#transferRegPsAmt').val());   // 每份代收本息
    let Amt = Number($('#osOriginalInvestAmt').val()); // 剩余原始投资额、转让本金

    //选择全部剩余
    User_video.bind('click', ()=> {
        input_value = User_income;
        input_value = IFnum.getInput(input_value); //份数
        video_text = IFnum.getVideo(input_value); //购买金额
        User_Input.val(input_value);
        User_money.html(video_text);
        User_Input.css('color', '#000');
        let map = input_value != User_income  ? Conversion.Expected(Each,input_value,video_text) : Conversion.soExpected(Each,Amt,video_text);
        map_money.html( map );
        User_text.html(IFnum.getError( video_text ));
    });

    $(function () {
        //核心操作
        window.onunload = ()=> User_Input.val('请输入购买份数');
        User_Input.focus(function () { if( $(this).val() == '请输入购买份数' ) $(this).val(0);$(this).css('color', '#000'); User_text.html(IFnum.getError( video_text )); });
        User_Input.blur(()=> User_text.html(IFnum.getError( video_text )) );

        User_Input.keyup(function(){
            input_value = $(this).val();
            input_value = IFnum.getInput(input_value);
            video_text = IFnum.getVideo(input_value);
            $(this).val(input_value);
            User_money.html(video_text);

            input_value = (input_value == '' || input_value == undefined) ? 0 : input_value;
            let map = input_value != User_income ? Conversion.Expected(Each,input_value,video_text) : Conversion.soExpected(Each,Amt,video_text);
            map_money.html( map );
            User_text.html(IFnum.getError( video_text ));
        });

        xinwAlert('#pay-button', function () {
            if( IFnum.getButton(Number(video_text),Number(User_balance),Number(input_value),Number(User_income)) ){
                CPM({
                    title:'确认支付',
                    ID: $('#payment-jg-button-submit-alert'),
                    width: 540 ,
                    height: 330 ,
                    culling: ()=> {
                        let Each = Number($('#transferRegPsAmt').val());//每份代收本息
                        let Amt = Number($('#osOriginalInvestAmt').val());//剩余原始投资额、转让本金
                        let fair = Number($('#pay-fair').text());//公允价值

                        return `
                        <!--债权转让确认支付-->
                        <style type="text/css">
                            #payment-jg-button-submit-alert .payment-jg{height: 86px;font-size:16px;margin-top:35px;}
                            #payment-jg-button-submit-alert .payment-jg span{width:50%;float:left;line-height:40px}
                            #payment-jg-button-submit-alert .payment-jg strong{color:#38c0ff;font-size:20px;margin:0 3px;display:inline-block}
                            #payment-jg-button-submit-alert #payment-button {width: 100%;margin: 0 auto 10px auto;line-height: 50px;height: 50px;font-size: 24px;outline: none;border: none;background:#38c0ff;color: #fff;text-align: center}
                            #payment-jg-button-submit-alert #calculator-radio a{color:#38c0ff}
                            #payment-jg-button-submit-alert .invError {width: 100%;height: 30px;line-height: 30px;margin: 15px auto 5px auto;color: red}
                        </style>
                        <div class="payment-jg">
                            <span style="width:100%">出借总额：<strong>${video_text}</strong>元</span>
                            <span>预期收益：<strong>${input_value != User_income ? Conversion.Expected(Each,input_value,video_text) : Conversion.soExpected(Each,Amt,video_text)}</strong>元</span>
                            <span>折让收益：<strong>${input_value != User_income ? Conversion.Discount(fair,pay,input_value) : Conversion.soDiscount(Amt,fair,pay)}</strong>元</span>
                        </div>
                        <div class="payment-bom">
                            <div id="pay-button-submit-alert-error" class="invError"></div>
                            <input id="payment-button" class="payment-button" type="submit" value="确定" />
                            <div id="calculator-radio" class="login-radio fuxuan">
                                <input name="culator" type="radio" class="radio">
                                <label id="culator" class="radio fuxuans">我同意相关 <a href="/loanCredit/agreement/${$('#regsterId').val()}">《债权转让及受让协议》</a></label>
                            </div>
                            <div style="position: absolute;bottom:2px;right: 52px;color: #888888;">出借有风险</div>
                        </div>
                    `
                    },
                    success: ()=> {

                        let sub = $('#payment-button'),
                            err = $('#pay-button-submit-alert-error');

                            // alert('执行一次')
                        //单选框
                        // radio(
                        //     '#calculator-radio',
                        //     function(){
                        //         sub.data('radio',true);
                        //         err.html('')
                        //     },
                        //     function(){
                        //         sub.data('radio',false);
                        //         err.html('请认真阅读协议书，并勾选')
                        //     }
                        // );

                        $('.payment-bom').on('click','#calculator-radio',function () {
                               $('.fuxuans').toggleClass('checked');
                        })
                        $(document).off('click', '#payment-button').on('click', '#payment-button', function () {
                            if($("#culator").hasClass('checked')){
                                err.html('提交中，请稍后...');
                                $.ajax({
                                    type:'POST',
                                    url:'/depository/dispenser',
                                    data:`action=TRANSFER_PAY_CONFIRM&transferId=${$('#transferId_id').val()}&transferNum=${input_value}`,
                                    dataType:'json',
                                    async:'false',
                                    success:(data)=> data.code === '00000' ? location.href = data.data.req_addr : err.html(data.msg)
                                })
                            } else err.html('请认真阅读协议书，并勾选');

                            return false;
                        });

                    }
                });
            }else User_text.html(IFnum.getError( video_text ));
        });

    });
}

//债权转让确认支付计算方法
{
    let Conversion = {
        /*
         * Each   每份待收利息
         * shares 购买份数
         * fair   每份公允价值
         * Amt    剩余原始投资额
         * unit   每份单价
         * coefficient 购买系数
         * capital 本金
         * */

        // 预期收益 = 每份待收利息 * 购买份数 - 本金
        Expected : (Each,shares,capital) => ( Number(Each) * Number(shares) - Number(capital) ).toFixed(2),
        // 时折让收益 =  购买份数 * ( 1 - 购买系数 ) * 每份公允价值
        Discount : (fair,coefficient,shares) => ( Number(fair) * ( 1 - Number(coefficient) ) * Number(shares) ).toFixed(2),

        // 此次购买之后当前剩余份数为0,则按照下面公式计算:
        // 预期收益 = 每份待收利息 * ( 剩余原始投资额 / 100 ) - 本金
        soExpected : (Each,Amt,capital) => ( Number(Each) * ( Number(Amt) / 100 ) - Number(capital) ).toFixed(2),
        // 折让收益 =（ 剩余原始投资额 / 100 ）* 每份公允价值 * ( 1 - 购买系数 )
        soDiscount : (Amt,fair,coefficient) => ( ( Number(Amt) / 100 ) * Number(fair) * ( 1 - Number(coefficient) ) ).toFixed(2)
    };

    window.Conversion = Conversion;
}