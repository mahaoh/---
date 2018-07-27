/**
 *
 * Created by Dreamslink on 16/5/25.
 * 基础校验规则算法(正则)
 *
 */

// 判断正则 高级验证
let imts = {
    user: /^([a-zA-Z0-9_]|[\u4e00-\u9fa5]){2,15}$/,  //用户名正则
    email: /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/,  //邮箱正则
    phone: /^(13[0-9]|16[6]|19[9]|15[012356789]|17[0-9]|18[0-9]|14[57])\d{8}$|^170[0125789]\d{7}$/,  //手机正则
    password:/^\d{8,16}$/,//普通密码正则
    // type 0 验证所以  1 数字+字母  2 数字+特殊字符  3 字母+特殊字符 ; (特殊密码校验，适用于注册密码)
    validate_password: function (str, type) {
        var Errors = new Array("true", "密码必须含有数字", "密码必须含有字母", "密码必须含有特殊字符", "密码不能为空", "密码包含非法字符", "密码校验类型不规范");
        var numasc = 0;
        var charasc = 0;
        var otherasc = 0;
        if (0 == str.length) {
            return Errors[4];
            //      return "密码不能为空";
        } else {
            if (0 == type.length) {
                type = 0;
            }
            for (var i = 0; i < str.length; i++) {
                var asciiNumber = str.substr(i, 1).charCodeAt();
                //alert(asciiNumber);
                if (asciiNumber >= 48 && asciiNumber <= 57) {
                    if (0 == type || 1 == type || 2 == type) {
                        numasc += 1;
                    }
                }
                if ((asciiNumber >= 65 && asciiNumber <= 90) || (asciiNumber >= 97 && asciiNumber <= 122)) {
                    if (0 == type || 1 == type || 3 == type) {
                        charasc += 1;
                    }
                }
                if ((asciiNumber >= 33 && asciiNumber <= 47) || (asciiNumber >= 58 && asciiNumber <= 64) || (asciiNumber >= 91 && asciiNumber <= 96) || (asciiNumber >= 123 && asciiNumber <= 126)) {
                    if (0 == type || 2 == type || 3 == type) {
                        otherasc += 1;
                    }
                }
                if ((0 == type) && (asciiNumber < 33 || asciiNumber > 126)) {
                    return Errors[5];
                } else if ((1 == type) && (asciiNumber < 48 || asciiNumber > 122 || (asciiNumber > 57 && asciiNumber < 65) || (asciiNumber > 90 && asciiNumber < 97))) {
                    return Errors[5];
                } else if ((2 == type) && (asciiNumber < 33 || asciiNumber > 126 || (asciiNumber > 64 && asciiNumber < 91) || (asciiNumber > 96 && asciiNumber < 123))) {
                    return Errors[5];
                } else if ((3 == type) && (asciiNumber < 33 || asciiNumber > 126 || (asciiNumber > 47 && asciiNumber < 58))) {
                    return Errors[5];
                }
            }
            if (0 == type) {
                if (0 == numasc) {
                    return Errors[1];
                    //return "密码必须含有数字";
                } else if (0 == charasc) {
                    return Errors[2];
                    //return "密码必须含有字母";
                } else if (0 == otherasc) {
                    return Errors[3];
                    //return "密码必须含有特殊字符";
                } else {
                    return Errors[0];
                }
            } else if (1 == type) {
                if (0 == numasc) {
                    return Errors[1];
                    //return "密码必须含有数字";
                } else if (0 == charasc) {
                    return Errors[2];
                    //return "密码必须含有字母";
                } else {
                    return Errors[0];
                }
            } else if (2 == type) {
                if (0 == numasc) {
                    return Errors[1];
                    //return "密码必须含有数字";
                } else if (0 == otherasc) {
                    return Errors[3];
                    //return "密码必须含有特殊字符";
                } else {
                    return Errors[0];
                }
            } else if (3 == type) {
                if (0 == charasc) {
                    return Errors[2];
                    //return "密码必须含有字母";
                } else if (0 == otherasc) {
                    return Errors[3];
                    //return "密码必须含有特殊字符";
                } else {
                    return Errors[0];
                }
            } else {
                return Errors[6];
                //return "校验类型不规范";
            }
        }
    }
};

module.exports = imts;