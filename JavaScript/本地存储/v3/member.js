/**
 * Created by Dreamslink on 16/9/2.
 * 会员中心零散事件
 */

require('./page/page/PageAjax');
let scroll = require('./page/scroll/scroll');

/**
 * 我的积分 : 签到*/
{
    var XclickTime = 0;
    $('.Xclick').one('click', function () {
        var _this = $(this);
        var txt;
        if(XclickTime==0){
            $.ajax({
                type:'GET',
                url:'/account/signin',
                dataType:'json',
                async:'false',
                success: function (data) {
                    if( data.r == '00'){
                        txt = '<p id="Xclick" style="position:absolute;top:-25px;right:0;color:#ff6161;display:none">签到成功，+ '+ data.d.np +' 惠米！明天再来哦！</p>';
                    }
                    _this.parents('dl.table').find('p').remove().end().append(txt);
                    $('#Xclick').show(300).animate({'opacity':'0'},2000,function(){
                        _this.attr('class','no').html('已完成');
                    });
                    XclickTime=0;
                }
            });
        }
        XclickTime++
    });
}


/**
 * 我的积分 :  积分记录翻页(ajax)*/
{
    function Page(obj,success){
        obj.id.PageAjax({
            pageCount:obj.pageCount,//总页数
            total : obj.total,      //数据总条数
            current:obj.current,    //当前页数
            backFn:function(page){

                $.ajax({
                    type:'POST',
                    url:obj.url,
                    data:obj.data+'&page='+page,
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

    $.ajax({
        type:'POST',
        url:'/member/json',
        data:'action=point_logs&page=1',
        dataType:'json',
        async:'false',
        success:function(data) {

            if(data.code == '00000') {

                function Text(data){
                    let html = '<div class="row blue"><span class="col-3">日期</span><span class="col-3">收支</span><span class="col-3">可用积分</span><span class="col-3">说明</span></div>';
                    for(var i = 0; i<data.data.pointlogs.length; i++){
                        html += `
                                <div class="row">
                                    <span class="col-3">${data.data.pointlogs[i].create_time}</span>
                                    <span class="col-3">${data.data.pointlogs[i].type == '1' ? `<b>+${data.data.pointlogs[i].expense}</b>` : `<em>-${data.data.pointlogs[i].expense}</em>`}</span>
                                    <span class="col-3">${data.data.pointlogs[i].balance}</span>
                                    <span class="col-3">${data.data.pointlogs[i].title}</span>
                                </div>
                                `;
                    }
                    $('.page-MyIntegral').html(html);
                }
                Text(data);
                Page({
                    id:$("#page-MyIntegral"),
                    pageCount:data.totalPage,
                    total:data.count,
                    current:data.currentPage,
                    url:'/member/json',
                    data:'action=point_logs'
                },function(data){ Text(data) });
            }

        }
    });


}

/**
 * 会员权益 : 锚点*/
{
    let sole = location.hash.substring(1);
    if(sole === 'Prero') scroll.anchor('#Privilege');
}

/**
 * 会员权益 : 等级进度条*/
{
    let 
        Hworth = Math.floor($('.Hworth').text()), //成长值( 取值来自当前页面 - 我的H值(成长值) )
        IdArr = ['silver','gold','diamond'], //银牌 | 金牌 | 钻牌
        canvas = $('.Ranking strong');

    /**
     * 亮牌*/
    for(let i = 0; i <= 3; i++) {
        if(Hworth >= [2500*(i+1)+1]) {
            $('.'+IdArr[i]).addClass('show');
        }
    }

    /**
     * 进度条算法*/
    let RankingArr = [10, 36.66666, 63.33333, 90, 100], //奖杯基础区间距离
        NewArr = []; //奖杯区间距离

    //计算每个奖杯区间的距离数值
    for(let i = 0; i < RankingArr.length; i++) {
        if(i != RankingArr.length-1) NewArr[i] =  - (RankingArr[i] - RankingArr[i + 1]);
    }

    let
        //计算成长值属于是什么奖牌,每 2500 成长值升级一次,结果返回 0:铜牌 | 1:银牌 | 2:金牌 | 3:钻牌
        _Growth = Math.floor(Hworth / 2500),
        //计算成长值属于奖牌的多少份数之间, 每 100 成长值 为一份
        Copies = Hworth < 2500 ? Math.floor(Hworth / 100) : Math.floor((Hworth - _Growth * 2500) / 100);

    //计算一个单位所需距离数值(每个区间共25份)
    for(let i = 0; i < NewArr.length; i++) {
        NewArr[i] = NewArr[i] / 25;
    }

    /**
     * 添加位置 */
    if(Hworth >= 10000) {
        //重新计算成长值属于奖牌的多少份数之间, 每 100 成长值 为一份
        Copies = Math.floor((Hworth - 10000) / 100);
        canvas.stop(false,true).animate({width:RankingArr[4] + NewArr[3] * Copies +'%'},1000)
    }else{
        canvas.stop(false,true).animate({width:RankingArr[_Growth] + NewArr[_Growth] * Copies +'%'},1000);
    }

}