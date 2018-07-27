/**
 * Created by Dreamslink on 16/6/23.
 * 登录通用弹窗
 */

{
    let
        CPM = require('./init'),
        radio = require('../radio/radio');

    require('../user/phone');
    require('../user/password');
    require('../user/buttonColor');
    
    /**
     * 代码中添加 data-alert="login" 后,登录弹窗生效
     * 样式文件搜索 : WebCssMac.scss
     * */
    $('[data-alert="login"]').each(function(){$(this).css('cursor','pointer')});
    $('[data-alert="login"]').off('click').on('click',function(){
        CPM({
            title:'登录',
            ID:$('#loginAlert'),
            width:410,
            height:300,
            culling:function(){
                var html = `
                      
                <div class="LoginCard">
                    <div class="ul">
                        <div class="input_phone"><input type="text" id="login_phone" placeholder="请输入用户名或手机号码" autocomplete="off"></div>
                        <div class="input_password"><input type="password" id="login_password" class="" placeholder="请输入登录密码" autocomplete="off"></div>
                        <div class="code_img">
                            <input type="text" placeholder="请输入数字之和" autocomplete="off">
                            <p>
                                <img class="ImgRefresh" src="/user/figurecaptcha">
                                <strong class="refresh">&nbsp;</strong>
                            </p>
                        </div>
                    </div>
                    <div class="login-sport">
                        <p id="alert-login-radio">
                            <input name="alert-sport" type="radio" class="radioShi">
                            <label id="alert-sport" class="radioShi">记住用户名 <em>公用环境请勿选择!</em></label>
                        </p>
                        <a href="/user/findpwd/mobile">忘记密码</a>
                    </div>
                    <div class="loginError"></div>
                    <button id="AlertloginSubmit" class="loginSubmit" href="javascript:">登录</button>
                    <a href="/user/register" class="Loginuser">立即注册</a>
                </div>
              
                `;
                return html;
            },
            success:function(){



                let
                    phone = $('.LoginCard #login_phone'), // 用户名|手机号
                    password = $('.LoginCard #login_password'), // 密码
                    codeImg = $('.LoginCard .code_img'),  // 图形验证码父元素
                    loginError = $('.LoginCard .loginError'),  // 错误提示
                    autologin = 0; //单选框

                //留白
                $('.ther-body').css('width', '89%');

                //清空数据
                $('input[type="text"],input[type="password"]').bind('fours', function () { loginError.html('') });

                //单项选择
                radio(
                    '#alert-login-radio',
                    function(){
                        autologin = 1;
                    },function(){
                        autologin = 0;
                    });
                phone.bind('focus',function(){ loginError.html('') });
                password.bind('focus',function(){ loginError.html('') });
                //图形验证码切换
                $('strong.refresh').off('click').on('click', function () {
                    $('img.ImgRefresh').attr('src','/user/figurecaptcha?'+ new Date().getTime())
                });

                //提交
                $('#AlertloginSubmit').on('click', function () {
                    let that = $(this);
                    $.ajax({
                        type:'POST',
                        url:'/user/loginajaxex',
                        data:"data="+cmdEncrypt('username='+ phone.val() +'&password='+ password.val() +'&captcha='+codeImg.children('input').val()+'&autologin='+ autologin +'&logintype=popup'),
                        dataType:'json',
                        async:'false',
                        success:function(data) {
                            if(data.r == '00'){
                                if(data.url.length <= 0 ) window.location.reload(); else location.href = String(data.url);
                            }else if(data.captcha == '1') {
                                $('#AlertFather').css({'height':'364px','margin-top':'-182px'});
                                $('#AlertContent').css({'height':'364px'});
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

                    return false;
                });

            }
        });
    });
   
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
