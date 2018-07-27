/**
 *
 * Created by Dreamslink on 16/5/25.
 * 卡片信息提示特效
 *
 */

{
    let UserClass = {
        name: '[invest-item="off"]',
        data: 'off',
        text: '<div class="invest-click">'
    };
    
    var Item_animtion = {
        Case: function () {
            let user = $(UserClass.name);
            user.append(UserClass.text);

            function Hegel(_this) {
                return _this.children('.click').height() + 20;
            }

            $(window).resize(function () {
                user.children('.invest-click').hide();
            });

            user.hover(function () {
                let textClass = $(this).children('.invest-click');
                let txt = $(this).children('.click').html();
                textClass.append(txt);
                textClass.css('display', 'block');

                let las = Hegel($(this));

                textClass.stop(true, true).animate({
                    'top': -las,
                    'height': las
                }, 100);

            }, function () {

                let textClass = $(this).children('.invest-click');
                textClass.html('');
                textClass.stop(true, true).animate({
                    'top': '-25px',
                    'height': '20px'
                }, 100, function () {
                    textClass.css('display', 'none');
                });

            });

        }
    };

}

module.exports = Item_animtion;