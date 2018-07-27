/**
 * Created by Dreamslink on 16/6/3.
 * 登录页面
 */

var 
    radio = require('./page/radio/radio'),
    keyboard = require('./page/other/keyboard');

require('./page/user/buttonColor');


{
    // (个人 / 企业)登录切换

    var card = 0;

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

{

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
         * 商户登录
         * */
        switch (card) {
            case 0:
                /**
                 * 个人登录 */
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
                break;
            default:
                /**
                 * 企业登录 */
        
                var host = window.location.host,
                    url = host.substring(host.indexOf(".")+1);

                //noinspection JSAnnotator
                document.domain = url;
        
                let form = `<iframe id="saveReportForm" src="http://sh.huirendai.com/site/proxy" style="display:none"></iframe>`;
        
                $('body').append(form);
        
                var time = setTimeout(function(){
        
                    var iframes =document.getElementById('saveReportForm').contentWindow;
        
                    iframes.window.jQuery.ajax({
        
                        url:"http://sh."+url+"/login",
                        data:'username='+ phone.val() +'&password='+ password.val(),
                        method:"post",
                        dataType:"json",
                        success:function(data){
        
                            if(data.status == '0'){
                                location.href = String(data.go);
                            }else{
                                loginError.html(data.error);
                                that.buttonColorOn();
                            }
        
                        },
                        error:function(data){
                            loginError.html('对不起，登录失败，请稍候重试');
                            that.buttonColorOn();
                        }
        
                    });
        
                    clearTimeout(time);
        
                },1000);
        
                break;
        }

        that.buttonColorOff(loginError,'提交中,请稍后...');
    });
    
    //回车提交
    keyboard.onkeydown(function () {
        $('#loginSubmit').click();
    });

}
