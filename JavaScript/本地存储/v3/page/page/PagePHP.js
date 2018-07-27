/**
 * Created by Dreamslink on 16/6/30.
 * PHP分页特效
 */

/*
 * 本插件为分页特效，主要适用于 PHP 异步加载，调用函数直接打印所在位置
 *
 * 使用提示：
 * ===========================================

 <div id="page-PHP" class="page-nav">
     <script>
         var pageurl = '';//链接
         var pagepre = parseInt('1');//当前页码
         var pagecount  = parseInt('5');//总页数
         var numsize = 10;//中间显示页码数
         var total = 10;//总条数
     </script>
 </div>

 * ===========================================
 */

/**
 * pagepre      当前页码
 * pagecount    总页数
 * pageurl      链接
 * numsize      显示中间页码数量
 * total        数据总条数
 * */
function pagePHP(pagepre ,pagecount, pageurl , numsize , total){
    var lastpage = null;
    var firstpage = null;
    var size = parseInt((numsize-1)/2);
    var pagetext = '';

    if(pagepre <= size ){
        firstpage = 1;
        lastpage = numsize;
    }else{
        firstpage = pagepre-size;
        lastpage =  pagepre+size;
    }
    if( lastpage>pagecount ){
        lastpage = pagecount;
    }
    if( pagecount-pagepre<=size ){
        firstpage = pagecount-numsize+1;
        lastpage = pagecount;
    }
    if( firstpage<1 ){
        firstpage = 1;
    }
    var pre_page = pageurl +  parseInt(pagepre-1);
    var nex_page = pageurl +  parseInt(pagepre+1);
    pagetext += '<div class="total">共 '+total+' 条</div>';
    pagetext += (pagepre!=1) ? "<a class='minPage' href='" +pageurl+ "1" + "'>首页</a>":"<a href='javascript:;' class='minPage disabled'>首页</a>";
    pagetext += (pagepre!=1) ? "<a href='"+pre_page+"' class='prev'><</a>":"<a href='javascript:;' class='prev disabled'><</a>";
    for(var i=firstpage;i<=lastpage;i++){
        if( i==pagepre ){
            pagetext += "<a href='"+pageurl+i+"' class='current'>" + i + "</a>";
        }else{
            pagetext += "<a href='"+pageurl+i+"'>"+i+"</a>";
        }

    }
    pagetext += (pagepre!=pagecount) ? "<a class='next' href='"+nex_page+"' class='next'>></a>":"<a href='javascript:;' class='next disabled'>></a>";
    pagetext += (pagepre!=pagecount) ? "<a class='maxPage' href='" +pageurl + pagecount + "' >末页</a>":"<a href='javascript:;' class='maxPage disabled' >末页</a>";
    pagetext += '<div class="totalPage">共 '+pagecount+' 页</div>';
    return pagetext;

}

$(function(){
    if ($('#page-PHP')[0]) $("#page-PHP").html(pagePHP(pagepre, pagecount, pageurl, numsize ,total));
});
