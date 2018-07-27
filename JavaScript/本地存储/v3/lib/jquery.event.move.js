//首页 banner
$(function() {

        if(window.chrome) $('.banner li').css('background-size', '100% 100%');
        $('.banner').unslider({
            arrows: true,
            fluid: true,
            dots: true
        });
        //  Find any element starting with a # in the URL
        //  And listen to any click events it fires
        $('a[href^="#"]').click(function() {
            //  Find the target element
            var target = $($(this).attr('href'));
            //  And get its position
            var pos = target.offset(); // fallback to scrolling to top || {left: 0, top: 0};
            //  jQuery will return false if there's no element
            //  and your code will throw errors if it tries to do .offset().left;
            if(pos) {
                //  Scroll the page
                $('html, body').animate({
                    scrollTop: pos.top,
                    scrollLeft: pos.left
                }, 1000);
            }
            //  Don't let them visit the url, we'll scroll you there
            return false;
        });

});

/*
* 首页弹窗活动广告
**/
(function(){
    var _ = {
        parent: '.exercise',
        ol:'.exercise-ol li',
        ul:'.ise-ul ul',
        no : '.exercise-ote .click',
        next : '.exercise-ote .next',
        prev : '.exercise-ote .prev'
    };
    var ul = $(_.ul),
        li = $(_.ul+' li'),
        ol = $(_.ol),
        next = $(_.next),
        prev = $(_.prev),
        Time,_index_ = 0,obj = 1;

    var len = li.length;

    var imgAll = ['purple', 'yellow'];

    //关闭窗口
    $(_.no).bind('click',function(){ $(_.parent).hide();clearInterval(Time); });
    //初始操作
    ul.css({position : 'relative' , left : '-100%' , width : 100 * len+'%' , overflow : 'hidden' });


    function init(index){

        var li = $(_.ul + ' li'),
            max = li.length;

        if( index >  max-3 ) index = index > max-3 ? 0 : index;
        if( obj > max-1 ) obj = obj > max-1 ? 1 : obj;
        if( obj < 0 ) obj = max-2;


        _index_ = 1;

        if( obj == 0 ){
            ul.stop(false,true).animate({left:'0%'},500,function(){
                ul.css('left','-'+ (max-2) + '00%');
                obj = max-2;
                _index_ = 0;
            });sx();
        }else if( obj > max-2 ){

            ul.stop(false,true).animate({left:'-'+ obj +'00%'},500,function(){
                ul.css('left','-100%');
                obj = max-3;
                _index_ = 0;
            });sx();
        }else{

            ul.stop(false,true).animate({left:'-'+ (index+1) +'00%'},500,function(){
                _index_ = 0;
            });sx();
        }


        function sx(){
            next.attr('class', 'next ' + imgAll[index]);
            prev.attr('class', 'prev ' + imgAll[index]);
            $(_.no).attr('class', 'click '+ imgAll[index]);
            ol.eq(index).addClass('sow').siblings().removeClass('sow');
        }

    }

    next.bind('click',function(){ if( _index_ == 0) init(obj--); });
    prev.bind('click',function(){ if( _index_ == 0) init(obj++);  });
    ol.bind('click',function(){ obj = $(this).index()+1; init($(this).index()); });

    Time = setInterval(function () { init(obj++); },5000);

    $('.exercise-ote').parent().hover(function () {
        clearInterval(Time);
    },function(){
        Time = setInterval(function () { init(obj++); },5000);
    });


})();

/**
 *   Unslider by @idiot and @damirfoy
 *   Contributors:
 *   - @ShamoX
 *
 */

