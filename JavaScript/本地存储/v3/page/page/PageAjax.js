/**
 * ajax分页特效
 * */

/*
 * 本插件为分页特效，主要适用于 Ajax 异步加载，调用函数直接打印所在位置
 *
 * 使用提示：
 * ===========================================
 $("#page-nav").PageAjax({
     pageCount : 10, //总页数
     total : 1,      //数据总条数
     current : 1,    //当前页数
     backFn : function(page){
        //page 返回当前页数
     }
 });

 <div id="page-nav" class="page-nav"></div>

 * ===========================================
 */


(function($){

    var ms = {
        init:function(obj,args){

            var
                TOTAL = args.total == '' ? 0 : args.total == undefined ? 0 : parseInt(args.total),
                PAGECOUNT = args.pageCount == '' ? 0 : args.pageCount == undefined ? 0 : args.pageCount;

            return (function(){
                ms.fillHtml(obj,{"current":1,"pageCount":PAGECOUNT,"total":TOTAL});
                ms.bindEvent(obj,args);
            })();
        },
        //填充html
        fillHtml:function(obj,args){

            let
                TOTAL = args.total == '' ? 0 : args.total == undefined ? 0 : parseInt(args.total),
                PAGECOUNT = args.pageCount == '' ? 0 : args.pageCount == undefined ? 0 : parseInt(args.pageCount),
                total = '<div class="total">共 '+TOTAL+' 条</div><a href="javascript:;" class="minPage">首页</a>',
                totalPage = '<a href="javascript:;" class="maxPage">尾页</a><div class="totalPage">共 '+PAGECOUNT+' 页</div>',

                totals = '<div class="total">共 '+TOTAL+' 条</div><a href="javascript:;" class="minPage disabled">首页</a>',
                totalPages = '<a href="javascript:;" class="maxPage disabled">尾页</a><div class="totalPage">共 '+PAGECOUNT+' 页</div>';

            return (function(){
                obj.empty();
                
                //总页数与总条数皆为空时,则直接返回;
                if(TOTAL == 0 && PAGECOUNT == 0) return obj.html('<strong>暂无数据</strong>');

                //上一页
                if(args.current > 1){
                    obj.append(total+'<a href="javascript:;" class="prev prevPage"><</a>');
                }else{
                    obj.remove('.prevPage');
                    obj.append(totals+'<a href="javascript:;" class="prev disabled"><</a>');
                }
                //中间页码
                if(args.current != 1 && args.current >= 4 && PAGECOUNT != 4){
                    obj.append('<a href="javascript:;" class="tcdNumber">'+1+'</a>');
                }
                if(args.current-2 > 2 && args.current <= PAGECOUNT && PAGECOUNT > 5){
                    obj.append('<a>...</a>');
                }
                var start = args.current -2,end = args.current+2;
                if((start > 1 && args.current < 4)||args.current == 1){
                    end++;
                }
                if(args.current > PAGECOUNT-4 && args.current >= PAGECOUNT){
                    start--;
                }
                for (;start <= end; start++) {
                    if(start <= PAGECOUNT && start >= 1){
                        if(start != args.current){
                            obj.append('<a href="javascript:;" class="tcdNumber">'+ start +'</a>');
                        }else{
                            obj.append('<a class="current">'+ start +'</span>');
                        }
                    }
                }
                if(args.current + 2 < PAGECOUNT - 1 && args.current >= 1 && PAGECOUNT > 5){
                    obj.append('<a>...</a>');
                }
                if(args.current != PAGECOUNT && args.current < PAGECOUNT -2  && PAGECOUNT != 4){
                    obj.append('<a href="javascript:;" class="tcdNumber">'+PAGECOUNT+'</a>');
                }
                //下一页
                if(args.current < PAGECOUNT){
                    obj.append('<a href="javascript:;" class="next nextPage">></a>'+totalPage);
                }else{
                    obj.remove('.nextPage');
                    obj.append('<a href="javascript:;" class="next disabled">></a>'+totalPages);
                }
            })();
        },//绑定事件
        bindEvent:function(obj,args){
            var
                TOTAL = args.total == '' ? 0 : args.total == undefined ? 0 : parseInt(args.total),
                PAGECOUNT = args.pageCount == '' ? 0 : args.pageCount == undefined ? 0 : args.pageCount;

            return (function(){
                obj.on("click","a.tcdNumber",function(){
                    var current = parseInt($(this).text());
                    ms.fillHtml(obj,{"current":current,"pageCount":PAGECOUNT,"total":TOTAL});
                    if(typeof(args.backFn)=="function"){
                        args.backFn(current);
                    }
                });
                //上一页
                obj.on("click","a.prevPage",function(){
                    var current = parseInt(obj.children("a.current").text());
                    ms.fillHtml(obj,{"current":current-1,"pageCount":PAGECOUNT,"total":TOTAL});
                    if(typeof(args.backFn)=="function"){
                        args.backFn(current-1);
                    }
                });
                //下一页
                obj.on("click","a.nextPage",function(){
                    var current = parseInt(obj.children("a.current").text());
                    ms.fillHtml(obj,{"current":current+1,"pageCount":PAGECOUNT,"total":TOTAL});
                    if(typeof(args.backFn)=="function"){
                        args.backFn(current+1);
                    }
                });
                //首页
                obj.on("click","a.minPage",function(){
                    var current = 1;
                    ms.fillHtml(obj,{"current":current,"pageCount":PAGECOUNT,"total":TOTAL});
                    if(typeof(args.backFn)=="function"){
                        args.backFn(current);
                    }
                });
                //尾页
                obj.on("click","a.maxPage",function(){
                    var current = parseInt(PAGECOUNT);
                    ms.fillHtml(obj,{"current":current,"pageCount":PAGECOUNT,"total":TOTAL});
                    if(typeof(args.backFn)=="function"){
                        args.backFn(current);
                    }
                });
            })();
        }
    };
    $.fn.PageAjax = function(options){
        var args = $.extend({
            pageCount : 10, //总页数
            total : 1,      //数据总条数
            current : 1,    //当前页数
            backFn : function(){}  //回调函数
        },options);
        ms.init(this,args);
    }
})(jQuery);

