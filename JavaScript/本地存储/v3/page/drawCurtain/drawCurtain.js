/**
 * Created by Dreamslink on 16/8/17.
 * 拉幕顶通广告
 */

{
    //图片生成
    function text(id,height,obj) {
        return `<a class="drawCurtain-${id}" href="${obj.href}" style="height:${height}px;background:${obj.imgColor} url(${obj.url}) center center no-repeat;display:block"></a><style style="text/css">.drawCurtain-1,.drawCurtain-2{width:100%}@media screen and (max-width: 1200px){ .drawCurtain-1,.drawCurtain-2{width: 1300px} }</style>`
    }

    //事件操作
    function drawCurtain(drawCurtainOneStyle,drawCurtainTwoStyle) {

        /**
         * @param drawCurtainOneStyle { width , height , imgColor , url , href }
         * @param drawCurtainTwoStyle { width , height , imgColor , url , href }
         *
         * PS:
         *      第一次进入首页时显示拉幕特效,拉幕特效结束前每半秒重新设置当前最新高度;
         *      非首页 / 非第一次进入首页 时,直接显示横幅;
         *
         *      如果需要取消拉幕,设置 drawCurtainOneStyle = '' 即可;
         *
         * */

        let
            csoImg = $('.csoImg'), //原始通栏图片
            //大图信息(第一张)
            one = drawCurtainOneStyle || {},
            //小图信息(第二张)
            two = drawCurtainTwoStyle || {},
            //原始通栏高度判断
            csoHeight = csoImg.outerHeight(true) == null ? 0 : csoImg.outerHeight(true);

        //实际广告高度=可视窗口高度+顶部导航高度
        var outer = $(window).height() - ($('div.top').outerHeight(true)+csoHeight+$('header').outerHeight(true));
        var HEIGHT = one.height > outer ? outer : one.height;

        /** 如果 drawCurtainOneStyle 等于空,直接显示横幅并退出*/
        if(drawCurtainOneStyle == '' || drawCurtainOneStyle == undefined) return $('body').prepend(text(2,two.height,two));


        //判断是否为首页
        if($('#index-homepage')[0]) {
            /**
             * 首页操作*/

            // 第一次进入首页时显示拉幕效果,否则直接显示横幅( PS: 等于 1 为第一次进入首页，显示拉幕大图效果，为 0 则不显示 )
            if($('#drawCurtain').data('case') == 1){

                //生成第一张图片
                $('body').prepend(text(1,HEIGHT,one));

                // 横幅关闭前,每半秒重新获取一次高度
                var sTime = 0;
                var time = setInterval(function(){

                    var outer = $(window).height() - ($('div.top').outerHeight(true)+csoHeight+$('header').outerHeight(true));
                    var HEIGHT = one.height > outer ? outer : one.height;

                    $('.drawCurtain-1').css('height', HEIGHT);

                    //关闭前一秒结束
                    if(sTime == 8) clearInterval(time);
                    sTime++;

                },500);
                // 5秒后关闭第一张图片显示第二张图片
                setTimeout(function () {

                    $('.drawCurtain-1').stop(false,true).animate({'height':'0'},1000,function () {
                        $(this).remove();
                        $('body').prepend(text(2,0,two));
                        $('.drawCurtain-2').stop(false,true).animate({'height':two.height},500)
                    });

                }, 5000);

            }else{
                $('body').prepend(text(2,two.height,two));
            }


        } else {
            /**
             * 非首页操作*/
            $('body').prepend(text(2,two.height,two));
        }
    }

    //实例化
    $(function () {
        if( $('#drawCurtain')[0] ) drawCurtain(drawCurtainOneStyle,drawCurtainTwoStyle);
    });

}

