/**
 * Created by Dreamslink on 16/6/19.
 * 用户中心综合 JS 处理
 */



/**
 * 左边栏 签到
 * */
{
    $(function(){
        let VipRegister = require('./page/VipRegister/VipRegister');
        let vipsign = $('#vipSign');
        VipRegister({
            vipSign   : vipsign,                     //父元素
            vipsignarr : $('#sign-txt'),             //补签机会
            vipText   : vipsign.children('ol'),      //签到日期
            vipButton : vipsign.children('strong'),  //签到按钮
            vipsignarrID : vipsign.children('strong'),//补签后积分特效元素位置
            vipsignarrFloat: 'top',                 //补签后积分特效显示方位
            vip:true,
            localName:'text'                        //判断补签刷新标签类型
        });
    })
}



/**
 * 左边栏 菜单
 * */
{
    let help = $('#help_tree dl dt');
    help.unbind().bind('click', function () {
        if ($(this).hasClass('show')) {
            $(this).removeClass('show').addClass('hide').next('dd').stop(false, true).slideUp();
        }
        else if ($(this).hasClass('hide')) {
            $(this).removeClass('hide').addClass('show').next('dd').stop(false, true).slideDown();
        }
    });
}



/**
 * 我的夺宝 : 夺宝码弹窗 */
{
    let alertYard = require('./page/snakch/alertYard/alertYard');

    $(document).on('click', '.snatch-record-alert', function () {
        let invest_id = $(this).data('borrowid');
        $.ajax({
            type: 'POST',
            url: '/seize/nums',
            data: 'uld=&borrowId='+invest_id+'&page=1',
            dataType: 'json',
            async: 'false',
            success: function (data) {
                alertYard(data,'uld=&borrowId='+invest_id);
            }
        });

    });

}



/**
 * 我的投资 : 下拉列表 */
if( $('#help-dropTable')[0] ) require.ensure(['./help.drop'],function(require){ require('./help.drop') },'help.drop');

/**
 * 其他小功能分布 */
if( $('#help-exchange-H')[0] ) require.ensure(['./help.rest'], function (require) { require('./help.rest') }, 'help.rest');

/**
 * 盈计划列表 */
if( $('#html-profit-list')[0] ) require.ensure(['./html/html-profit-list'], function (require) { require('./html/html-profit-list') }, 'html_profit_list');

/**
 * 我的盈计划 */
if( $('#help-profit-call')[0] ) require.ensure(['./help.profit'], function (require) { require('./help.profit') }, 'help.profit');



















