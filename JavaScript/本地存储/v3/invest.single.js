/**
 *
 * 转让单笔债权计算方法
 *
 * */
import radio from './page/radio/radio';
// import {xinwAlert} from './page/alert/manage_not';

//舞台演员
let
    FeePct = Number($('#transferFeePct').val()), // 费率
    Detail = Number($('#transferDetail').val()), // 公允价值
     feect = Number($('#transferfeect').text()), // 可转让份数
 investAmt = Number($('#originalInvestAmt').text()), // 原始投资额
       err = $('.coon'),

     _free = $('#transferFree'), // 舞台
      free = 0, // 舞台初始值
    _radio = false, // 协议初始值
      mons = false, // 份数初始值

        _d = $('#transfer_each_money'), // 转让单价
        _z = $('#transfer_money'), // 转让总价格
        _f = $('#transfer_fee_amt'), // 转让费用
        _y = $('#profit_norm_int_amt'), // 预计收入金额

         d = 0, // 转让单价
         z = 0, // 转让总价格
         f = 0, // 转让费用
         y = 0, // 预计收入金额

      pass = $('#paypassword'),
     html1 = $('.from-callO'),
     html2 = $('.from-callT');

//价格换算
let IFmey = {

     Calculate : (paren,even)=> Number(paren * even).toFixed(2),

    CalculateO : (paren,even)=> Number(paren - even).toFixed(2),

    // 输入基本规则
    getInput(value){
        let reNum =  /^[0-9]+$/;
        if ( value == '' ) return 0;
        if ( value.length > 9 ) return value.substr(0, 9);
        if ( !reNum.test(value) ) return 0;
            else if ( value.length >= 2 ) return value.slice(0, 1) == 0 ? value.substr(1) : value;
            else return value;
    },

    // 表单验证
    textInput(value){
        if( value === '' || value === 0 ) {
            mons = false;
            html1.html('请填写转让份额');
        }else {
            mons = true;
            html1.html('');
        }
    }
};

//单选按钮
radio(
    '#calculator-radio',
    ()=> {
        _radio = true;
        err.html('');
    },
    ()=> {
        _radio = false;
        err.html('<strong>请认真阅读协议书，并勾选</strong>');
    }
);

//核心验算
$(function(){

    //转让系数
    let ficient = Number(Number(String($('#transferCoefficient option:selected').val()).split('%'))/100);

    $('#transferCoefficient').bind('change', ()=> {

        // 转让系数
        ficient = Number(($('#transferCoefficient option:selected').val().replace('%',''))/100);
        // 转让单价
        d = IFmey.Calculate(Detail,ficient);
        // 转让总价格
        if(free != feect) z = IFmey.Calculate(d,free); else z = IFmey.Calculate(d,Number(investAmt/100).toFixed(2));
        // 转让费用
        f = IFmey.Calculate(z,Number(FeePct/100).toFixed(5));
        // 预计收入金额
        y = IFmey.CalculateO(z,f);

        _d.html(d);_z.html(z);_f.html(f);_y.html(y);
    });

    _free.focus(function () {
        if( $(this).val() == '请输入购买份数' ) $(this).val(0);
        $(this).css('color', '#000');html1.html('');
    });

    _free.keyup(function(){
        ficient = Number(Number(String($('#transferCoefficient option:selected').val()).split('%'))/100); // 转让系数
        free = Number($(this).val()); // 转让份数
        free = Number(IFmey.getInput(free));
        IFmey.textInput(free);
        $(this).val(free).css('color','#000');

        // 转让单价
        d = IFmey.Calculate(Detail,ficient);
        // 转让总价格
        if(free != feect) z = IFmey.Calculate(d,free); else z = IFmey.Calculate(d,Number(investAmt/100).toFixed(2));
        // 转让费用
        f = IFmey.Calculate(z,Number(FeePct/100).toFixed(5));
        // 预计收入金额
        y = IFmey.CalculateO(z,f);

        _d.html(d);_z.html(z);_f.html(f);_y.html(y);

    });

    _free.blur(()=> IFmey.textInput(free) );
    pass.focus(()=> html2.html('') );
    pass.blur(function () { pass = $(this).val(); IFmey.passInput(pass); });
    pass.keyup(function () { html2.html(''); pass = $(this).val(); IFmey.passInput(pass); });

    xinwAlert('.cre-a', (that)=> {
        if ( _radio && mons ){
            err.html('<b style="color:#38c0ff">提交中，请稍后...</b>');
            $.ajax({
                type:'POST',
                url:'/depository/dispenser',
                data:`action=TRANSFER_CONFIRM&transferId=${$('#transferId').val()}&transferNum=${_free.val()}&transferCoefficient=${Number(Number(String($('#transferCoefficient option:selected').val()).split('%'))/100)}`,
                dataType:'json',
                async:'false',
                success:(data)=> data.code === '00000' ? location.href = data.data.req_addr : err.html(data.msg)
            })
        }else {
             if(!mons) html1.html('请填写转让份额');
             if(!_radio) err.html('<strong>请认真阅读协议书，并勾选</strong>');
        }
    });

});

$(window).unload(()=>{
    $('#transferFree').css('color','#ccc').val('请输入购买份数');
    $('#transferCoefficient option:selected').val(100)
});

