/**
 *
 * Created by Dreamslink on 16/5/31.
 * 理财计算器弹出框
 *
 */

// 样式文件 WebCssMac P225

{

    let
        CPM = require('./init'),
        Limits = require('../user/Limits');
    /**
     * 代码中添加 data-alert="modal-sum" 后,计算器弹窗生效,需添加对应代码如下:
     * data-count-key       标的编号
     * data-count-limit     标的借款期限
     * data-count_income    标的每百元收益
     * data-count-apr       标的年化利率
     * data-amount          标的利率变化起始金额
     * data-rates           标的增加利率
     * */
    function cala(id,way){

        $(document).off('click',id).on('click',id, function () {

            let that = $(this),

                key = that.data('count-key') || 0,       //标的编号
                limit = that.data('count-limit') || 0,   //标的借款期限
                income = that.data('count_income') || 0, //标的每百元收益
                apr = that.data('count-apr') || 0,       //标的年化利率
                amount = that.data('amount') || 0,       //标的利率变化起始金额
                rates = that.data('rates') || 0;         //标的增加利率

            
                //参数二次处理
                apr = apr == undefined ? '0' : apr;
                limit = limit == undefined ? '0个月' : limit;
            

            CPM({
                title:'收益计算器',
                titleCss:{
                    "text-align":"left",
                    "font-size":"16px"
                },
                ID:$('#modal'),
                width:468,
                height:296,
                culling:function(){
                    var html = `
                    <div class="modalAlert">
                        <div class="modal-text">
                            <b>加入金额:</b><em>元</em>
                            <input type="text" id="modal-inp"  style="outline:none;" placeholder="请输入投资拟金额" autocomplete="off" />
                        </div>
                        <div class="modal-ll">年化利率:<strong id="modal-apr">${apr}%</strong></div>
                        <div class="modal-qx">借款期限:<strong id="modal-limit">${limit}</strong></div>
                        <div class="modal-jg">预期收益:<strong id="modal-income">0.00</strong>元</div>
                        <div class="modal-manFee">另收取收益10%的理财管理费约 <strong id="modal-overhead">0.00</strong> 元</div>
                    </div>
                    `;

                    return html;
                },
                success:function(){

                    let
                        $apr = $('#modal-apr'),              //年化利率
                        $income = $('#modal-income'),        //预期收益
                        $overhead = $('#modal-overhead');    //理财管理费

                    //留白
                    $('.ther-body').css('width', '87%');

                    $('#modal-inp').off('keyup').on('keyup',function(){
                        var that = $(this);
                        var val = Number(Limits({ value:that.val(), max:8 }));
                        that.val(val);

                        var
                            _income,_overhead,_apr,
                            lvs = ( income / apr ) * ( apr + rates ); //合并利率后的每百元收益


                        switch (way){
                            case '元':
                                    //如果 增加利率/变化起始金额 为 undefined 时,则执行新算法,否则执行基础算法
                                    if(amount == rates){
                                        _apr = apr;
                                        _income = ( (val / 100) * Number(income) ).toFixed(2);
                                    }else{
                                        //如果 输入金额 达到 变化起始金额 的标准,则更新算法,低于时执行基础算法
                                        if(val >= amount){
                                            _apr = apr + rates;
                                            _income = ( (val / 100) * Number(lvs) ).toFixed(2);
                                        }else{
                                            _apr = apr;
                                            _income = ( (val / 100) * Number(income) ).toFixed(2);
                                        }
                                    }
                                break;
                            default:
                                     _income = ( val * Number(income) ).toFixed(2);
                                break;
                        }

                        //管理费公式( 收益的10% )
                        _overhead = ( Number(_income) * 0.1 ).toFixed(2);

                        //年化利率/预期收益/管理费,更新;
                        $apr.html(_apr+'%');
                        $income.html(_income);
                        $overhead.html(_overhead);

                    });


                }
            });

        });

    }

    cala('[data-alert="modal-sum"]','元');
    cala('[data-alert="modal-list"]','份');
}



