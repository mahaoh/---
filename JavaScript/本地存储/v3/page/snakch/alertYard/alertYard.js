/**
 * Created by Dreamslink on 16/10/31.
 * 我的夺宝码
 */


{
    let CPM = require('../../alert/init');
    require('../../page/PageAjax');

    //计算附加高度
    function altitude(DataLength){

        //如果夺宝码大于 7 行，则停止增加高度，否则每多一行增加 30 高度 (每5条为一行)，最后返回增加高度
        if( Math.ceil(DataLength / 5) > 7 ) return parseInt( 7 * 35 ); else return DataLength <= 5 ? 0 :parseInt( Math.ceil(DataLength / 5) * 35 );

    }

    //分页代码
    function Page(obj,success){
        obj.id.PageAjax({
            pageCount:obj.pageCount,//总页数
            total : obj.total,      //数据总条数
            current:obj.current,    //当前页数
            backFn:function(page){

                $.ajax({
                    type:'POST',
                    url:obj.url,
                    data:obj.data + '&page='+page,
                    dataType:'json',
                    async:'false',
                    success:function(data) {
                        if(data.code == '00000') {
                            success(data);
                        }
                    }
                });

            }
        });
    }

    /**
     * 执行函数：
     * @param data  // Json 数据
     * @param type  // 分页请求数据
     * */
    function alertYard(data, type){

        let list = data.data.nums;
        //当夺宝码超出 7 行，添加滚动条
        let auto = Math.ceil(list.length / 5) > 7 ? `height:${altitude(list.length)}px;overflow:hidden` : 'overflow:hidden';

        //弹窗信息
        CPM({
            width:650,
            height:220 + altitude(list.length),
            ID:$('#snatch-record'),
            title:'夺宝码',
            culling:function(){
                let html = `
                    <style type="text/css">
                        #snatch-record #alert-SnatchRecord{width:100%;display:block;text-align:center;color:#666666;overflow:hidden;margin-top:35px;margin-bottom: -10px}
                        #snatch-record #alert-SnatchRecord label{display:block;overflow:hidden;line-height:45px;text-align:left}
                        #snatch-record #alert-SnatchRecord span{float:left;width:20%;height:35px;line-height:35px;overflow:hidden}
                        #snatch-record #alert-SnatchRecord-list-page.page-nav a{width: 24px;font-size:12px}
                        #snatch-record #alert-SnatchRecord-list-page.page-nav a.prev, 
                        #snatch-record #alert-SnatchRecord-list-page.page-nav a.next,
                        #snatch-record #alert-SnatchRecord-list-page.page-nav a.first, 
                        #snatch-record #alert-SnatchRecord-list-page.page-nav a.last{width:65px}
                        #snatch-record #alert-SnatchRecord-list-page.page-nav .total,
                        #snatch-record #alert-SnatchRecord-list-page.page-nav .totalPage{margin:0 5px}
                        
                    </style>
                    <div id="alert-SnatchRecord">
                        <label>共${data.data.total_count}个夺宝码：</label>
                        <div id="alert-SnatchRecord-nums" style="display:block;${auto}">数据加载中，请等待...</div>
                    </div>
                    <div id="alert-SnatchRecord-list-page" class="page-nav"></div>
                `;
                return html;
            },
            success:function(){

                function txt(data){
                    let txt = '';
                    for(let i = 0; i < data.data.nums.length; i++) {
                        txt += `<span>${data.data.nums[i].seize_num}</span>`
                    }
                    $('#alert-SnatchRecord-nums').html(txt);
                    if(Math.ceil(list.length / 5) < 7) $('#alert-SnatchRecord-list-page').hide();
                }
                txt(data);
                Page({
                    id:$('#alert-SnatchRecord-list-page'),
                    pageCount:data.data.total_page,//总页数
                    total:data.data.total_count,//数据总条数
                    current:data.data.current_page,//当前页数
                    url:'/seize/nums',
                    data:type
                },function(data){ txt(data) });
            }
        })

    }

    module.exports = alertYard;
}