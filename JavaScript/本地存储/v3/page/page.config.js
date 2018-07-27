/**
 *
 * 内部组件说明文档
 *
 */

{
    let PlugUnitArr = {

        alert : {
            init: { alt: '弹窗初始化内容框架', url: require('./alert/init')}
            ,
            login: { alt: '登录通用弹窗', url: require('./alert/login')}
            ,
            calc: { alt: '理财计算器弹出框' , url:require('./alert/calc') }
        }
        ,
        drawCurtain : { alt: '拉幕顶通广告' , url: require('./drawCurtain/drawCurtain') }
        ,
        eptitle : { alt: '小图标信息提示浮层' , url: require('./eptitle/eptitle') }
        ,
        ItemAnimtion : { alt: '卡片信息提示特效' , url: require('./ItemAnimtion/ItemAnimtion') }
        ,
        lottery : { alt: '抽奖特效-九宫格' , url: require('./lottery/lottery') }
        ,
        other : {
            keyboard: { alt: '键盘处理事件集合', url: require('./other/keyboard')}
            ,
            Number_Increase: { alt: '数据从零增加特效', url: require('./other/Number_Increase')}
        }
        ,
        overdueBill : { alt: '即将过期劵提示提示弹出显示特效' , url: require('./overdueBill/overdueBill') }
        ,
        mobilead : { alt: '首页弹出活动广告' , url: require('./mobilead/mobilead') }
        ,
        page : {
            PageAjax: { alt: 'ajax分页特效' , url:require('./page/PageAjax') }
            ,
            PagePHP: { alt: 'PHP分页特效' , url:require('./page/PagePHP') }
            ,
            PageAjaxs: { alt: 'ajax分页特效实例调用' , url:require('./page/PageAjaxs') }
        }
        ,
        radio : { alt: '单个按钮样式' , url: require('./radio/radio') }
        ,
        RightTop : { alt: '侧边通用悬浮/返回顶部' , url: require('./RightTop/RightTop') }
        ,
        SendStock : { alt: '随机赠劵弹出显示特效' , url: require('./SendStock/SendStock') }
        ,
        sinosig : { alt: '阳光保险，各页面HTML添加' , url:require('./sinosig/sinosig') }
        ,
        timeCountdown : { alt: '剩余时间计时器(无样式开售/剩余倒计时计时器)' , url: require('./timeCountdown/timeCountdown') }
        ,
        timeCountdowns : { alt: '炫酷倒计时计时器' , url: require('./timeCountdowns/timeCountdowns') }
        ,
        transforms : { alt: '首页产品翻转特效' , url:require('./transforms/transforms') }
        ,
        user : {
            imts: { alt: '基础校验规则算法(正则)', url: require('./user/imts')}
            ,
            phone: { alt: '手机号校验多功能插件', url: require('./user/phone')}
            ,
            password: { alt: '密码校验多功能插件', url: require('./user/password')}
            ,
            phone_captcha: { alt: '短信验证码多功能校验', url: require('./user/phone_captcha')}
            ,
            buttonColor: { alt: '提交按钮效果', url: require('./user/buttonColor')}
            ,
            Limits: { alt: '金额输入限制规则', url: require('./user/Limits')}
        }
        ,
        VipRegister : { alt: '会员签到' , url: require('./VipRegister/VipRegister') }
        ,
        snakch : {
            alertYard : { alt: '夺宝码弹窗' , url: require('./snakch/alertYard/alertYard') }
        }
        ,
        scroll : { alt: '锚点/点击返回顶部' , url: require('./scroll/scroll') }
    }
}

