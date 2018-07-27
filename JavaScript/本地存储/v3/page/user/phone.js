/**
 * Created by Dreamslink on 16/6/14.
 * 手机号校验多功能插件
 */


(function ($) {
    var imts = require('./imts');
    /**
     * OPTIONS :
     *
     * errorID          错误提示显示区域 ( 传入对象 )
     * statusID         自定义获取对错结果ID ( 传入例: status 字符串后替换默认结果ID , 可选 )
     * statusTextID     自定义获取错误信息ID ( 传入例: status 字符串后替换错误信息ID , 可选 )
     * ajax             引入Ajax方式校验 ( 传入 GET / POST 时启动,不传只做基本判断 )
     * ajaxUrl          Ajax地址 (传入字符串)
     * ajaxData         Ajax数据 (传入字符串)
     * ajaxSuccess      Ajax回调 (传入 function)
     * */
    var defaults = {
        errorID : null,
        statusID : '',
        statusTextID : '',
        ajaxType: null,
        ajaxUrl :  null,
        ajaxData : null,
        ajaxSuccess : null
    };

    var that;

    var Phone = function ($ele, options) {
        that = this;
        that.$ele = $ele;
        that.options = options = $.extend(defaults, options || {});
        that.init();
    };

    Phone.prototype = {
        init: function(){
            that.BasisEvent();
        },
        BasisEvent: function(){

            var options = that.options,
                value = $.trim(that.$ele.val());

            if(value == undefined || value == null || value == ''){
                that.errorData('请输入您的手机号');
                that.status(false);

            }else if(!imts.phone.test(value)) {
                that.errorData('您的手机号不正确');
                that.status(false);

            }else{

                //如果 ajax 为 GET / POST 时,开启 ajax 校验方式,否则只执行基础校验;
                if(options.ajaxType == 'GET' || options.ajaxType == 'POST'){
                    that.BasisAjax();
                }else{
                    that.errorData('');
                    that.status(true);
                }

            }

        },
        BasisRome: function(){

            //初始化结果数据
            that.errorData('');
            that.status(false);

        },
        errorData: function(text){

            /**
             * 输入错误信息,并且在 data 中传入,已提供外部使用
             * phoneText 返回手机号错误信息
             * */
            that.options.errorID.html(text).show();
            //使用 data 方式向外部抛出最终结果,用与其他组件获取错误信息,返回 String 值;
            //如果实例对象 statusTextID 被设定,则覆盖默认名称提取结果;
            if( that.options.statusTextID == '' ){
                that.$ele.data('phoneText', text);
            }else{
                that.$ele.data(that.options.statusTextID, text);
            }
            
        },
        BasisAjax: function(){

            var options = that.options;

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



                        if (data.r == '00'){
                            that.errorData('');
                            that.status(true);
                        } else{
                            that.errorData(data.m);
                            that.status(false);
                        }



                    }
                },
                error:function() {
                    that.errorData('本次提交手机号失败');
                    that.status(false);
                }
            });

        },
        status: function(status){

            var options = that.options;
            //使用 data 方式向外部抛出最终结果,用于提交判断事件是否符合条件,返回 Boolean 值;
            //如果实例对象 statusID 被设定,则覆盖默认名称提取结果;
            if(options.statusID == ''){
                that.$ele.data('phone', status);
            }else{
                that.$ele.data(options.statusID, status);
            }

        }
    };

    $.fn.phone = function (options) {
        options = $.extend(defaults, options || {});

        return new Phone($(this), options);
    }

})(jQuery);

