/**
 * Created by Dreamslink on 16/10/27.
 * 锚点/点击返回顶部
 */

/**
 * obj 传入 class / id 例如： .info / #info
 * */

let scroll = {};

/**锚点*/
scroll.anchor = function(obj) {

    let top = $(obj).offset().top;
    $('body,html').animate({scrollTop:top+'px'},1000);
};

/**点击返回顶部*/
scroll.scrollTop = function(obj) {

    $(document).off('click',obj).on('click',obj,function() {
        $('body,html').animate({scrollTop: 0}, 1000);
        return false;
    });

};

module.exports = scroll;