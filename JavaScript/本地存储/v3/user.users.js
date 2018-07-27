/**
 * Created by Dreamslink on 16/6/3.
 * 注册页面
 */

var radio = require('./page/radio/radio');
require('./page/user/phone');
require('./page/user/password');
require('./page/user/phone_captcha');
require('./page/user/buttonColor');

{
    
    let
        phone = $('#user_phone'),           //手机号码
        pass = $('#user_password'),         //密码
        img_captcha = $('.code_img input'), //图形验证密码
        captcha = $('#code_phone'),         //短信验证码
        radios = true,                         //单选按钮

        passl = $('#user_password_two'), //二次密码
        refresh = $('#refresh'),         //短信按钮
        errors = $('.loginError');       //错误提示

    //验证手机号
    function phoneF(val){
        phone.phone({
            errorID: errors,
            ajaxType:'GET',
            ajaxUrl:'/user/checkmobile/' + val
        });
    }
    //验证密码/验证二次密码
    function passF(){  pass.password({ errorID: errors,passtwiceID:passl })  }
    //短信验证码
    function refreshF(){
        refresh.phone_captcha({
            errorID: errors,
            phoneStatus:[phone,'phone','phoneText'],
            ajaxType:'GET'
        });
    }
    //单选按钮
    radio(
        '#login-radio',
        function(){
            radios = true;
            errors.html('');
        },
        function(){
            radios = false;
            errors.html('请认证阅读使用协议,并勾选');
        }
    );


    /**
     * 其他操作*/
    phone.bind('blur',function(){ phoneF($(this).val()) });
    pass.bind('blur',function(){ passF() });
    passl.bind('focus',function(){ errors.html('') });
    img_captcha.bind('focus',function(){ errors.html('') });
    captcha.bind('focus',function(){ errors.html('') });
    refreshF();

    //提交
    $('#userSubmit').bind('click', function () {

        let
            that = $(this),
            $phone = phone.data('phone'),
            $pass = pass.data('password'),
            $refresh = refresh.data('phone_captcha');

        if($phone && $pass && $refresh && radios){
            that.buttonColorOff(errors,'提交中,请稍后...');
            $.ajax({
                type:'POST',
                url: '/user/registerajax',
                data:"data="+cmdEncrypt('phone='+phone.val()+'&password='+pass.val()+'&img_captcha='+img_captcha.val()+'&captcha='+captcha.val()),
                dataType: 'json',
                async: 'false',
                success:function(data){
                    if(data.r == '00'){
                        location.href = '/user/registerResult';
                    }else{
                        errors.html(data.m);
                        that.buttonColorOn();
                    }
                },
                error:function(data) {
                    errors.html('本次提交失败，请重试');
                    that.buttonColorOn();
                }
            });
        }else{
            if(!$refresh) errors.html('验证码不能为空');
            if(!$pass) passF();
            if(!$phone) phoneF(phone.val());
            if(!radios) errors.html('请认证阅读使用协议,并勾选');
        }
        
    });

    //回车提交
    document.onkeydown=function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==13){
            $('#userSubmit').click();
        }
    };

}
 //数据加密
    function cmdEncrypt(that){
        var rsa = new RSAKey();
        var modulus = "D2B2A26451479928A48DD65E4188D3DC034C29388A2E212690A5148B7240E63E5D82A3BEE7F43CE2338B130BA81BC6834A3B875FDB54C7E0705B9FB843CD72034722170542DA6BCC2BA6C6142F141A33D4F9A21608F0579D1D9C866B5F8F5B4D002EB4EB57C5BF22B9FE45FC42B8A2DC1DFDA39642D4F90A5317732B2D60AF41";
        var exponent = "10001";
        rsa.setPublic(modulus, exponent);
        var res = rsa.encrypt(that);
        return res;
    };




