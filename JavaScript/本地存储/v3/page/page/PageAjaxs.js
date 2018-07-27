/**
 * ajax分页特效实例
 * */


/*
使用方法：

 PageAjaxs({
            page_ID : $(''),    // 分页ID
            html_ID : $(''),    // 替换内容ID
               type : 'POST',   // POST / GET
                url : '',       // 链接
               data : '',       // 传输内容,无需传入页数，程序自处理
            // 替换内容 function : data 为 AJAX 回调
           contents : function(data){
                let html = ``;
                return html;
           }
 });

* */

require('./PageAjax');

{
    /**
     * 通用函数*/

    let that;

    function PageAjaxs(defaults,options){

        if(typeof defaults === 'object') {
            options = defaults;
            defaults = undefined;
        }

        /**
                 page_id : // 分页ID
                 html_id : // 替换内容ID
                    type : // POST / GET
                     url : // 链接
                    data : // 传输内容,无需传入页数，程序自处理
          contents(data) : // 替换内容 function : data 为 AJAX 回调
         */

        that = this;
        that.options = options = options || {};
        that.init();
    }

    PageAjaxs.prototype = {

        init : function(){

            let options = that.options;

            let html = '';

            $.ajax({
                type:options.type,
                url:options.url,
                data:options.data + '&page=1&count=10',
                dataType:'json',
                async:'false',
                success:function(data){
                    if(data.code === options.code) {

                        // 填充内容
                        html = options.contents(data);

                        that.Page({
                            id:options.page_id,
                              total_ye:data.data.total_page,    //总页数
                            total_tiao:data.data.total_count,   //总条数
                            present_ye:data.data.current,       //当前页数
                            url:options.url,
                            data:options.data
                        },function(data){
                            html = options.contents(data);
                            options.html_id.html(html);
                        });

                        options.html_id.html(html);
                    }
                }
            });
        },

        Page : function(obj,success){
            let options = that.options;

            obj.id.PageAjax({
                pageCount: obj.total_ye,        //总页数
                    total: obj.total_tiao,      //数据总条数
                  current: obj.present_ye,      //当前页数
                backFn:function(page){

                    $.ajax({
                        type:'POST',
                        url:obj.url,
                        data:obj.data + '&page='+page,
                        dataType:'json',
                        async:'false',
                        success:function(data) {
                            if(data.code == options.code) {
                                success(data);
                            }
                        }
                    });

                }
            });
        }
    };

    module.exports = function(defaults,options){
        return new PageAjaxs(defaults,options);
    };
}
