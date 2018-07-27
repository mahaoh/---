/**
 * Created by Dreamslink on 16/11/8.
 * 剩余时间计时器(炫酷倒计时计时器)
 */


/*
 * 使用方法：
 * ==============================

 <div class="digits"></div>

 $(function(){
 $(".digits").timeCountdowns({
 image: "/static/images/v3/builtv3/digits.png",// 默认样式图片
 startTime: "5",// 剩余时间(时间戳)
 });
 });

 //其他 API 可参照下方 options 属性使用

 * ==============================
 * */


jQuery.fn.timeCountdowns = function(userOptions)
{

    var options = {
        image: "/static/js/v3/page/timeCountdowns/digits.png",   // 默认样式图片
        stepTime: 60,           // 秒数
        format: "dd:hh:mm:ss",  // 默认格式 'dd:hh:mm:ss'
        startTime: "0",         // 剩余时间(时间戳)
        startCnt:true,          // 是否显示: 天时分秒 / :
        digitWidth: 67,         // 宽
        digitHeight: 90,        // 高
        digitImages: 6,
        timerEnd: function(){   // 结束后回调
            location.reload();
        }
    };
    var digits = [], intervals = [] ,elem = $(this);


    // 画出数字在给定容器中
    var createDigits = function(where)
    {


        /**
         * 时间戳转义 */
        let iDay, iHour, iMinute, iSecond, sTime, cos, formats='';
        iDay = parseInt(parseInt(options.startTime) / 24 / 3600);
        iHour = parseInt((parseInt(options.startTime) / 3600) % 24);
        iMinute = parseInt((parseInt(options.startTime) / 60) % 60);
        iSecond = parseInt(parseInt(options.startTime) % 60);

        // 是否显示: 天时分秒 / :
        if(options.startCnt) cos = ['天','时','分','秒']; else cos = [':',':',':',''];

        //时间戳转义
        if(iDay > 0) {
            //如果天数大于零时，则以下 时分秒 为零仍然显示
            iDay = iDay < 10 ? '0'+iDay+cos[0] : iDay+cos[0];
            iHour = iHour < 10 ? '0'+iHour+cos[1] : iHour+cos[1];
            iMinute = iMinute < 10 ? '0'+iMinute+cos[2] : iMinute+cos[2];
            iSecond = iSecond < 10 ? '0'+iSecond+cos[3] : iSecond+cos[3];
            formats += 'dd:hh:mm';
        } else {

            iDay = '';

            if(iHour > 0) {
                //如果小时大于零时，则以下 分秒 为零仍然显示
                iHour = iHour < 10 ? '0'+iHour+cos[1] : iHour+cos[1];
                iMinute = iMinute < 10 ? '0'+iMinute+cos[2] : iMinute+cos[2];
                iSecond = iSecond < 10 ? '0'+iSecond+cos[3] : iSecond+cos[3];
                formats += 'hh:mm';
            } else {

                iHour = '';

                if(iMinute > 0) {
                    //如果分钟大于零时，则以下 秒 为零仍然显示
                    iMinute = iMinute < 10 ? '0'+iMinute+cos[2] : iMinute+cos[2];
                    iSecond = iSecond < 10 ? '0'+iSecond+cos[3] : iSecond+cos[3];
                    formats += 'mm';
                } else {
                    iMinute = '';

                    //处理秒
                    iSecond = iSecond > 0 ? iSecond < 10 ? '0'+iSecond+cos[3] : iSecond+cos[3] : '';
                }
            }

        }
        sTime = `${iDay}${iHour}${iMinute}${iSecond}` || '00天00时00分00秒';

        /*
         转义后：dd:hh:mm:ss
         开始时间和格式必须遵循相同的格式 （ dd:hh:mm:ss ）
         还不能指定格式无序(例如hh:ss:毫米是错误的)
         根据转义时间戳(sTime)输出对应格式,将替换默认格式 format
        */
        formats = formats+':ss' || 'dd:hh:mm:ss';


        var c = 0;
        //遍历每一个开始时间数,如果这不是一个数字
        //我们asume分离器
        for (var i = 0; i < sTime.length; i++)
        {
            if (parseInt(sTime[i]) >= 0)
            {


                elem = $('<div id="cnt_' + c + '" class="cntDigit" />').css({
                    height: options.digitHeight,
                    display: 'inline-block',
                    background: 'url(\'' + options.image + '\')',
                    width: options.digitWidth
                });

                elem.current = parseInt(sTime[i]);
                digits.push(elem);

                margin(c, -elem.current * options.digitHeight * options.digitImages);

                // 添加最大数字,例如,分钟(mm)的第一位
                // 5的马克斯。有条件使用max当左边的数字
                // max。例如第二“小时”数字的条件最大4
                switch (formats[i])
                {
                    case 'h':
                        digits[c]._max = function(pos, isStart) {
                            if (pos % 2 == 0)
                                return 2;
                            else
                                return (isStart) ? 3: 9;
                        };
                        break;
                    case 'd':
                        break;
                    case 'm':
                    case 's':
                        digits[c]._max = function(pos){ return (pos % 2 == 0) ? 5: 9; };
                }
                ++c;
            }
            else
            {
                elem = $('<div class="cntSeparator" style="height:'+options.digitHeight+'px;margin:0 10px;display:inline-block;vertical-align:top;line-height:'+options.digitHeight+'px"/>').text(sTime[i]);
            }

            where.append(elem)
        }
    };

    // 设置或获取元素
    var margin = function(elem, val)
    {
        if (val !== undefined)
        {
            digits[elem].margin = val;
            return digits[elem].css({'backgroundPosition': '0 ' + val + 'px'});
        }

        return digits[elem].margin || 0;
    };


    var makeMovement = function(elem, steps, isForward)
    {
        // 停止任何其他运动在同一位
        if (intervals[elem])
            window.clearInterval(intervals[elem]);

        // 移动到初始位置
        // 这里有一些场景数字同步
        var initialPos = -(options.digitHeight * options.digitImages *
        digits[elem].current);
        margin(elem, initialPos);
        digits[elem].current = digits[elem].current + ((isForward) ? steps: -steps);

        var x = 0;
        intervals[elem] = setInterval(function(){
            if (x++ === options.digitImages * steps)
            {
                window.clearInterval(intervals[elem]);
                delete intervals[elem];
                return;
            }

            var diff = isForward ? -options.digitHeight: options.digitHeight;
            margin(elem, initialPos + (x * diff));
        }, options.stepTime / steps);
    };

    var moveDigit = function(elem)
    {


        if (digits[elem].current == 0)
        {
            // 是否还有时间
            if (elem > 0)
            {
                var isStart = (digits[elem - 1].current == 0);

                makeMovement(elem, digits[elem]._max(elem, isStart), true);
                moveDigit(elem - 1);
            }
            else // 这个条件意味着我们到达终点!00:00
            {
                for (var i = 0; i < digits.length; i++)
                {
                    clearInterval(intervals[i]);
                    margin(i, 0);
                }
                //时间戳为0时，不执行回调函数
                if(options.startTime != '0') options.timerEnd();
                clearInterval(intervals.main);
            }

            return;
        }

        makeMovement(elem, 1);
    };

    $.extend(options, userOptions);
    createDigits(this);
    intervals.main = setInterval(function(){ moveDigit(digits.length - 1); },
        1000);
};