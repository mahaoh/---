/**
 * Created by Dreamslink on 16/6/8.
 * 首页产品翻转特效
 *
 */

/*
* turn 调用需要传入三种参数
*
* target: 元素
* time  : 动画时间
* opts  : 起始与结束样式,格式 [{css},{css}];
* */
module.exports = function (target, time, opts) {
    target.hover(function () {
        $(this).find('.first').stop(false,true).animate(opts[0], time, function () {
            $(this).hide().next().show();
            $(this).next().animate(opts[1], time);
        });
    }, function () {
        $(this).find('.last').stop(false,true).animate(opts[0], time, function () {
            $(this).hide().prev().show();
            $(this).prev().animate(opts[1], time);
        });
    });
};