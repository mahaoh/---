/**
 * Created by Dreamslink on 16/5/25.
 * 剩余时间计时器(无样式开售/剩余倒计时计时器)
 *
 */

{
    /**
     * that                 //传入元素
     * openTime             //开售时间
     * remainTime           //剩余时间
     * options :            //object
     *
     * way                  //是否显示默认样式, OFF 关闭默认样式
     * remainOn(data)       //剩余时间开始,开售时间结束回调,data 返回选择器自身
     * remainOut(data)      //剩余时间结束回调,data 返回选择器自身 PS: 使用函数时，remainOn(data) 函数必须存在
     * */

    //时间类型
    function typeCut(openTime,way){

        var Cut = {
            cut:null,//时间类型
            type:''  //文字信息
        };
        //支持手动输入设置剩余时间参数,默认判断开售/剩余所剩时间设置
        switch (way) {
            case 'remainTime':
                Cut.cut = 'remainTime';
                Cut.type = '剩余时间';
                break;
            default:
                if(openTime > 0 && openTime != undefined ) {
                    Cut.cut = 'openTime';
                    Cut.type = '开售时间';
                }else{
                    Cut.cut = 'remainTime';
                    Cut.type = '剩余时间';
                }
                break;
        }

        return Cut;

    }

    //回调函数添加
    function method($this,options,way){

        switch (way) {
            //开售时间结束,剩余时间开始执行回调
            case 'remainTime':
                options.remainOn($this);
                break;
            default:
                //剩余时间结束回调
                if (typeof options.remainOut == 'function') {
                    options.remainOut($this);
                }else if(typeof options.remainOut == 'string'){
                    $this.html(options.remainOut);
                }else{
                    $this.html(`剩余时间:<em style="color:#f90">此标已过期!</em>`);
                }
                break;
        }

    }

    //倒计时处理
    function soTime($this,iTime,type,openTime,remainTime,options){
        let
            iDay, iHour, iMinute, iSecond,
            sDay = "", sTime = "";

        iDay = parseInt(iTime / 24 / 3600);
        iHour = parseInt((iTime / 3600) % 24);
        iMinute = parseInt((iTime / 60) % 60);
        iSecond = parseInt(iTime % 60);

        let cut = type; //时间类型所需参数

        //显示类型,默认显示带样式倒计时
        switch (options.way){
            case 'OFF':
                if (iDay > 0) sDay = iDay + "天";
                sTime = `<em>${sDay} ${iHour} 时 ${iMinute} 分 ${iSecond} 秒</em>`;
                break;
            default :
                if (iDay > 0) sDay = '<b>' + iDay + '</b>' + "天";
                sTime = `${cut.type} : <em>${sDay}<b>${iHour}</b>时<b>${iMinute}</b>分<b>${iSecond}</b>秒</em>`;
                break;
        }

        //如果剩余时间小于等于 0 ,则直接结束
        if( parseInt(remainTime) <= 0 ) return method($this,options);

        switch (cut.cut) {
            /**
             * 开售时间*/
            case 'openTime':

                var Time = setTimeout(function () {

                    if (iTime <= 0) {
                        //开售时间回调事件,在剩余时间开始时执行;
                        clearTimeout(Time);
                        soTime($this,parseInt(remainTime),typeCut(openTime,'remainTime'),openTime,remainTime,options);
                    }else{
                        iTime = iTime - 1;
                        soTime($this,iTime,typeCut(openTime),openTime,remainTime,options);
                    }

                }, 1000);

                break;
            /**
             * 剩余时间*/
            case 'remainTime':

                //开售时间结束,剩余时间开始时,执行函数
                if( iTime == remainTime ) method($this, options, 'remainTime');

                var Times = setTimeout(function () {

                    if (iTime <= 0) {
                        clearTimeout(Times);
                        method($this,options);
                    }else{
                        iTime = iTime - 1;
                        soTime($this,iTime,typeCut(openTime,'remainTime'),openTime,remainTime,options);
                    }

                }, 1000);

                break;
            default:break;
        }

        $this.html(sTime);

    }

    //执行程序
    function timeCountdown(that,openTime,remainTime,options) {

        let iTime = openTime == undefined ? parseInt(remainTime) : openTime == 0 ? parseInt(remainTime) : parseInt(openTime);
        soTime(that,iTime,typeCut(openTime),openTime,remainTime,options);

    }

    module.exports = timeCountdown;
}

