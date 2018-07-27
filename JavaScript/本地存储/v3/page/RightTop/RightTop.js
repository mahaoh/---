/**
 * Created by Dreamslink on 16/5/25.
 * 侧边通用悬浮/返回顶部
 *
 * */

// 样式文件 WebCssMac P1

{
    let Limits = require('../user/Limits');

    let __FILE__, scripts = document.getElementsByTagName("script");
        __FILE__ = scripts[scripts.length - 1].getAttribute("src").split('/static/')[0];
    let text = {
        txt: `
            <!--返回顶部 结束-->
            <div class="back-top">
                <a class="back-kf" href="javascript:" id="kefu-im" ></a>
                <a class="back-Err" href="javascript:" ><img src="${__FILE__}/static/images/v3/backTopErr.png" /></a>
                <a class="back-js " href="javascript:" ></a>
                <!--计算器-->
                <div id="back-js">
                    <ol class="way">
                        <li class="sow">先息后本</li>
                        <li class="last">等额本息</li>
                    </ol>
                    <div class="content">
                        <dl>
                            <dt>加入金额：</dt>
                            <dd><b>元</b><input id="backJS-money" name="" type="text" placeholder="请输入拟加入金额" autocomplete="off" /></dd>
                        </dl>
                        <dl>
                            <dt>预期年化利率：</dt>
                            <dd><b>%</b><input id="backJS-rate" name="" type="text" placeholder="请输入预期年化利率" autocomplete="off" /></dd>
                        </dl>
                        <dl>
                            <dt>投资期限：</dt>
                            <dd><b>月</b><input id="backJS-limit" name="" type="text" placeholder="请输入投资期限" autocomplete="off" /></dd>
                        </dl>
                        <dl>
                            <dt></dt>
                            <dd>
                                <a id="backJS-calculate" class="sow" href="javascript:">计算</a>
                                <a id="backJS-replace" href="javascript:">重置</a>
                            </dd>
                        </dl>
                    </div>
                    <div id="backJs-error"></div>
                    <div class="text">预期收益 <b id="backJs-profit">0.00</b> 元</div>
                    <div class="modal-manFee">另收取收益10%的理财管理费约 <strong id="backJS-overhead">0.00</strong> 元</div>
                </div>
            </div>
            <!--返回顶部 结束-->
        `

    };

    //计算器显示
    let o = {
        rate: false,
        limit: false,
        way: 0
    };

    let calculator = {

        hover: function (id, error, profit, way) {

            let $this = $('.' + id),
                sow = $('#' + id),
                Time, addSow = 0;

            $this.hover(function () {
                $(this).addClass('hover');
                sow.show();
            }, function () {
                clearTimeout(Time);
                Time = setTimeout(function () {
                    if (addSow != 1) {
                        $this.removeClass('hover');
                        sow.hide();
                    }
                }, 200);
            });

            sow.hover(function () {
                addSow = 1;
            }, function () {
                addSow = 0;
                sow.hide();
                $this.removeClass('hover');
            });

        },
        rateKey: function (id, moneyId, limit, error) {
            $(moneyId).bind('keyup', function () {
                let val = $(this).val();
                $(this).val(Limits({value:val,max:8}));
            });

            $(id).bind('keyup', function () {
                let val = $(this).val(),
                    pattern = /^\d+(\.\d{1})?$/;
                if (val != '' && ( val < 0.5 || val > 25 || !pattern.test(val) )) {
                    $(error).show().html('利率精确到小数点后一位，范围0.5%-25.0%');
                    o.rate = false;
                } else {
                    $(error).hide().html('');
                    o.rate = true;
                }
            });

            $(limit).bind('keyup', function () {
                let val = $(this).val(),
                    pattern = /^[1-9]\d*$/;
                if (val != '' && ( val < 1 || val > 36 || !pattern.test(val) )) {
                    $(error).show().html('投资期限只能填写 1-36 的整数');
                    o.limit = false;
                } else {
                    $(error).hide().html('');
                    o.limit = true;
                }
            });

        },
        wayClick: function (id) {
            $(id).bind('click', function () {
                $(this).addClass('sow').siblings().removeClass('sow');
                o.way = $(this).index();
            });
        },
        replaceClick: function (id, parent, profit, overhead, error) {
            $(id).bind('click', function () {
                $(this).addClass('sow').siblings().removeClass('sow');
                $(parent + ' input').each(function () {
                    $(this).val('')
                });
                $(parent + ' select option').eq(0).attr('selected', 'selected');
                $(profit).text('0.00');
                $(overhead).text('0.00');
                $(error).hide().html('');
            });
        }

    };

    $(function () {
        //基本操作
        $('body').append(text.txt);
        let imKefu = document.getElementById("kefu-im");
            imKefu.onclick = function () {
                window.open("https://huirendai.udesk.cn/im_client/?web_plugin_id=1354&cur_url=" + location.href + "&pre_url=" + document.referrer, "", "width=780,height=560,top=200,left=350,resizable=yes");
            };

        //变量
        let _ = {
            //父元素
            parent: '#back-js',
            //加入金额
            money: '#backJS-money',
            //年化利率
            rate: '#backJS-rate',
            //投资期限
            limit: '#backJS-limit',
            //还款方式
            way: '.way li',
            //投资收益
            profit: '#backJs-profit',
            //重置
            place: '#backJS-replace',
            //错误信息
            error: '#backJs-error',
            //理财管理费用
            overhead: '#backJS-overhead'
        };
        //收益计算器显示
        calculator.hover('back-js', _.error, _.profit, _.way);
        //还款方式
        calculator.wayClick(_.way);
        //利率提示+投资期限
        calculator.rateKey(_.rate, _.money, _.limit, _.error);
        //重置
        calculator.replaceClick(_.place, _.parent, _.profit, _.overhead, _.error);
        //提交
        $('#backJS-calculate').bind('click', function () {
            $(this).addClass('sow').siblings().removeClass('sow');
            let money = Number($(_.money).val()),
                limit = Number($(_.limit).val()),
                rate = Number($(_.rate).val()) / 100,
                i = rate / 12,
                y;

            if (o.rate && o.limit) {

                if (o.way != 0) {
                    //等额本息
                    y = ( [([money * i * Math.pow((1 + i), limit)] / [Math.pow((1 + i), limit) - 1]) - (money / limit)] * limit ).toFixed(2);
                } else {
                    //先息后本 【 ( 本金 * [ 年化利率 / 100 / 12 ] ) * 投资期限 】
                    y = ( ( money * i ) * limit).toFixed(2);
                }
                $(_.profit).html(y);
                $(_.overhead).html(( Number(y) * 0.1 ).toFixed((2)));

            } else {
                if (!o.rate) $(_.error).show().html('利率精确到小数点后一位，范围0.5%-25.0%');
                if (!o.limit) $(_.error).show().html('投资期限只能填写 1-36 的整数');
            }
        });

    });

}
