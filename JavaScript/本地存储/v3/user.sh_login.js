/**
 * Created by Dreamslink on 16/6/3.
 * 登录页面
 */

var 
    radio = require('./page/radio/radio'),
    keyboard = require('./page/other/keyboard');

require('./page/user/buttonColor');
//数据加密
    function cmdEncrypt(that){
        var rsa = new RSAKey();
        var modulus = "D2B2A26451479928A48DD65E4188D3DC034C29388A2E212690A5148B7240E63E5D82A3BEE7F43CE2338B130BA81BC6834A3B875FDB54C7E0705B9FB843CD72034722170542DA6BCC2BA6C6142F141A33D4F9A21608F0579D1D9C866B5F8F5B4D002EB4EB57C5BF22B9FE45FC42B8A2DC1DFDA39642D4F90A5317732B2D60AF41";
        var exponent = "10001";
        rsa.setPublic(modulus, exponent);
        var res = rsa.encrypt(that);
        return res;
    };

{

    // (个人 / 企业)登录切换

    /*
     * 切换时,得到对于指针,并且返回, card 可供外部调用操作,区别个人/企业;
     * 个人 = 0; 企业 = 1; 默认等于 0 ( 个人 );
     * */

    var card = 1;

    let
        phone = $('#login_phone'), // 用户名|手机号
        password = $('#login_password'), // 密码
        firm = $('#input_firm'), // 企业信息
        firmlist = firm.parents('strong').siblings('dl'), // 企业列表
        codeImg = $('.code_img'),  // 图形验证码父元素
        loginError = $('.loginError'),  // 错误提示
        autologin = 0; //单选框

    //清空数据
    $('input[type="text"],input[type="password"]').bind('fours', function () { loginError.html('') });
    // 企业列表生成
    phone.bind('blur', function () {
        let val = $.trim($(this).val());
        if(card == 1 && (val != undefined || val != '') ) {
            $.ajax({
                type:'POST',
                url:'/user/cooprlist',
                data:'username='+val,
                dataType:'json',
                async:'false',
                success:function(data){
                    if( data.r == '00' ){
                        var txt='';
                        for(var i = 0; i < data.d.length ; i++){
                            txt += '<dd BCH_CDE="'+data.d[i].BCH_CDE+'">'+data.d[i].COOPR_NAME+'</dd>';
                            if(i==0){
                                firm.css('color','#333').val(data.d[i].COOPR_NAME).data('BCH_CDE',data.d[i].BCH_CDE);
                            }
                        }
                        firmlist.html(txt);firm.data('toggle',false);
                        loginError.html('');
                    }else{
                        loginError.html(data.m);
                    }
                }
            });
        }
    });
    //企业列表点击信息更换
    firmlist.on('click','dd', function () {
        var
            text = $(this).text(),
            type = $(this).attr('BCH_CDE');
        firm.val(text).data('BCH_CDE',type).data('toggle',false);
        firmlist.hide();
    });
    //企业列表点击显示
    firm.parent().on('click',function(){
        var ele = firm.data('toggle');
        if(!ele){
            firmlist.show();firm.data('toggle', true);
        }else{
            firmlist.hide();firm.data('toggle', false);
        }
    });

    /**
     * 零碎代码
    * */
    //单选框
    radio(
    '#login-radio',
    function(){
        autologin = 1;
    },function(){
        autologin = 0;
    });
    phone.bind('focus',function(){ loginError.html('') });
    password.bind('focus',function(){ loginError.html('') });



    //提交
    $('#loginSubmit').bind('click', function () {
        let coop = card == 0 ? '' : 'coop';
        let that = $(this);
        /**
         * 企业登陆
         * */
        $.ajax({
            type:'POST',
            url:'/user/loginajaxex',
            data:"data="+cmdEncrypt('username='+ phone.val() +'&password='+ password.val() +'&captcha='+codeImg.children('input').val()+'&coop_id='+ firm.data('BCH_CDE') +'&coop_name='+ phone.val() +'&autologin='+ autologin +'&logintype='+ coop),
            dataType:'json',
            async:'false',
            success:function(data) {
                if(data.r == '00'){
                    location.href = String(data.url);
                }else if(data.captcha == '1') {
                    codeImg.show();
                    loginError.html(data.m);
                    that.buttonColorOn();
                }else{
                    loginError.html(data.m);
                    that.buttonColorOn();
                }
            },
            error:function(data) {
                loginError.html('对不起，登录失败，请稍候重试');
                that.buttonColorOn();
            }
        });
        
        that.buttonColorOff(loginError,'提交中,请稍后...');
    });
    
    //回车提交
    keyboard.onkeydown(function () {
        $('#loginSubmit').click();
    });

}
