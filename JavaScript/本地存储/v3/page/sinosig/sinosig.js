/**
 * Created by Dreamslink on 16/6/3.
 * 阳光保险，各页面HTML添加
 */

// 样式文件 WebCssMac P189

$(function () {
    
    function sinosig(Hclass, Hcss, Acss , Ccss) {
        var html = '<div class="yg" style="' + Hcss + '"><a href="/activity/201512ygbx" target="_blank" style="' + Acss + '">交易资金盗转盗用风险由<strong style="'+ Ccss +'">阳光保险</strong>提供保障</a></div>';
        $(Hclass).each(function (index, value) {
            $(value).append(html)
        });
    }
    
    // //注册：
    // sinosig('.reg-content .reg-info .left', 'margin-top:-20px;margin-left:150px');
    // //登录：
    // sinosig('.loginBao', 'margin-top:10px;margin-left:22px','font-size:12px');
    // //注册banner：
    // sinosig('.banner-info', 'position:absolute;bottom:5px;', 'color:#dadada;');
    // //首页注册/登录：
    // sinosig('.bannerBao', 'position:absolute;bottom:7px;left:24px', 'color:#fff;font-size:12px','font-size:12px;margin:0 3px');
    // //通用
    // sinosig('.bx');
});

