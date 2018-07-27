$(function () {
    boxAlert();
    function boxAlert() {
        var alertVal=$('#isRisk').val();
        if(alertVal==1){
            Alert(1)
        }else if(alertVal==2){
            Alert(2)
        };
        function Alert(num) {
            var scripts = document.getElementsByTagName("script");
            var __FILE__ = scripts[scripts.length - 2].getAttribute("src").split('/static/')[0];
            var alertHtml=`<div class=\"back\" style=\"width: 100%;height: 100%;position: fixed;top: 0;left: 0;z-index: 101;background: rgba(0,0,0,0.6);\">
                      <div class=\"alert\" style=\" width: 336px; height: 520px;position: absolute;left: 50%;top: 50%;margin-left: -168px;margin-top: -260px;z-index: 4;\">
                           <div class=\"alert_top\" style=\"  width: 100%;height: 60px; position: relative;\">
                                <em style=\" position: absolute; background:url(${__FILE__}/static/images/v3/risk/gb.png) no-repeat center;;width: 47px; height: 45px; right: -22px; top: 0; display: inline-block;\"></em>
                           </div>
                            <div class=\"alert_center\" style=\" background: #fff url(${__FILE__}/static/images/v3/risk/alert_pc.png) no-repeat center;width: 100%; height: 170px;\"></div>
                            <div class=\"alert_title\" style=\" background: #fff;height: 188px;width: 100%;\">
                                <p style=\" width: 90%;margin: 0 auto;text-indent: 24px;font-size: 16px;color: #333333; line-height: 28px;padding-top: 16px;\">您的<span style=\" color: #fb560a;\">风险测评已过期</span>，为保证您的出借权益，请重新测评，结果即时生效预计耗时60~120秒，惠人贷承诺对测评结果保密。</p>
                            </div>
                            <div class=\"alert_bottom\" style=\" width: 100%;height: 104px; background: #fff;\">
                                <button class=\"kai\" style=\" display: block;width: 90%; margin: 0 auto;border: none;height: 44px; background:#336cd3;border-radius: 5px;color: #fff; font-size: 18px;\">开始测评</button>
                                <button class=\"zan\" style=\" display: block;width: 90%; margin: 0 auto;border: none;height: 44px;background: none;color: #999999;font-size: 18px;\">暂不测评</button>
                            </div>
                        </div>
                    </div>`;

            if(num===1){
                //首次评估
                $('body').append(alertHtml);
                $('.alert_title').children('p').html('风险测评为保障您的出借权益，建议您在惠人贷平台出借前进行风险测评，便于选择适合您风险承受能力的项目，预计耗时60~120秒，惠人贷承诺对测评结果保密。');
            }else if(num===2){
                //过期评估
                $('body').append(alertHtml);
            };

            $('.alert_top').on('click','em',function () {
                $('.back').hide();
            });
            $('.alert_bottom').on('click','.kai',function () {
                location.href='/account/risktolerance'
            });
            $('.alert_bottom').on('click','.zan',function () {
                $('.back').hide();
            });
        }
    }


})