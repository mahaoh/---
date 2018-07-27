/**
 * Created by Dreamslink on 2017/2/9.
 * 抽奖特效-九宫格
 */

{
    /**

     重点样式需求说明：

     .active    位置移动焦点

     模板示例：

     <div id="lottery">
         <dl>
             <dd class="lottery-unit lottery-unit-0"></dd>
             <dd class="lottery-unit lottery-unit-1"></dd>
             <dd class="lottery-unit lottery-unit-2"></dd>
         </dl>
         <dl>
             <dd class="lottery-unit lottery-unit-7"></dd>
             <dd class="lottery-units"><a href="javascript:;">抽取<span>1</span>次</a></dd>
             <dd class="lottery-unit lottery-unit-3"></dd>
         </dl>
         <dl>
             <dd class="lottery-unit lottery-unit-6"></dd>
             <dd class="lottery-unit lottery-unit-5"></dd>
             <dd class="lottery-unit lottery-unit-4"></dd>
         </dl>
     </div>

     样式位置图形：

     0 → 1 → 2
     ↑       ↓
     7 → K → 3
     ↑       ↓
     6 → 5 → 4


     参数：

     lottery({
        ...
     })

     重点参数：
     ID                            // 父元素，类型：$()
     button                        // 点击按钮框，类型: $()
     type                          // AJAX 传输方式 GET / POST
     url                           // AJAX 链接地址
     data                          // AJAX 传输值
     impose                        // AJAX 如果出现次数限制，则该值必须为 true
     error(but)                    // AJAX 错误回调函数  but : 防重复 ，只能在末尾写成 but.data(but.attr('class'),true);
     success(data,rolls,but)       // AJAX 回调函数
        data : AJAX接收的参数
        rolls(Booleans,object) : 最终中奖位置 0-7 , 第二个参数是特效结束时的回调函数
        but : 防重复：程序内设置点击后事件将锁定，需要在合适位置开放点击，写成 but.data(but.attr('class'),true);

        PS:由于有防重复限制，

     以下默认无需改动：
     index : -1     // 当前转动到哪个位置，起点位置
     count : 0      // 总共有多少个位置
     timer : 0      // setTimeout的ID，用clearTimeout清除
     speed : 20     // 初始转动速度
     times : 0      // 转动次数
     cycle : 50     // 转动基本次数：即至少需要转动多少次再进入抽奖环节
     prize : -1     // 中奖位置

     * */




    let that;

    function lottery(defaults,options){

        if(typeof defaults === 'object'){
            options = defaults;
            defaults = undefined;
        }

        that = this;
        that.options = options = options || {};

        that.options.index = -1;     // 当前转动到哪个位置，起点位置
        that.options.count = 0;      // 总共有多少个位置
        that.options.timer = 0;      // setTimeout的ID，用clearTimeout清除
        that.options.speed = 20;     // 初始转动速度
        that.options.times = 0;      // 转动次数
        that.options.cycle = 50;     // 转动基本次数：即至少需要转动多少次再进入抽奖环节
        that.options.prize = -1;     // 中奖位置

        that.init();
    }

    lottery.prototype = {

        init:function(){
            let optinos = that.options;

            if (optinos.ID.find(".lottery-unit").length>0) {
                var $units = optinos.ID.find(".lottery-unit");
                optinos.count = $units.length;
                optinos.ID.find(".lottery-unit-"+optinos.index).addClass("active");
            }

            that.clicks();
        },

        roll:function(){

            let
                options = that.options,
                  index = options.index,
                  count = options.count;

            options.ID.find(".lottery-unit-"+index).removeClass("active");
            index += 1;
            if (index>count-1) index = 0;
            options.ID.find(".lottery-unit-"+index).addClass("active");
            options.index=index;
            return false;
        },

        stop:function(index){
            that.options.prize=index;
            return false;
        },

        rolls(data,obj){

            let options = that.options;
            options.times += 1;
            that.roll();//转动过程调用的是that的roll方法，这里是第一次调用初始化
            if (options.times > options.cycle+10 && options.prize==options.index) {

                clearTimeout(options.timer);
                options.prize=-1;
                options.times=0;
                options.speed=20;//每次结束初始化开始速度
                //结束时执行回执函数
                obj();

            }else{

                if (options.times<options.cycle) {

                    options.speed -= 10;
                }else if(options.times==options.cycle) {

                    options.prize = data;
                }else{

                    if (options.times > options.cycle+10 && ((options.prize==0 && options.index==7) || options.prize==options.index+1)) options.speed += 110; else options.speed += 20;
                }

                if (options.speed<40) options.speed=40;

                options.timer = setTimeout(function(){ that.rolls(data,obj) },options.speed);//循环调用
            }
            return false;
        },

        clicks:function(){

                let options = that.options;

                options.button.data(options.button.attr('class'),true);

                options.button.click(function(){

                    //检查是否登录
                    if(parseInt($('#isLogin').val()) != 1) { $('.login').click(); return; }

                    if(options.button.data(options.button.attr('class'))){
                        $.ajax({
                            type:options.type,
                            url:options.url,
                            data:options.data,
                            dataType:'json',
                            async:'false',
                            success:function(data){

                                options.success(data,that.rolls,options.button);

                            },
                            error:function(){
                                options.error(options.button);
                            }
                        });
                    }

                    options.button.data(options.button.attr('class'),false);

                });

        }

    };


    module.exports = function(defaults,options){
        return new lottery(defaults,options);
    };

}
