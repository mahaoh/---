/**
 * Created by Dreamslink on 2017/3/14.
 * 盈计划列表
 */

{
    let profit_list_page = '';
    $.ajax({
        type:'POST',
        url:'/plan/json',
        data:`action=plans`,
        dataType:'json',
        async:'false',
        success:function(data){
            if(data.code === '00000') {

                    let list = data.data.list;

                    if(list.length === 0) { return '<p class="list-center">暂无项目</p>'; }

                    for(let i=0; i < list.length; i++) {

                        let xinshou = parseFloat(list[i].is_novice) === 0 ? '' : 'xinshou';
                        let action = parseFloat(list[i].is_over) === 1 ? `<a class="did" href="/plan/detail/${list[i].id}">已抢完</a>` : `<a class="${xinshou}" href="/plan/detail/${list[i].id}">马上抢购</a>`;
                        let newbie = parseFloat(list[i].is_novice) === 0 ? '' : 'newbie';
                        let em = list[i].inrate === '' ? '' : `<em>+${parseFloat(list[i].inrate)}</em>`;

                        profit_list_page += `
                            <div invest-item="off" class="invest-item ${newbie}">
                                <div class="click">${list[i].tips}</div>

                                <label class="type">&nbsp;</label>
                                <label class="category">&nbsp;</label>

                                <div class="invest-title">
                                    <h3><a href="javascript:">${list[i].plan_name}</a><strong>${list[i].mtd_cde_desc}</strong></h3>
                                </div>

                                <div class="invest-info">

                                    <div class="message">
                                        <dl>
                                            <dd class="first">
                                                <label><strong>${list[i].apr}</strong>% ${em}</label>
                                                <span>年化收益率</span>
                                            </dd>
                                            <dd class="child">
                                                <label><strong>${list[i].limit}</strong>个月</label>
                                                <span>投资期限</span>
                                            </dd>
                                            <dd class="last">
                                                <label><strong>${list[i].other}</strong>元</label>
                                                <span>剩余金额</span>
                                            </dd>
                                        </dl>
                                    </div>

                                    <div class="submit">
                                        <span class="action">${action}</span>
                                        <a href="javascript:;" 
                                            class="cal"
                                            data-alert="modal-sum" 
                                            data-count-key=""                        
                                            data-count-limit="${parseFloat(list[i].limit)}个月"    
                                            data-count_income="${parseFloat(list[i].each_income)}"   
                                            data-count-apr="${parseFloat(list[i].apr)}"              
                                            data-amount="10000"                        
                                            data-rates="${parseFloat(list[i].inrate)}"                
                                        ></a>
                                    </div>

                                </div>
                            </div>
                        `;
                    }

                $('.invest-profit-list').html(profit_list_page);
            }
        }
    });
}
