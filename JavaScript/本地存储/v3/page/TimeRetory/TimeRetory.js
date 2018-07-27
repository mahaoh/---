/**
 * Created by Dreamslink on 2017/5/8.
 * 倒计时返回
 */

function TimeRetory(iTime,ob,text,Manner,href)
{
    /*
     * iTime  : 倒计时时间
     * ob     : 目标元素
     * text   : iTime + 倒计时替换文字
     * Manner : 回调方法 reload 直接刷新 | xinw(新网)
     * href   : Manner 为 xinw 时，需要传入跳转链接
     * */

    let iSecond,
        sDay="",
        sTime="",
        Account;

    iSecond = parseInt(iTime%60);

    sTime = sDay + iSecond + text;

    if(iTime <= 0){
        clearTimeout(Account);
        Manner = Manner == 'reload' ? location.reload() : Manner === 'xinw' ? location.href = href : history.go(-1);
    } else {
        Account = setTimeout(()=> TimeRetory(iTime,ob,text,Manner,href),1000);
    }

    iTime= iTime-1;

    ob.innerHTML = sTime;

}

module.exports = TimeRetory;