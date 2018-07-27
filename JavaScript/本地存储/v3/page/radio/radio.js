/**
 * 单个按钮样式
 * */

// 样式文件 WebCssMac P350

function radio(name,objLeft,objRight) {
    var id = $(name);
    if( id[0] ) {
        id.on('click',function() {
            var
                label = $(this).children('label'),
                radioId = label.attr('id'),
                input = $('#'+radioId);
            
            if ( !input.hasClass('checked') ){
                label.addClass('checked');
                input.attr('checked', 'checked');
                objLeft();
            }else{
                label.removeClass('checked');
                input.removeAttr('checked');
                objRight();
            }
        });
    }
}


module.exports = radio;