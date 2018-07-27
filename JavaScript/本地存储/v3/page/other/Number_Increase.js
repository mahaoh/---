/**
 * Created by Dreamslink on 16/7/11.
 * 数据从零增加特效
 * 
 */

{
    function Strings(value){
        return value.split('.')[0]
    }

    function Number_Increase(id) {

        let str = typeof id.data('floor') == 'string' ? parseInt(id.data('floor').replace(/,/g,'')) : id.data('floor'),
            soTime = 0,time,so=0;

        time = setInterval(function () {
            so = soTime;
            id.html(Strings(so.toLocaleString()));
            if(soTime >= str) {
                id.html(Strings(str.toLocaleString()));
                clearInterval(time);
            }
            soTime += Math.floor(str / 80);
        },10);

    }
    
    module.exports = Number_Increase;
    
}