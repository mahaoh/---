/**
 * Created by Dreamslink on 16/6/15.
 * 短信验证码多功能校验
 */

;(function($){
    /**
     * OPTIONS :
     *
     * errorID      错误提示显示区域 ( 传入对象 )
     * textID       短信验证码输入框区域 ( 传入对象 )
     * phoneStatus  手机号对象,以及其验证对错结果获取名称 ( 传入数组 [object,string] )
     * time         短信再发送间隔时间
     * one          自启动一次 ( 布尔值 )
     * statusID     自定义获取对错结果ID ( 传入例: #status 字符串后替换默认结果ID , 可选 )
     * imgID        图形验证码点击区域 ( 传入对象 PS:自带图形验证码功能 )
     * imgVal       图形验证码输入框区域 ( 传入对象 )
     * YYclick      语音验证点击区域 ( 传入对象  PS:自带语音验证功能 )
     * ajax             引入Ajax方式校验 ( 传入 GET / POST 时启动,不传只做基本判断 )
     * ajaxUrl          Ajax地址 (传入字符串)
     * ajaxData         Ajax数据 (传入字符串)
     * ajaxSuccess      Ajax回调 (传入 function)
     * */
    var defaults = {
        errorID : null,
        textID : null,
        phoneStatus : null,
        time : 60,
        one:null,
        statusID : '',
        imgID : $('strong.refresh'),
        imgVal : $('.code_img input'),
        YYclick : $('.voice'),
        ajaxType: null,
        ajaxUrl :  null,
        ajaxData : null,
        ajaxSuccess : null
    };

    var that,
        st = "验证码已发送",
        str= "秒后重新发送",
        timer;

    var captcha = function ($ele, options) {
        that = this;
        that.$ele = $ele;
        that.options = options = $.extend(defaults, options || {});
        that.init();

    };

    captcha.prototype = {

        init: function(){
            if(that.options.one) that.Basisajax('SMS'); // 如果 one 等于 true ,则自动执行一次短信验证提交
            that.$ele.on('click',function(){ that.Basisajax('SMS') });
            that.options.YYclick.on('click',function(){ that.Basisajax('TTS') });
        },
        Basisajax: function(way){

            var options = that.options, _url,time = options.time;

            let
                img = options.imgID.parent(), //发送图形验证码父元素
                YY = options.YYclick,         //发送语音验证码元素
                errors = options.errorID,      //错误信息元素

                PhoneStatus = that.PhoneStatus(); //手机所需参数

            switch (way) {
                //ajaxUrl 如果为空,则执行默认路径;如果为数组则,需要 SMS 与 TTS 两个路径的组合;
                case 'SMS' :
                    _url = options.ajaxUrl == null ? '/user/smscaptcha/' + PhoneStatus.news + '/register/' + options.imgVal.val() : options.ajaxUrl[0]; //短信验证方式
                    break;
                case 'TTS' :
                    _url = !$.isArray(options.ajaxUrl) ? '/user/voicecaptcha/' + PhoneStatus.news + '/register/' + options.imgVal.val() : options.ajaxUrl[1]; //语音验证方式
                    break;
                default :
                    break;
            }

            if(PhoneStatus.fruit) {

                $.ajax({
                    type:options.ajaxType,
                    url:_url,
                    dataType:'json',
                    async:'false',
                    success:function(data) {



                        //短信验证码多用DOM
                        function CaptchaTed(){
                            that.$ele.css({
                                'border': '1px solid #ccc',
                                'color': '#ccc',
                                'line-height': '27px',
                                'font-size': '12px',
                                'cursor': 'default'
                            }).html(time + str)
                        }
                        //语音验证码多用DOM
                        function YYShow() { YY.removeAttr('style').html('语音验证码').bind('click', function () { that.Basisajax('TTS') }) }
                        function YYCap(str){
                            YY.siblings('b').hide();
                            YY.css({
                                'color': '#ccc',
                                'cursor': 'default'
                            }).html('语音验证码 (' + st + ',' + time + str + ')');
                        }
                        /**
                         * 00 成功
                         * 12 请输入正确的图形验证码
                         * 13 短信发送次数超限,请稍后重试
                         * */
                        if(data.r == '00' || data.r == '01' || data.r == '13'){

                            switch (way) {
                                case 'SMS':
                                    /**
                                     * 短信验证
                                     *
                                     * */
                                    errors.show().html('');
                                    YY.css({'color': '#ccc', 'cursor': 'default'}).unbind('click');
                                    that.$ele.unbind('click');

                                    if( data.r == '01'){

                                        img.show();that.$ele.bind('click', function () { that.Basisajax('SMS') });

                                    }else if (data.r != '13' && data.r != '01') {
                                        //成功后
                                        CaptchaTed();
                                        if(PhoneStatus.cut == 'object') options.phoneStatus[0].attr('disabled', 'disabled');
                                        timer = setInterval(function () {
                                            time -= 1;
                                            that.$ele.html(time + str);
                                            if (time < 0) {
                                                clearInterval(timer);
                                                that.$ele.removeAttr('style').html('重新发送');
                                                time = options.time;
                                                if(PhoneStatus.cut == 'object') options.phoneStatus[0].removeAttr('disabled');
                                                that.$ele.bind('click', function () { that.Basisajax('SMS') });
                                                YYShow();
                                            }
                                        }, 1000);
                                        that.status(true);

                                    }else {
                                        CaptchaTed();
                                        that.$ele.removeAttr('style');
                                        var txt = that.$ele.text() == '重新发送' ? '重新发送' : '发送验证码';
                                        that.$ele.html(txt);
                                        errors.show().html(data.m);
                                    }
                                    break;
                                default :
                                    /**
                                     * 语音验证
                                     * */
                                    that.$ele.hide();YY.unbind('click');errors.show().html('');

                                    if(data.r == '01'){

                                        img.show();YYShow();

                                    }else if (data.r != '13' && data.r != '01') {
                                        //成功后
                                        YYCap(str);
                                        timer = setInterval(function () {
                                            time -= 1;
                                            YY.siblings('b').hide();
                                            YY.html('语音验证码 (' + st + ',' + time + str + ')');
                                            if (time < 0) {
                                                clearInterval(timer);
                                                time = options.time;
                                                YYShow();YY.siblings('b').show();
                                                that.$ele.show();
                                            }
                                        }, 1000);
                                        that.status(true);

                                    } else {

                                        YYCap(str);YY.html(data.m);

                                    }
                                    break;
                            }

                        }else if(data.r == '14'){
                            errors.show().html(data.m);
                        }else if(data.r == '12'){
                            img.show();
                            errors.show().html(data.m);
                            $('img.ImgRefresh').attr('src','/user/figurecaptcha?'+ new Date().getTime())
                        }else{
                            errors.show().html(data.m);
                            that.status(false);
                        }


                    },
                    error:function(data) {
                        errors.show().html('本次验证码发送失败');
                        that.status(false);
                    }
                });

            }else{
                options.errorID.html(PhoneStatus.text);
            }
        },
        PhoneStatus: function(){

            var options = that.options,
                fruit = {
                    fruit: false, //判断所需
                    news: '',     //电话号码
                    cut: null,    //参数类型
                    text: ''      //错误信息
                };
            //获取手机号验证最终结果
            options.phoneStatus = options.phoneStatus || [];
            switch (typeof options.phoneStatus){
                case 'string':
                    fruit.fruit = true;
                    fruit.cut = 'string';
                    fruit.news = options.phoneStatus;
                    fruit.text = '';
                    break;
                case 'object':
                    fruit.fruit = options.phoneStatus[0].data(options.phoneStatus[1]);
                    fruit.cut = 'object';
                    fruit.news = options.phoneStatus[0].val();
                    fruit.text = options.phoneStatus[0].data(options.phoneStatus[2]);
                    break;
                default:
                    break;
            }

            return fruit;

        },
        status: function(status) {

            var options = that.options;
            //使用 data 方式向外部抛出最终结果,用于提交判断事件是否符合条件,返回 Boolean 值;
            //如果实例对象 statusID 被设定,则覆盖默认名称提取结果;
            if(options.statusID == ''){
                that.$ele.data('phone_captcha', status);
            }else{
                that.$ele.data(options.statusID, status);
            }

        }

    };

    $.fn.phone_captcha = function (options) {
        options = $.extend(defaults, options || {});

        return new captcha($(this), options);
    };

})(jQuery,window.document);


