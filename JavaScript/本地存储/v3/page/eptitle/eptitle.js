/**
 *
 * Created by Dreamslink on 16/5/25.
 * 小图标信息提示浮层
 *
 */

function client(e,way){
    let that = $('#tooltip'),
        clientX = e.clientX,
        window_width = $(window).width(),
        window_height = $(window).height(),

        Wth = that.outerWidth(true),
        Hth = that.outerHeight(true),

        top = e.pageY,
        left = e.pageX;

    //靠左显示
    if( window_width-clientX < 300 ){
        left = left - Wth - 10;
        //靠右显示
    }else if(clientX < 300){
        left = left + 10;
    }else{
        left = left + 10;
    }

    //上,中,下
    switch(way){
        case 'top':
            top = top - Hth;
            break;
        case 'center':
            top = top - parseInt(Hth/2);
            break;
        default:
            top = top + Hth;
            break;
    }

    return `left:${left}px;top:${top}px;`
}

function eptitle(id, way) {

    //鼠标进入
    $(document).off('mouseover',id).on('mouseover',id,function(e){

        let tooltip = `
            <style class="tooltip" type="text/css">
            #tooltip{position:absolute;padding:5px 10px;color:#f56b0f;border:1px solid #E8E8E8;background:#fff;-webkit-box-shadow: 3px 3px 3px #ccc;-moz-box-shadow: 3px 3px 3px #ccc;box-shadow: 3px 3px 3px #ccc;border-radius: 5px;z-index:100;}
            </style>
        `;

        let title = this.title || $(this).data('title');

        tooltip += "<div id='tooltip' class='tooltip'>" + title + "<\/div>"; //创建 div 元素 文字提示

        if(!$('.tooltip')[0] && title != '') $('body').append(tooltip);

        $('#tooltip').attr('style',client(e,way));

    });
    //鼠标停留
    $(document).off('mousemove',id).on('mousemove',id,function(e){
        $("#tooltip").attr('style',client(e,way));
    });
    //鼠标离开
    $(document).off('mouseout',id).on('mouseout',id,function(){ $('.tooltip').remove() });

}


module.exports = eptitle;