(function($, f) {
    var Unslider = function() {
        //  Object clone
        var _ = this;

        //  Set some options
        _.o = {
            speed: 500,     // animation speed, false for no transition (integer or boolean)
            delay: 3000,    // delay between slides, false for no autoplay (integer or boolean)
            init: 0,        // init delay, false for no delay (integer or boolean)
            pause: !f,      // pause on hover (boolean)
            loop: !f,       // infinitely looping (boolean)
            keys: f,        // keyboard shortcuts (boolean)
            dots: f,        // display dots pagination (boolean)
            arrows: f,      // display prev/next arrows (boolean)
            prev: '&larr;', // text or html inside prev button (string)
            next: '&rarr;', // same as for prev option
            fluid: f,       // is it a percentage width? (boolean)
            starting: f,    // invoke before animation (function with argument)
            complete: f,    // invoke after animation (function with argument)
            items: '>ul',   // slides container selector
            item: '>li',    // slidable items selector
            easing: 'swing',// easing function to use for animation
            autoplay: true  // enable autoplay on initialisation
        };

        _.init = function(el, o) {
            //  Check whether we're passing any options in to Unslider
            _.o = $.extend(_.o, o);

            _.el = el;
            _.ul = el.find(_.o.items);
            _.max = [el.outerWidth() | 0, el.outerHeight() | 0];
            _.li = _.ul.find(_.o.item).each(function(index) {
                var me = $(this),
                    width = me.outerWidth(),
                    height = me.outerHeight();

                //  Set the max values
                if (width > _.max[0]) _.max[0] = width;
                if (height > _.max[1]) _.max[1] = height;
            });


            //  Cached vars
            var o = _.o,
                ul = _.ul,
                li = _.li,
                len = li.length;

            //  Current indeed
            _.i = 0;
            _._index = 0;

            //  Set the main element
            el.css({width: _.max[0], height: li.first().outerHeight(), overflow: 'hidden'});

            //  Set the relative widths
            ul.css({position: 'relative', left: '-100%', width: (len * 100) + '%'});
            if(o.fluid) {
                li.css({'float': 'left', width: (100 / len) + '%'});
            } else {
                li.css({'float': 'left', width: (_.max[0]) + 'px'});
            }

            //  Autoslide
            o.autoplay && setTimeout(function() {
                if (o.delay | 0) {
                    _.play();

                    if (o.pause) {
                        el.on('mouseover mouseout', function(e) {
                            _.stop();
                            e.type === 'mouseout' && _.play();
                        });
                    }
                }
            }, o.init | 0);

            //  Keypresses
            if (o.keys) {
                $(document).keydown(function(e) {
                    switch(e.which) {
                        case 37:
                            _.prev(); // Left
                            break;
                        case 39:
                            _.next(); // Right
                            break;
                        case 27:
                            _.stop(); // Esc
                            break;
                    }
                });
            }

            //  Dot pagination
            o.dots && nav('dot');

            //  Arrows support
            o.arrows && nav('arrow');

            //  Patch for fluid-width sliders. Screw those guys.
            o.fluid && $(window).resize(function() {
                _.r && clearTimeout(_.r);

                _.r = setTimeout(function() {
                    var styl = {height: li.eq(_.i).outerHeight()},
                        width = el.outerWidth();

                    ul.css(styl);
                    styl['width'] = Math.min(Math.round((width / el.parent().width()) * 100), 100) + '%';
                    el.css(styl);
                    li.css({ width: width + 'px' });
                }, 50);
            }).resize();

            //  Move support
            if ($.event.special['move'] || $.Event('move')) {
                el.on('movestart', function(e) {
                    if ((e.distX > e.distY && e.distX < -e.distY) || (e.distX < e.distY && e.distX > -e.distY)) {
                        e.preventDefault();
                    }else{
                        el.data("left", _.ul.offset().left / el.width() * 100);
                    }
                }).on('move', function(e) {
                    var left = 100 * e.distX / el.width();
                    var leftDelta = 100 * e.deltaX / el.width();
                    _.ul[0].style.left = parseInt(_.ul[0].style.left.replace("%", ""))+leftDelta+"%";

                    _.ul.data("left", left);
                }).on('moveend', function(e) {
                    var left = _.ul.data("left");
                    if (Math.abs(left) > 30){
                        var i = left > 0 ? _.i-1 : _.i+1;
                        if (i < 0 || i >= len) i = _.i;
                        _.to(i);
                    }else{
                        _.to(_.i);
                    }
                });
            }



            return _;
        };

        //  Move Unslider to a slide index
        _.to = function(index, callback) {
            if (_.t) {
                _.stop();
                _.play();
            }
            var o = _.o,
                el = _.el,
                ul = _.ul,
                li = _.li,
                current = _.i,
                target = li.eq(index);

            $.isFunction(o.starting) && !callback && o.starting(el, li.eq(current));

            //  To slide or not to slide
            if ((!target.length || index < 0) && o.loop === f) return;

            //  Check if it's out of bounds
            if (!target.length || index > li.length -2 ) index = 1;
            if (index < 0) index = li.length - 2;
            if (_._index < 0) _._index = li.length - 2;
            target = li.eq(index);

            var speed = callback ? 5 : o.speed | 0,
                easing = o.easing,
                obj = {height: target.outerHeight()};

            if(ul[0]){


                if (!ul.queue('fx').length) {
                    //  Handle those pesky dots
                    if( index >= li.length-2 ){
                        el.find('.dot').eq(0).addClass('active').siblings().removeClass('active');
                    }else{
                        el.find('.dot').eq(index).addClass('active').siblings().removeClass('active');
                    }


                    if( index >= li.length-2 && _._index != li.length-2 ){
                        el.animate(obj, speed, easing) && ul.animate($.extend({left: '-' + Number(index+1) + '00%'}, obj), speed, easing, function(data) {
                            _.i = index;
                            ul.css('left', '-100%');
                            $.isFunction(o.complete) && !callback && o.complete(el, target);
                        });
                    }else if( _._index >= li.length-2 ){
                        el.find('.dot').eq(li.length-3).addClass('active').siblings().removeClass('active');
                        el.animate(obj, speed, easing) && ul.animate($.extend({left: '0'}, obj), speed, easing, function(data) {
                            _.i = li.length-3;
                            _._index = _.i;
                            ul.css('left', '-' + Number(li.length-2) + '00%');
                            $.isFunction(o.complete) && !callback && o.complete(el, target);
                        });
                    }else{
                        el.animate(obj, speed, easing) && ul.animate($.extend({left: '-' + Number(index+1) + '00%'}, obj), speed, easing, function(data) {
                            _.i = index;
                            $.isFunction(o.complete) && !callback && o.complete(el, target);
                        });
                    }
                }
            }

        };

        //  Autoplay functionality
        _.play = function() {
            _.t = setInterval(function() {
                _.to(_.i + 1);
            }, _.o.delay | 0);
        };

        //  Stop autoplay
        _.stop = function() {
            _.t = clearInterval(_.t);
            return _;
        };

        //  Move to previous/next slide
        _.next = function() {
            return _.stop().to(_.i + 1);
        };

        _.prev = function() {
            var t = _.i - 1; _._index = (t == _.li.length-3) ? t+1 : t;
            return _.stop().to(t);
        };

        //  Create dots and arrows
        function nav(name, html) {
            if (name == 'dot') {
                html = '<ol class="dots">';
                $.each(_.li, function(index) {
                    if($(this).attr('class') != 'chone') html += '<li class="' + (index === _.i ? name + ' active' : name) + '">' + ++index + '</li>';

                });
                html += '</ol>';

                _.el.addClass('has-' + name + 's').append(html).find('.' + name).stop(false,true).mouseover(function() {
                    var me = $(this);
                    me.hasClass('dot') ? _.stop().to(me.index()) : me.hasClass('prev') ? _.prev() : _.next();
                });
            } else {
                html = '<div class="';
                html = html + name + 's">' + html + name + ' prev" >&nbsp;</div>' + html + name + ' next">&nbsp;</div></div>';

                _.el.addClass('has-' + name + 's').append(html).find('.' + name).click(function() {
                    var me = $(this);
                    me.hasClass('dot') ? _.stop().to(me.index()) : me.hasClass('prev') ? _.prev() : _.next();
                });
            }

        }
    };

    //  Create a jQuery plugin
    $.fn.unslider = function(o) {
        var __ = this;
        var len = this.length;
        var li = __.children().children();


        if( li.length != 1 ){
            __.hover(function () { move('3%','0.7'); },function(){ move('0','0'); });
            function move(data,str){
                $('.arrows .prev').stop(true,true).animate({
                    'left':data,
                    'opacity':str
                },300);
                $('.arrows .next').stop(true,true).animate({
                    'right':data,
                    'opacity':str
                },300);
            }
            //  Enable multiple-slider support
            return this.each(function(index) {
                //  Cache a copy of $(this), so it
                var me = $(this),
                    key = 'unslider' + (len > 1 ? '-' + ++index : ''),
                    instance = (new Unslider).init(me, o);

                //  Invoke an Unslider instance
                me.data(key, instance).data('key', key);
            });
        }else{
            li.css('float', 'none');
        }

    };

    Unslider.version = "1.0.0";
})(jQuery, false);


