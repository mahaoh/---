/**
 * Created by Dreamslink on 16/6/24.
 * 弹窗初始化内容框架
 */

{
    let that;

    function CPM(defaults,options){

        if(typeof defaults === 'object'){
            options = defaults;
            defaults = undefined;
        }

        that = this;
        that.options = options = options || {};
        /**
         * title        注释以及标题 ( String )
         * titleCss     标题样式修改 ( Object )
         * titleClose   关闭按钮开关 ( Booleans )
         * ID           弹窗父元素  ( Object )
         * width        弹窗宽度  ( Number )
         * height       弹窗高度  ( Number )
         * pick         默认模块添加  ( [] )
         * action       表单提交地址 ( String )
         * culling      函数,可在其中添加任意 HTML (该函数只能添加 HTML,需要返回字符串)
         * success      函数,为添加的HTML增加处理事件
         * */
        that.init();

    }

    CPM.prototype = {
        init: function(){

            var snippet='';
            // culling 为函数时,可在其中添加任意 HTML; PS : 该函数只能添加 HTML;
            if(typeof that.options.culling === 'function'){
                snippet = that.options.culling();
            }
            // pick 为数组时,添加对应默认模块
            if(typeof that.options.pick === 'object'){
                for(let i=0;i<that.options.pick.length;i++){
                    snippet += that.picks(pick[i]);
                }
            }

            snippet = snippet == undefined ? '' : snippet;

            $('body').append(that.Basis(snippet));
            //默认模块事件
            that.qits();
            //实例事件
            that.BasisMent();

        },
        Basis: function(content){
            var
                options = that.options,
                ID = options.ID.selector.replace(/[#]/g,''),
                action = options.action == undefined ? '' : options.action,
                wth = `width:${options.width}px;margin-left:-${parseInt(Number(options.width)/2)}px;`,
                hth = `height:${options.height}px;margin-top:-${parseInt(Number(options.height)/2)}px;`;

            //底层HTML
            var snippet = `
                        <form id="${ID}" action="${action}" class="Alert" style="display: block" method="post">
                            <!--${options.title}-->
                            <div class="back"></div>
                            <div id="AlertFather" class="father" style="${wth+hth}">
                                <div id="AlertContent" class="Content" style="height:${options.height}px">
                                    <div class="ther-header" style="${that.titleCss(options.titleCss)}">${options.title}<em class="therOff" id="clear"></em></div>
                                    <div class="ther-body">
                                        ${content}
                                    </div>
                                </div>
                            </div>
                        </form>
                    `;

            return snippet;
        },
        picks: function(culling) {

            switch (culling){
                case 1 :
                    return '';
                    break;
                case 2 :
                    return '';
                    break;
                default:
                    break;
            }

        },
        BasisMent: function(){
            $.isFunction(that.options.success) ? that.options.success() : '';
        },
        titleCss: function(css){
            //样式格式设置
            let Css = '',titleCss = css == undefined ? {} : css;
            $.each(titleCss,function(i,n){
                Css += `${i}:${n};`;
            });
            return Css;
        },
        qits: function(){
            var options = that.options;

            //关闭按钮(删除)
            $('em.therOff').off('click').on('click', function () { $(this).parents(options.ID.selector).remove() });
            //激活/关闭,基础按钮功能
            if(options.titleClose == false){ $('em.therOff').remove() }
        }
    };

    module.exports = function(defaults,options){
        return new CPM(defaults,options);
    };

}

