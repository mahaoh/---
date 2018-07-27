/**
 * Created by Dreamslink on 16/6/19.
 * 用户中心零散代码处理
 */

require('./page/user/buttonColor');
let CPM = require('./page/alert/init');

/**
 * H码兑换 弹窗
 * */
{
    let
        Text = $('#exchange-text'),
        Submit = $('#exchange-submit'),
        Error = $('#exchange-error');

    /*弹窗事件*/
    function OptionCase(data,text){
        CPM({
            title: 'H码兑换',
            ID: $('#exchange-alert-H'),
            width: 580,
            height: 370,
            culling: function () {
                let html = `
                <style type="text/css">
                    #exchange-alert-H .exchange-alert-text{width:90%;margin:35px auto 0;}
                    #exchange-alert-H .exchange-alert-text label{display:block;font-size:24px;text-align:center;line-height:60px;margin:20px 0}
                    #exchange-alert-H .exchange-alert-text p{font-size:16px;color:#999999;line-height:40px}
                    #exchange-alert-H .exchange-alert-button{width:90%;margin:20px auto 0;text-align: center}
                    #exchange-alert-H .exchange-alert-button a{display:inline-block;color:#fff;background:#38c0ff;font-size:16px;padding:10px 0;width:170px;margin:10px 10px}
                    #exchange-alert-H .exchange-alert-button a.exchange-alert-hide{color:#38c0ff;background:none;border:1px solid #38c0ff}
                    
                </style>
                <div class="exchange-alert-text">
                    <label>恭喜你成功兑换${text}！</label>
                    <p>
                       ${data.rule} <br />
                       有效期：${data.validity}
                     </p>
                </div>
                <div class="exchange-alert-button">
                    <a href="/invest/list">去使用</a>
                    <a class="exchange-alert-hide" href="javascript:">取消</a>
                </div>
            `;
                return html;
            },
            success: function () {
                $('.exchange-alert-hide').on('click',function(){ $('#exchange-alert-H').remove() })
            }
        });
    }

    /*DOM操作*/
    Text.on('focus', function () { Error.html('') });
    Submit.off('click').on('click', function () {
        let that = $(this);
        Text.attr('disabled','disabled');
        that.buttonColorOff(Error,'提交中,请稍后...');
        $.ajax({
            type:'POST',
            data:'cd_key='+Text.val(),
            url:'/account/exchange',
            dataType:'json',
            async:'false',
            success:function(data){
                Error.html('');

                let text = '',value = data.data.name || '';
                if(value.indexOf('现金券') > 0 || value.indexOf('加息劵') > 0) text = '一张'+value; else text = value;

                if(data.code == '00000') OptionCase(data.data,text); else Error.html(data.msg);
                that.buttonColorOn();Text.removeAttr('disabled');
            },
            error:function() {
                Error.html('本次提交失败,请稍后重试...');
                that.buttonColorOn();Text.removeAttr('disabled');
            }
        });

    });

}



