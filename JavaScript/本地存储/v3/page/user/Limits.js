/**
 * Created by Dreamslink on 16/6/29.
 * 金额输入限制规则
 */


module.exports = function (options) {

        if(typeof options != 'object') return;

        /**
         * value 金额
         * max   最大可输入长度
         * */
        let
            value = options.value,
            max = options.max,

            //基础验证
            reNum = /^[0-9]+$/;

        if(value == '' || value == undefined) return 0;

        //如果输入内容不符合条件,则删除不符合条件的内容
        if (!reNum.test(value)) {
            return value.substr(0, value.length-1);

        //如果输入长度大于最大可输入长度,则返回最大可输入的内容
        } else if (value.length > max) {
            return value.substr(0, max);

        //当输入长度大于 2 时,如果首位是 0 ,则删除首位的 0
        } else if (value.length >= 2) {
            if (value.slice(0, 1) == 0) return value.substr(1); else return value;

        } else {

            return value;

        }

};



