/**
 * Created by Dreamslink on 16/10/19.
 * 会员签到
 */


{
    let that;

    function VipRegister(defaults,options){

        if(typeof defaults === 'object'){
            options = defaults;
            defaults = undefined;
        }

        that = this;
        that.options = options = options || {};
        /**
         * @param vipsign         //父元素
         * @param vipsignarr      //补签机会
         * @param vipText         //签到日期
         * @param vipButton       //签到按钮
         * @param vipsignarrID    //补签后积分特效元素位置
         * @param vipsignarrFloat //补签后积分特效显示方位
         * @param vip             //跳过是否登录判断直接开放 值： Boolean
         * @param localName       //判断补签刷新标签类型 值： 'input' 'text'
         * */
        that.init();

    }


    VipRegister.prototype = {
        /**
         * 签到详情初始化*/
        init : function() {

            let options = that.options;

            if($('#isLogin').val() == 1 || options.vip) {

                $.ajax({
                    type:'POST',
                    url:'/member/json',
                    data:'action=signinfo',
                    dataType:'json',
                    async:'false',
                    success:function(data) {

                        if(data.code === '00000'){

                            let times = '';
                            //遍历签到日期状态
                            for(let i = 0; i < data.data.info.length; i++) {
                                if(i==0) { times += `<li class="m ${that.hand(data.data.info[i])}">${i+1}</li>`; } else { times += `<li class="${that.hand(data.data.info[i])}">${i+1}</li>`; }
                            }
                            options.vipText.html(times);
                            //判断今天是否已签到
                            if(parseInt(data.data.sign_status) == 0)
                                options.vipButton.addClass('signinfo').removeClass('dids').html('签到');
                            else
                                options.vipButton.addClass('dids').removeClass('signinfo').html('已签到，请明天再来');
                            //打印补签次数
                            if(options.localName === 'input') options.vipsignarr.val(data.data.fillup_count); else options.vipsignarr.html(data.data.fillup_count);

                            that.vipSigns();
                        }

                    }
                });
            }
        },
        /**
         * 签到状态*/
        hand : function (info) {
            switch (parseInt(info)) {
                case 0 :
                    /**未签到*/
                    return'';
                    break;
                case 1 :
                    /**已签到*/
                    return 'adv';
                    break;
                case 2 :
                    /**补签*/
                    return 'did';
                    break;
                default :
                    /**已发放领奖权限*/
                    return 'rdo';
                    break;
            }
        },
        /**
         * 签到功能设定*/
        vipSigns : function (){

            let options = that.options;

            //补签
            $(document).off('click','.did').on('click','.did', function () {

                let
                    fillup_count = options.localName === 'input' ? parseInt(options.vipsignarr.val()) : parseInt(options.vipsignarr.text()),
                    su = parseInt($(this).html());

                //没有补签机会直接退出
                if(fillup_count <= 0) return alert('对不起，您没有补签机会！');

                //补签日期返还给签到按钮
                options.vipButton.data('su', su);

                //补签按钮特效
                $(this).addClass('show').siblings().removeClass('show');

                options.vipButton.addClass('signinfo').removeClass('dids').html('补签');

            });

            //签到
            $(document).off('click','.signinfo').on('click','.signinfo', function () {

                let theday = options.vipButton.data('su') == undefined ? 7 : options.vipButton.data('su');

                $.ajax({
                    type:'POST',
                    url:'/member/json',
                    data:'action=signin&theday='+theday,
                    dataType:'json',
                    async:'false',
                    success:function(data) {

                        if(data.code === '00000'){

                            //新元素宽高
                            let Integral = options.vipsignarrID,$top,$left;

                            switch(options.vipsignarrFloat){
                                case 'right':
                                    $top = Integral.offset().top-5;
                                    $left = Integral.offset().left+Integral.outerWidth(true);
                                    break;
                                case 'top':
                                    $top = Integral.offset().top-Integral.outerHeight(true)/2;
                                    $left = Integral.offset().left+Integral.outerWidth(true)/2;
                                    break;
                                default:

                                    break;
                            }

                            $('body').append(`<div class="gralanmite" style="position:absolute;top:${$top}px;left:${$left}px;font-size:18px;color:red;display:none;">+${data.data.point}</div>`);

                            $('.gralanmite').slideDown(1000, function () {

                                $(this).animate({'opacity':'0'},1000,function(){ $(this).remove() });

                                let times = '';
                                //遍历签到日期状态
                                for(let i = 0; i < data.data.info.length; i++) {
                                    if(i==0) { times += `<li class="m ${that.hand(data.data.info[i])}">${i+1}</li>`; } else { times += `<li class="${that.hand(data.data.info[i])}">${i+1}</li>`; }
                                }
                                options.vipText.html(times);
                                options.vipButton.addClass('dids').removeClass('signinfo').html('已签到，请明天再来');
                                //刷新积分
                                if(!options.vip) Integral.html(parseInt(Integral.html())+parseInt(data.data.point));
                            });

                            //打印补签次数
                            if(options.localName === 'input') options.vipsignarr.val(data.data.fillup_count); else options.vipsignarr.html(data.data.fillup_count);
                        }

                    }
                });

            });


        }
    };


    module.exports = function(defaults,options) {
        return new VipRegister(defaults,options);
    };

}