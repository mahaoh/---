/**
 * Created by Dreamslink on 16/6/14.
 * 首页注册/登录,以及其他
 *
 */


var radio = require('./page/radio/radio'),
    MainIndexKeyboard = require('./page/other/keyboard');
    
require('./page/user/phone');
require('./page/user/password');
require('./page/user/phone_captcha');
require('./page/user/buttonColor');
require('./page/mobilead/mobilead');



/**
 * 首页卡片列表 下拉展示更多*/
{
    $(function () {
        var item = $('ul.Invest-item li').length;
        var $parent = $(".Invest-ment");
        //当标数量大于12个时,显示下拉,小于12个时,显示对应高度
        if(item > 12){
            $parent.css({'height':'1380px','padding-bottom':'30px'});
            $('.invest-pulldown').addClass('pulldown-img');
        }
        //下拉按钮,仅一次
        $('.pulldown-img').on('click',function(){
            var max = $('ul.Invest-item').outerHeight(true) + $('.title-headhack').outerHeight(true);
            $parent.stop(false, true).animate({height: max}, 500,function(){
                $('.invest-pulldown').removeClass('.pulldown-img')
                    .css({
                        'text-align':'center',
                        'line-height':'40px',
                        'font-size':'14px',
                        'background':'none'
                    }).html('<a href="/invest/list">>>查看全部<<</a>');
            });
        });

        $(window).resize(function () {
            //ipad与PC下拉高度重新获取
            if($(window).width() <= 1050){

                var time = setTimeout(function(){
                    var max = $('ul.Invest-item').outerHeight(true) + $('.title-headhack').outerHeight(true);
                    $parent.attr('style','height:'+max+'px');
                    $('.invest-pulldown').removeClass('.pulldown-img')
                        .css({
                            'text-align':'center',
                            'line-height':'40px',
                            'font-size':'14px',
                            'background':'none'
                        }).html('<a href="/invest/list">>>查看全部<<</a>');
                    $parent.data('pulldown', 1);
                    clearTimeout(time);
                },1000);

            }else {
                if($parent.data('pulldown') == 1) $parent.removeAttr('style');

            }

        });
    });

}



/**
 * 首页卡片(选项卡)*/
{
    // 切换登录/注册

    var coop = 0;

    /*
     * 切换时,得到对于指针,并且返回, coop 可供外部调用操作,区别 注册/登录;
     * 注册 = 0; 登录 = 1; 默认等于 0 ( 注册 );
     * */

    $('.banner-card ol li').bind('click', function () {
        var
            tath = $(this),
            ol_li = tath,
            ul_li = ol_li.parent().siblings('ul').children();

        coop = tath.index();

        $('.banner-card ul li input').val('');$('.loginError').html('');//清空所有数据

        tath.addClass('show').siblings().removeClass('show');
        ul_li.eq(tath.index()).addClass('show').siblings().removeClass('show');

    });
}

/**
 * 首页卡片 注册
 * */
{
    let
        phone = $('#userPhone'),               //手机号
        password = $('#userPassWord'),         //密码
        refresh = $('#refresh'),               //短信按钮
        img_captcha = $('.code_img input'),    //图形验证码
        captcha = $('#code_phone'),            //短信验证码
        radios = true,                         //单选按钮
        errors = $('.loginError');         //错误提示
    //手机号验证
    function phoneIN(val){
        phone.phone({
            errorID: errors,
            ajaxType:'GET',
            ajaxUrl:'/user/checkmobile/' + val
        });
    }
    //密码验证
    function passwordIN(){
        password.password({ errorID: errors })
    }
    //短信验证码
    function refreshIN(){
        refresh.phone_captcha({
            errorID: errors,
            phoneStatus:[phone,'phone','phoneText'],
            ajaxType:'GET'
        });
    }
    //单选按钮
    radio(
        '#user-radio',
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
    phone.bind('blur',function(){ phoneIN($(this).val()) });
    password.bind('blur',function(){ passwordIN() });
    password.bind('focus',function(){ errors.html('') });
    img_captcha.bind('focus',function(){ errors.html('') });
    captcha.bind('focus',function(){ errors.html('') });
    refreshIN();

    
    //提交
    $('#userSubmit').bind('click', function () {

        let
            that = $(this),
            $phone = phone.data('phone'),
            $pass = password.data('password'),
            $refresh = refresh.data('phone_captcha');

        if($phone && $pass && $refresh && radios){
            that.buttonColorOff(errors,'提交中,请稍后...');
            $.ajax({
                type:'POST',
                url: '/user/registerajax',
                data:'phone='+phone.val()+'&password='+password.val()+'&img_captcha='+$('#bannerLogin-user-codeImg').val()+'&captcha='+captcha.val(),
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
            if(!$pass) passwordIN();
            if(!$phone) phoneIN(phone.val());
            if(!radios) errors.html('请认证阅读使用协议,并勾选');
        }

    });
    
}

/**
 * 首页卡片 登录
 * */
{
    let
        phone = $('#login_phone'),       // 用户名|手机号
        pass = $('#login_password'),     // 密码
        codeImg = $('.code_img'),        // 图形验证码父元素
        loginError = $('.loginError'),   // 错误提示
        autologin = 0; //单选框

    //清空数据
    $('input[type="text"],input[type="password"]').bind('fours', function () { loginError.html('') });

    //单选框
    radio(
    '#login-radio',
    function(){
        autologin = 1;
    },function(){
        autologin = 0;
    });
    pass.bind('focus',function(){ loginError.html('') });

    //提交
    $('#loginSubmit').bind('click', function () {
        let that = $(this);
        $.ajax({
            type:'POST',
            url:'/user/loginajaxex',
            data:'username='+ phone.val() +'&password='+ pass.val() +'&captcha='+$('#bannerLogin-login-codeImg').val()+'&autologin='+ autologin +'&logintype=',
            dataType:'json',
            async:'false',
            success:function(data) {
                if(data.r == '00'){
                    location.href = String(data.url);
                }else if(data.captcha == '1') {
                    codeImg.show();
                    phone.parent().css({'margin-top':'7px','margin-bottom':'7px'});
                    pass.parent().css({'margin-top':'7px','margin-bottom':'7px'});
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
}


/**
 * 其他DOM操作 */
$(function () {


    /*回车提交*/
    MainIndexKeyboard.onkeydown(function () {
        if(coop == 0) $('#userSubmit').click(); else $('#loginSubmit').click();
    });
    /*首页卡片图片位置样式修改*/
    $('.indexCaptain .Invest-ment ul.Invest-item li .invest-title').each(function (index,value) {
        //如果卡片没有活动图标,则修改小图标样式
        if(!$(value).next().hasClass('type')) $(value).children('p').css('margin-right', '0');
    });

});
