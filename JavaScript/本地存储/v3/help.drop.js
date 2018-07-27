/**
 * Created by Dreamslink on 16/11/2.
 * 我的投资： 下拉表格
 */

{

    function colAjax(url,obj){
        var
            v ='<div class="row"><span class="col-12">',
            s='</span></div>';

        var pare = $(obj).parent().parent().next().find('.rowAjax');

        //防重复设置：如果请求返回成功，则再次打开下拉表格时，不在请求
        if(obj.data('redo') === undefined) obj.data('redo',true);

        if(obj.data('redo')){

            obj.data('redo',false);
            pare.html(v+'数据传输中，请等待...'+s);

            $.ajax({
                type:'GET',
                url:'/account/credit/detail/'+url,
                dataType:'json',
                async:'false',
                success:function(data) {
                    var num = data.length;
                    var txt = '';
                    if(num == 0){ txt+= v+'暂无数据'+s; }
                    else{
                        for(var i=0; i<num; i++) {
                            txt += `
                                <div class="row"> 
                                    <span class="col-1"> ${data[i].repaymentDate} </span> 
                                    <span class="col-1"> ${data[i].nper} </span> 
                                    <span class="col-1-05"> ${data[i].psPrcpAmt} </span> 
                                    <span class="col-1-05"> ${data[i].interest} </span> 
                                    <span class="col-1"> ${data[i].lateDays} </span> 
                                    <span class="col-1-05"> ${data[i].psOdIntAmt} </span> 
                                    <span class="col-1-05"> ${data[i].totalAmount} </span> 
                                    <span class="col-1"> - </span> 
                                    <span class="col-1"> ${data[i].state} </span> 
                                    <span class="col-1"> ${data[i].prepayment} </span> 
                                </div>
                            `;
                        }
                    }
                    pare.html(txt);
                    obj.data('redo',false);
                },
                error:function(data) {
                    pare.html(v+'数据获取失败，请重试！'+s);
                    obj.data('redo',true);
                }
            });

        }
    }


    $(function(){

        $('a.tz').unbind().bind('click',function() {

            let that = $(this),
                $parent = that.closest('.row').next();

            // 打开/关闭状态变量
            if(that.data('tzClick') == undefined) that.data('tzClick',true);

            if(that.data('tzClick')){
                $parent.slideDown();
                that.data('tzClick',false);
                that.addClass('show');
                colAjax(that.attr('data-time'), that);
            }else{
                $parent.slideUp();
                that.removeClass('show');
                that.data('tzClick',true);
            }

        });

    });
}
