/**
 * Created by Dreamslink on 16/9/6.
 * 随机赠劵弹出显示特效
 */

{
    //基础判断
    function isFace(options){
        return options != '' && options != null && options != undefined;
    }

    //事件操作
    function PresentedBond(RandomlySendCoupons){
        
        /**
         * <script id="RandomlySendCoupons">
         * var RandomlySendCoupons {
         *      
         *            type : 类型 : 0 单张 | 1 多张 | 2 组合
         *        Interest : 加息劵金额
         *            Cash : 现金券金额
         *  InterestAmount : 加息劵数量
         *      CashAmount : 现金券数量
         *            Date : 有效期
         * }
         * </script>
         * 
         * PS:
         * 
         *      单张模式: 不可同时出现加息劵和现金券
         *      多张模式:不可同时出现加息劵张数和现金券张数
         *      组合模式:加息劵数量与现金券数量必须同时存在
         * 
         * */

        let
                  type = RandomlySendCoupons.type,          // 类型 : 0 单张 | 1 多张 | 2 组合
              Interest = RandomlySendCoupons.Interest,      // 加息劵金额
                  Cash = RandomlySendCoupons.Cash,          // 现金券金额
        InterestAmount = RandomlySendCoupons.InterestAmount,// 加息劵数量
            CashAmount = RandomlySendCoupons.CashAmount,    // 现金券数量

                  Date = RandomlySendCoupons.Date, // 有效期
               options = ['',''],
                  node = '';

        Cash = Math.floor(Cash);
        
        switch (type) {
            case 0:
                /**
                 * 单张模式*/
                if( isFace(Cash) && isFace(Interest) ){
                    console.log('单张模式:不可同时出现加息劵和现金券'); return;

                }else if( isFace(Interest) ){
                    options[1] = '一张 '+ Interest +' %的加息劵';
                    node = `<strong>${Interest}<em style="right:5px">%</em></strong><span style="right:20px;top:7px">加息券</span>`;
                    
                }else if( isFace(Cash) ){
                    options[1] = '一张 '+ Cash + '元现金券';
                    node = `<strong>${Cash}<em style="left:-20px">￥</em></strong><span style="right:20px;top:7px">现金券</span>`;
                    
                }else{
                    return;
                }
                options[0] = 'dan';
                break;

            case 1:
                /**
                 * 多张模式*/
                if( isFace(CashAmount) && isFace(InterestAmount) ){
                    console.log('多张模式:不可同时出现加息劵张数和现金券张数'); return;

                }else if( isFace(InterestAmount) ){
                    options[1] = '已有 '+ InterestAmount + '张加息券';
                    node = `<strong>${InterestAmount}<b>张加息券</b></strong>`;

                }else if( isFace(CashAmount) ){
                    options[1] = '已有 '+ CashAmount + '张现金券';
                    node = `<strong>${CashAmount}<b>张现金券</b></strong>`;

                }else{
                    return;
                }
                options[0] = 'duo';
                break;

            case 2:
                /**
                 * 组合模式*/
                if( isFace(CashAmount) && isFace(InterestAmount) ){
                    node = `
                          <strong>${InterestAmount}<b>张<br>加息券</b></strong><span>+</span><strong>${CashAmount}<b>张<br>现金券</b></strong>
                    `;
                    options[1] = '已有 '+ InterestAmount + '张加息券 和 ' + CashAmount + '张现金券';

                }else {
                    console.log('组合模式:加息劵数量与现金券数量必须同时存在'); return;
                }

                options[0] = 'zhu';
                break;
            default:
                break;
        }


        let __FILE__, scripts = document.getElementsByTagName("script");
            __FILE__ = scripts[scripts.length - 1].getAttribute("src").split('/static/')[0];


        let html = `
            <!--随机赠劵-->
            <style class="RandomlySendCoupons" type="text/css">
                .RandomlySendCoupons{opacity:0;width:400px;height:200px;position:fixed;right:0;top:80px;z-index:999;-webkit-border-radius:100px 0 0 100px;-moz-border-radius:100px 0 0 100px;border-radius:100px 0 0 100px;;background:rgba(56,192,255,0.2);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#3338c0ff,endColorstr=#3338c0ff)}
                .RandomlySendCoupons .SendCoupons-info{width:400px;height:200px;position:relative;overflow:hidden;}
                .RandomlySendCoupons .SendCoupons-info .SendCoupons-Off{position:absolute;top:50%;left:35px;margin-top:-20px;width:40px;height:40px;cursor:pointer;background:#fff url("+__FILE__+"tatic/images/v3/builtv3/member/alert-Off.png) center no-repeat;-webkit-border-radius: 50%;-moz-border-radius: 50%;border-radius: 50%;}
                .RandomlySendCoupons .SendCoupons-info .SendCoupons-img.dan,.RandomlySendCoupons .SendCoupons-info p.dan{width:240px;height:100px;position:relative;margin:20px 0 0 119px;overflow:hidden;background:url(http://${__FILE__}/static/images/v3/builtv3/member/alert-1.png) center no-repeat}
                .RandomlySendCoupons .SendCoupons-info .SendCoupons-img.dan .SendCoupons-Coupons{position:relative;width:200px;height:60px;margin:5px auto 0;}
                .RandomlySendCoupons .SendCoupons-info .SendCoupons-img.dan label{position:absolute;bottom:0;left:0;width:100%;line-height:30px;text-align:center;color:#fff;font-size:12px;}
                .RandomlySendCoupons .SendCoupons-info .SendCoupons-img.dan span{position:absolute;width:10px;font-size:15px;display:block;color:#fff;writing-mode:tb-rl;letter-spacing:1px}
                .RandomlySendCoupons .SendCoupons-info .SendCoupons-img.dan strong{width:120px;font-size:56px;line-height:60px;margin-left:30px;display:block;position:relative;color:#fff;text-align:center;letter-spacing:-6px}
                .RandomlySendCoupons .SendCoupons-info .SendCoupons-img.dan em{position:absolute;font-size:24px;color:#fff;top:-15px}
                .RandomlySendCoupons .SendCoupons-info p.dan{height:50px;background:none;font-size:16px;color:#666666}

                .RandomlySendCoupons .SendCoupons-info .SendCoupons-img.duo,.RandomlySendCoupons .SendCoupons-info p.duo {width:261px;position:relative;height:130px;margin:10px 0 0 110px;background:url(http://${__FILE__}/static/images/v3/builtv3/member/alert-2.png) center no-repeat}
                .RandomlySendCoupons .SendCoupons-info .SendCoupons-img.duo .SendCoupons-Coupons{position:relative;width:90%;height:130px;margin-left:10%;overflow:Hidden}
                .RandomlySendCoupons .SendCoupons-info .SendCoupons-img.duo strong{font-size:56px;width:100%;margin:20px 0 0 0;text-align: center;line-height:55px;display:block;color:#fff;}
                .RandomlySendCoupons .SendCoupons-info .SendCoupons-img.duo strong b{font-size:24px;margin-left:5px;}
                .RandomlySendCoupons .SendCoupons-info .SendCoupons-img.duo label{ position:absolute;bottom:15px;left:10%;width:90%;line-height:30px;text-align:center;color:#fff;font-size:12px; }
                .RandomlySendCoupons .SendCoupons-info p.duo{width:261px;background:none;font-size:14px;margin-top:6px;}
                
                .RandomlySendCoupons .SendCoupons-info .SendCoupons-img.zhu,.RandomlySendCoupons .SendCoupons-info p.zhu {width:261px;position:relative;height:130px;overflo:hidden;margin:10px 0 0 110px;background:url("+__FILE__+"/static/images/v3/builtv3/member/alert-2.png) center no-repeat}
                .RandomlySendCoupons .SendCoupons-info .SendCoupons-img.zhu .SendCoupons-Coupons{position:relative;width:90%;height:130px;margin-left:10%;overflow:Hidden;text-align:center;padding-top:10px}
                .RandomlySendCoupons .SendCoupons-info .SendCoupons-img.zhu strong {font-size:56px;color:#fff;}
                .RandomlySendCoupons .SendCoupons-info .SendCoupons-img.zhu span {font-size:30px;color:#fff;display:inline-block;vertical-align:middle;margin:-35px 10px 0 10px}
                .RandomlySendCoupons .SendCoupons-info .SendCoupons-img.zhu strong b{display:inline-block;vertical-align: middle;font-size:14px;line-height:25px;margin:-10px 0 0 5px;text-align:left}
                .RandomlySendCoupons .SendCoupons-info .SendCoupons-img.zhu label{ position:absolute;bottom:15px;left:10%;width:90%;line-height:30px;text-align:center;color:#fff;font-size:12px; }
                .RandomlySendCoupons .SendCoupons-info p.zhu{width:261px;background:none;font-size:14px;margin-top:6px;}
            </style>
            
            <div class="RandomlySendCoupons">
                <div class="SendCoupons-info">
                     <div class="SendCoupons-Off">&nbsp;</div>
                     <div class="SendCoupons-img ${options[0]}">
                        <div class="SendCoupons-Coupons">
                            ${node}
                        </div>
                        <label>有效期：${Date}</label>
                     </div>
                     <p class="${options[0]}">${options[1]} 已放入您的账户，请尽快使用哦～</p>
                </div>
            </div>
        `;

        $('body').append(html);


        /**
         * 显示/关闭*/
        $('.RandomlySendCoupons').stop(true,false).animate({opacity:1},1000,function(){
            //显示后 6秒 消失
            setTimeout(function () {
                $('.RandomlySendCoupons').stop(true,false).animate({width:0},1000,function(){ $(this).remove() })
            },6000);
        });

        $('.SendCoupons-Off').on('click',function(){
            $('.RandomlySendCoupons').stop(true,false).animate({width:0},1000,function(){
                $(this).remove();
            })
        });



    }

    //实例对象
    $(function(){
        if($('#RandomlySendCoupons')[0]) PresentedBond(RandomlySendCoupons);
    })
}