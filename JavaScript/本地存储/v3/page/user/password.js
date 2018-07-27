/**
 * Created by Dreamslink on 16/6/15.
 * 密码校验多功能插件
 */


(function ($) {

    var imts = require('./imts');
    /**
     * OPTIONS :
     *
     * errorID      错误提示显示区域 ( 传入对象 )
     * passtwiceID     自定义获取对错结果ID ( 传入例: #status 字符串后替换默认结果ID , 可选 )
     * passwordID   二次密码验证ID ( 传入对象后开放二次密码验证功能 , 可选 )
     * ajax             引入Ajax方式校验 ( 传入 GET / POST 时启动,不传只做基本判断 PS:不传为注册所用,传为登陆所用 )
     * ajaxUrl          Ajax地址 (传入字符串)
     * ajaxData         Ajax数据 (传入字符串)
     * ajaxSuccess      Ajax回调 (传入 function)
     * */
    let defaults = {
        errorID : null,
        passtwiceID : null,
        statusID : '',
        ajaxType: null,
        ajaxUrl :  null,
        ajaxData : null,
        ajaxSuccess : null
    };
    
    let that;

    let Password = function ($ele, options) {
        that = this;
        that.$ele = $ele;
        that.options = options = $.extend(defaults, options || {});
        that.init();
    };

    Password.prototype = {
        init: function(){
            that.BasisEvent();
        },
        BasisEvent: function(){

            var options = that.options,
                value = $.trim(that.$ele.val()),
                result = imts.validate_password(value,1);

            if(value == undefined || value == null || value == ''){
                options.errorID.show().html('请填写密码');
                that.status(false);

            }else if(value.length < 8 || value.length > 20) {
                options.errorID.show().html('登录密码不能少于 8 个字符,且必须有字母');
                that.status(false);

            }else{

                //如果 ajax 为 GET / POST 时,开启 ajax 校验方式,否则只执行基础校验;
                if(options.ajaxType == 'GET' || options.ajaxType == 'POST'){
                    that.BasisAjax();
                }else{

                    if( result == 'true' ){

                        //如果实例中传入 passtwiceID ,则开启二次密码验证;否则只判断密码验证;
                        if(that.options.passtwiceID != null) {
                            that.options.passtwiceID.bind('blur',that.passtwice);
                        }else{
                            options.errorID.show().html('');
                            that.status(true);
                        }

                    }else{
                        options.errorID.show().html(result);
                        that.status(false);
                    }

                }

            }

        },
        passtwice: function(){

            var options = that.options;
            /**
             * 二次密码验证功能
             * */
            if(options.passtwiceID.val() == $.trim(that.$ele.val())) {
                options.errorID.show().html('');
                that.status(true);
            }else{
                options.errorID.show().html('两次输入密码不一致');
                that.status(false);
            }

        },
        BasisRome: function(){

            var options = that.options;
            //初始化结果数据
            options.errorID.show().html('');
            that.status(false);

        },
        BasisAjax: function(){

            var options = that.options;
            /**
             * 此Ajax方法为登陆校验密码准备
             * */
            $.ajax({
                type:options.ajaxType,
                url:options.ajaxUrl,
                data:options.ajaxData,
                dataType:'json',
                async:'false',
                success:function(data) {
                    if($.isFunction(options.ajaxSuccess)) {
                        options.ajaxSuccess(data);
                    }else{



                        



                    }
                },
                error:function() {
                    options.errorID.show().html('本次提交失败');
                    that.status(false);
                }
            });

        },
        status: function(status){

            var options = that.options;
            //使用 data 方式向外部抛出最终结果,用于提交判断事件是否符合条件,返回 Boolean 值;
            //如果实例对象 statusID 被设定,则覆盖默认名称提取结果;
            if(options.statusID == ''){
                that.$ele.data('password', status);
            }else{
                that.$ele.data(options.statusID, status);
            }

        }
    };
    
    $.fn.password = function(options) {
        options = $.extend(defaults, options || {});

        return new Password($(this), options);
    };
    
})(jQuery,window,document);
