/**
 * Created by Dreamslink on 2017/1/10.
 * 即将过期劵提示弹出显示特效
 */

{

    //基础判断
    function isFace(options){
        return options != '' && options != null && options != undefined && typeof options === 'number';
    }

    //事件操作
    function OverDueBill(OverDueBills){

        /**
         * <script id="OverDueBills">
         * var OverDueBills {
         *
         *  InterestAmount : 加息劵数量
         *      CashAmount : 现金券数量
         *             err : 为 true 打印错误信息，默认不显示
         * }
         * </script>
         *
         * PS:
         *
         *      加息劵/现金劵 单一显示时，另一值为空；共同显示时两者都填
         *      有效值必须为 number
         *
         * */

        let
            InterestAmount = OverDueBills.InterestAmount,   //加息劵数量
                CashAmount = OverDueBills.CashAmount,       //现金劵数量
                       err = OverDueBills.err,              //错误信息

            Text = '',     //输出内容
            sUrl = '';     //输出链接


        //状态判断
        if(isFace(InterestAmount) && isFace(CashAmount)){
            /** 现金劵/加息劵*/
            Text = `您有 ${CashAmount} 张现金券和 ${InterestAmount} 张加息券即将过期，请尽快使用哦！`;
            sUrl = '/account/info';
        } else if(isFace(InterestAmount)) {
            /** 加息劵*/
            Text = `您有 ${InterestAmount} 张加息券即将过期，请尽快使用哦！`;
            sUrl = '/account/interest/1';
        } else if(isFace(CashAmount)) {
            /** 现金劵*/
            Text = `您有 ${CashAmount} 张现金券即将过期，请尽快使用哦！`;
            sUrl = '/account/cashcoupon';
        } else {
            // 错误信息
            if(err) console.log('参数类型并非 Number，或者未写入参数'); return;
        }



        let __FILE__, scripts = document.getElementsByTagName("script");
            __FILE__ = scripts[scripts.length - 1].getAttribute("src").split('/static/')[0];


        let html = `
            <!--随机赠劵-->
            <style class="OverDueBills" type="text/css">
                .OverDueBills{opacity:0;width:462px;height:302px;position:fixed;right:0;top:80px;z-index:999;border:1px solid #c2c2c2;-webkit-border-radius:20px;-moz-border-radius:20px;border-radius:20px;background:rgba(255,255,255,0.9);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#E5ffffff,endColorstr=#E5ffffff)}
                .OverDueBills .OverDueBills-info{width:462px;height:327px;margin-top:-25px;position:relative;overflow:hidden;background:url("+__FILE__+"/static/images/v3/builtv3/OverDueBills-back.png) center top no-repeat}
                .OverDueBills .OverDueBills-info .OverDueBills-off{width:16px;height:16px;position:absolute;top:45px;right:25px;cursor:pointer;background:url("+__FILE__+"/static/images/v3/builtv3/OverDueBills-off.png) center no-repeat}
                .OverDueBills .OverDueBills-info .OverDueBills-text{width:80%;position:absolute;top:120px;left:10%;font-size:18px;color:#333333;text-align:center}
                .OverDueBills .OverDueBills-info .OverDueBills-submit{width:100%;position:absolute;bottom:40px;left:0;text-align:center}
                .OverDueBills .OverDueBills-info .OverDueBills-submit a{width:160px;font-size:18px;line-height:45px;color:#fff;display:inline-block;margin:20px;background:#2c8ef6;border:1px solid #2c8ef6;-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px;}
                .OverDueBills .OverDueBills-info .OverDueBills-submit a.OverDueBills-a{background:none;color:#2c8ef6}
            </style>
            
            <div class="OverDueBills">
                <div class="OverDueBills-info">
                    <em class="OverDueBills-off">&nbsp;</em>
                    <div class="OverDueBills-text">
                        ${Text}
                    </div>
                    <div class="OverDueBills-submit">
                        <a href="/">去使用</a>
                        <a class="OverDueBills-a" href="${sUrl}">去查看</a>
                    </div>
                </div>
            </div>
        `;


        $('body').append(html);


        /**
         * 显示/关闭*/
        $('.OverDueBills').stop(true,false).animate({opacity:1},1000,function(){
            //显示后 6秒 消失
            setTimeout(function () {
                $('.OverDueBills').stop(true,false).animate({opacity:0},1000,function(){ $(this).remove() })
            },6000);
        });

        $('.OverDueBills-off').on('click',function(){
            $('.OverDueBills').stop(true,false).animate({opacity:0},1000,function(){
                $(this).remove();
            })
        });

    }

    //实例对象
    $(function(){
        if($('#OverDueBills')[0]) OverDueBill(OverDueBills);
    });
}