// jquery.event.move 1.3.1
(function(a){if(typeof define==='function'&&define.amd){define(['jquery'],a)}else{a(jQuery)}})(function(h,j){var k=6,add=h.event.add,remove=h.event.remove,trigger=function(a,b,c){h.event.trigger(b,c,a)},requestFrame=(function(){return(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a,b){return window.setTimeout(function(){a()},25)})})(),ignoreTags={textarea:true,input:true,select:true,button:true},mouseevents={move:'mousemove',cancel:'mouseup dragstart',end:'mouseup'},touchevents={move:'touchmove',cancel:'touchend',end:'touchend'};function Timer(c){var d=c,active=false,running=false;function trigger(a){if(active){d();requestFrame(trigger);running=true;active=false}else{running=false}}this.kick=function(a){active=true;if(!running){trigger()}};this.end=function(a){var b=d;if(!a){return}if(!running){a()}else{d=active?function(){b();a()}:a;active=true}}}function returnTrue(){return true}function returnFalse(){return false}function preventDefault(e){e.preventDefault()}function preventIgnoreTags(e){if(ignoreTags[e.target.tagName.toLowerCase()]){return}e.preventDefault()}function isLeftButton(e){return(e.which===1&&!e.ctrlKey&&!e.altKey)}function identifiedTouch(a,b){var i,l;if(a.identifiedTouch){return a.identifiedTouch(b)}i=-1;l=a.length;while(++i<l){if(a[i].identifier===b){return a[i]}}}function changedTouch(e,a){var b=identifiedTouch(e.changedTouches,a.identifier);if(!b){return}if(b.pageX===a.pageX&&b.pageY===a.pageY){return}return b}function mousedown(e){var a;if(!isLeftButton(e)){return}a={target:e.target,startX:e.pageX,startY:e.pageY,timeStamp:e.timeStamp};add(document,mouseevents.move,mousemove,a);add(document,mouseevents.cancel,mouseend,a)}function mousemove(e){var a=e.data;checkThreshold(e,a,e,removeMouse)}function mouseend(e){removeMouse()}function removeMouse(){remove(document,mouseevents.move,mousemove);remove(document,mouseevents.cancel,mouseend)}function touchstart(e){var a,template;if(ignoreTags[e.target.tagName.toLowerCase()]){return}a=e.changedTouches[0];template={target:a.target,startX:a.pageX,startY:a.pageY,timeStamp:e.timeStamp,identifier:a.identifier};add(document,touchevents.move+'.'+a.identifier,touchmove,template);add(document,touchevents.cancel+'.'+a.identifier,touchend,template)}function touchmove(e){var a=e.data,touch=changedTouch(e,a);if(!touch){return}checkThreshold(e,a,touch,removeTouch)}function touchend(e){var a=e.data,touch=identifiedTouch(e.changedTouches,a.identifier);if(!touch){return}removeTouch(a.identifier)}function removeTouch(a){remove(document,'.'+a,touchmove);remove(document,'.'+a,touchend)}function checkThreshold(e,a,b,c){var d=b.pageX-a.startX,distY=b.pageY-a.startY;if((d*d)+(distY*distY)<(k*k)){return}triggerStart(e,a,b,d,distY,c)}function handled(){this._handled=returnTrue;return false}function flagAsHandled(e){e._handled()}function triggerStart(e,a,b,c,d,f){var g=a.target,touches,time;touches=e.targetTouches;time=e.timeStamp-a.timeStamp;a.type='movestart';a.distX=c;a.distY=d;a.deltaX=c;a.deltaY=d;a.pageX=b.pageX;a.pageY=b.pageY;a.velocityX=c/time;a.velocityY=d/time;a.targetTouches=touches;a.finger=touches?touches.length:1;a._handled=handled;a._preventTouchmoveDefault=function(){e.preventDefault()};trigger(a.target,a);f(a.identifier)}function activeMousemove(e){var a=e.data.event,timer=e.data.timer;updateEvent(a,e,e.timeStamp,timer)}function activeMouseend(e){var a=e.data.event,timer=e.data.timer;removeActiveMouse();endEvent(a,timer,function(){setTimeout(function(){remove(a.target,'click',returnFalse)},0)})}function removeActiveMouse(a){remove(document,mouseevents.move,activeMousemove);remove(document,mouseevents.end,activeMouseend)}function activeTouchmove(e){var a=e.data.event,timer=e.data.timer,touch=changedTouch(e,a);if(!touch){return}e.preventDefault();a.targetTouches=e.targetTouches;updateEvent(a,touch,e.timeStamp,timer)}function activeTouchend(e){var a=e.data.event,timer=e.data.timer,touch=identifiedTouch(e.changedTouches,a.identifier);if(!touch){return}removeActiveTouch(a);endEvent(a,timer)}function removeActiveTouch(a){remove(document,'.'+a.identifier,activeTouchmove);remove(document,'.'+a.identifier,activeTouchend)}function updateEvent(a,b,c,d){var e=c-a.timeStamp;a.type='move';a.distX=b.pageX-a.startX;a.distY=b.pageY-a.startY;a.deltaX=b.pageX-a.pageX;a.deltaY=b.pageY-a.pageY;a.velocityX=0.3*a.velocityX+0.7*a.deltaX/e;a.velocityY=0.3*a.velocityY+0.7*a.deltaY/e;a.pageX=b.pageX;a.pageY=b.pageY;d.kick()}function endEvent(a,b,c){b.end(function(){a.type='moveend';trigger(a.target,a);return c&&c()})}function setup(a,b,c){add(this,'movestart.move',flagAsHandled);return true}function teardown(a){remove(this,'dragstart drag',preventDefault);remove(this,'mousedown touchstart',preventIgnoreTags);remove(this,'movestart',flagAsHandled);return true}function addMethod(a){if(a.namespace==="move"||a.namespace==="moveend"){return}add(this,'dragstart.'+a.guid+' drag.'+a.guid,preventDefault,j,a.selector);add(this,'mousedown.'+a.guid,preventIgnoreTags,j,a.selector)}function removeMethod(a){if(a.namespace==="move"||a.namespace==="moveend"){return}remove(this,'dragstart.'+a.guid+' drag.'+a.guid);remove(this,'mousedown.'+a.guid)}h.event.special.movestart={setup:setup,teardown:teardown,add:addMethod,remove:removeMethod,_default:function(e){var b,data;if(!e._handled()){return}b={target:e.target,startX:e.startX,startY:e.startY,pageX:e.pageX,pageY:e.pageY,distX:e.distX,distY:e.distY,deltaX:e.deltaX,deltaY:e.deltaY,velocityX:e.velocityX,velocityY:e.velocityY,timeStamp:e.timeStamp,identifier:e.identifier,targetTouches:e.targetTouches,finger:e.finger};data={event:b,timer:new Timer(function(a){trigger(e.target,b)})};if(e.identifier===j){add(e.target,'click',returnFalse);add(document,mouseevents.move,activeMousemove,data);add(document,mouseevents.end,activeMouseend,data)}else{e._preventTouchmoveDefault();add(document,touchevents.move+'.'+e.identifier,activeTouchmove,data);add(document,touchevents.end+'.'+e.identifier,activeTouchend,data)}}};h.event.special.move={setup:function(){add(this,'movestart.move',h.noop)},teardown:function(){remove(this,'movestart.move',h.noop)}};h.event.special.moveend={setup:function(){add(this,'movestart.moveend',h.noop)},teardown:function(){remove(this,'movestart.moveend',h.noop)}};add(document,'mousedown.move',mousedown);add(document,'touchstart.move',touchstart);if(typeof Array.prototype.indexOf==='function'){(function(a,b){var c=["changedTouches","targetTouches"],l=c.length;while(l--){if(a.event.props.indexOf(c[l])===-1){a.event.props.push(c[l])}}})(h)}});