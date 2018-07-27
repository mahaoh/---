/**
 * Created by Dreamslink on 16/8/3.
 *
 * 键盘处理事件集合
 *
 */


{
    var keyboard = {

        /**
         * @event 回车事件 */
        onkeydown:function(obj){
            
            document.onkeydown = function(event) {

                var e = event || window.event || arguments.callee.caller.arguments[0];

                if( e && e.keyCode == 13) {
                    obj();
                }

            };
        }
        
    };
    
    module.exports = keyboard;
    
}
