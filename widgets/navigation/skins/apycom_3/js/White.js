/** jquery.color.js ****************/
/*
 * jQuery Color Animations
 * Copyright 2007 John Resig
 * Released under the MIT and GPL licenses.
 */

(function(jQuery){

	// We override the animation for all of these color styles
	jQuery.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color', 'outlineColor'], function(i,attr){
		jQuery.fx.step[attr] = function(fx){
			if ( fx.state == 0 ) {
				fx.start = getColor( fx.elem, attr );
				fx.end = getRGB( fx.end );
			}
            if ( fx.start )
                fx.elem.style[attr] = "rgb(" + [
                    Math.max(Math.min( parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0]), 255), 0),
                    Math.max(Math.min( parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1]), 255), 0),
                    Math.max(Math.min( parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2]), 255), 0)
                ].join(",") + ")";
		}
	});

	// Color Conversion functions from highlightFade
	// By Blair Mitchelmore
	// http://jquery.offput.ca/highlightFade/

	// Parse strings looking for color tuples [255,255,255]
	function getRGB(color) {
		var result;

		// Check if we're already dealing with an array of colors
		if ( color && color.constructor == Array && color.length == 3 )
			return color;

		// Look for rgb(num,num,num)
		if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
			return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];

		// Look for rgb(num%,num%,num%)
		if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
			return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];

		// Look for #a0b1c2
		if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
			return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];

		// Look for #fff
		if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
			return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];

		// Otherwise, we're most likely dealing with a named color
		return colors[jQuery.trim(color).toLowerCase()];
	}
	
	function getColor(elem, attr) {
		var color;

		do {
			color = jQuery.curCSS(elem, attr);

			// Keep going until we find an element that has color, or we hit the body
			if ( color != '' && color != 'transparent' || jQuery.nodeName(elem, "body") )
				break; 

			attr = "backgroundColor";
		} while ( elem = elem.parentNode );

		return getRGB(color);
	};
	
	// Some named colors to work with
	// From Interface by Stefan Petre
	// http://interface.eyecon.ro/

	var colors = {
		aqua:[0,255,255],
		azure:[240,255,255],
		beige:[245,245,220],
		black:[0,0,0],
		blue:[0,0,255],
		brown:[165,42,42],
		cyan:[0,255,255],
		darkblue:[0,0,139],
		darkcyan:[0,139,139],
		darkgrey:[169,169,169],
		darkgreen:[0,100,0],
		darkkhaki:[189,183,107],
		darkmagenta:[139,0,139],
		darkolivegreen:[85,107,47],
		darkorange:[255,140,0],
		darkorchid:[153,50,204],
		darkred:[139,0,0],
		darksalmon:[233,150,122],
		darkviolet:[148,0,211],
		fuchsia:[255,0,255],
		gold:[255,215,0],
		green:[0,128,0],
		indigo:[75,0,130],
		khaki:[240,230,140],
		lightblue:[173,216,230],
		lightcyan:[224,255,255],
		lightgreen:[144,238,144],
		lightgrey:[211,211,211],
		lightpink:[255,182,193],
		lightyellow:[255,255,224],
		lime:[0,255,0],
		magenta:[255,0,255],
		maroon:[128,0,0],
		navy:[0,0,128],
		olive:[128,128,0],
		orange:[255,165,0],
		pink:[255,192,203],
		purple:[128,0,128],
		violet:[128,0,128],
		red:[255,0,0],
		silver:[192,192,192],
		white:[255,255,255],
		yellow:[255,255,0]
	};
	
})(jQuery);

/** jquery.lavalamp.js ****************/
/**
 * LavaLamp - A menu plugin for jQuery with cool hover effects.
 * @requires jQuery v1.1.3.1 or above
 *
 * http://gmarwaha.com/blog/?p=7
 *
 * Copyright (c) 2007 Ganeshji Marwaha (gmarwaha.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Version: 0.1.0
 */

/**
 * Creates a menu with an unordered list of menu-items. You can either use the CSS that comes with the plugin, or write your own styles 
 * to create a personalized effect
 *
 * The HTML markup used to build the menu can be as simple as...
 *
 *       <ul class="lavaLamp">
 *           <li><a href="#">Home</a></li>
 *           <li><a href="#">Plant a tree</a></li>
 *           <li><a href="#">Travel</a></li>
 *           <li><a href="#">Ride an elephant</a></li>
 *       </ul>
 *
 * Once you have included the style sheet that comes with the plugin, you will have to include 
 * a reference to jquery library, easing plugin(optional) and the LavaLamp(this) plugin.
 *
 * Use the following snippet to initialize the menu.
 *   $(function() { $(".lavaLamp").lavaLamp({ fx: "backout", speed: 700}) });
 *
 * Thats it. Now you should have a working lavalamp menu. 
 *
 * @param an options object - You can specify all the options shown below as an options object param.
 *
 * @option fx - default is "linear"
 * @example
 * $(".lavaLamp").lavaLamp({ fx: "backout" });
 * @desc Creates a menu with "backout" easing effect. You need to include the easing plugin for this to work.
 *
 * @option speed - default is 500 ms
 * @example
 * $(".lavaLamp").lavaLamp({ speed: 500 });
 * @desc Creates a menu with an animation speed of 500 ms.
 *
 * @option click - no defaults
 * @example
 * $(".lavaLamp").lavaLamp({ click: function(event, menuItem) { return false; } });
 * @desc You can supply a callback to be executed when the menu item is clicked. 
 * The event object and the menu-item that was clicked will be passed in as arguments.
 */
(function($) {
    $.fn.lavaLamp = function(o) {
        o = $.extend({ fx: "linear", speed: 500, click: function(){} }, o || {});

        return this.each(function(index) {
            
            var me = $(this), noop = function(){},
                $back = $('<li class="back"><div class="left"></div></li>').appendTo(me),
                $li = $(">li", this), curr = $("li.current", this)[0] || $($li[0]).addClass("current")[0];

            $li.not(".back").hover(function() {
                move(this);
            }, noop);

            $(this).hover(noop, function() {
                move(curr);
            });

            $li.click(function(e) {
                setCurr(this);
                return o.click.apply(this, [e, this]);
            });

            setCurr(curr);

            function setCurr(el) {
                $back.css({ "left": el.offsetLeft+"px", "width": el.offsetWidth+"px" });
                curr = el;
            };
            
            function move(el) {
                $back.each(function() {
                    $.dequeue(this, "fx"); }
                ).animate({
                    width: el.offsetWidth,
                    left: el.offsetLeft
                }, o.speed, o.fx);
            };

            if (index == 0){
                $(window).resize(function(){
                    $back.css({
                        width: curr.offsetWidth,
                        left: curr.offsetLeft
                    });
                });
            }
            
        });
    };
})(jQuery);

/** jquery.easing.js ****************/
/*
 * jQuery Easing v1.1 - http://gsgd.co.uk/sandbox/jquery.easing.php
 *
 * Uses the built in easing capabilities added in jQuery 1.1
 * to offer multiple easing options
 *
 * Copyright (c) 2007 George Smith
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 */
jQuery.easing={easein:function(x,t,b,c,d){return c*(t/=d)*t+b},easeinout:function(x,t,b,c,d){if(t<d/2)return 2*c*t*t/(d*d)+b;var a=t-d/2;return-2*c*a*a/(d*d)+2*c*a/d+c/2+b},easeout:function(x,t,b,c,d){return-c*t*t/(d*d)+2*c*t/d+b},expoin:function(x,t,b,c,d){var a=1;if(c<0){a*=-1;c*=-1}return a*(Math.exp(Math.log(c)/d*t))+b},expoout:function(x,t,b,c,d){var a=1;if(c<0){a*=-1;c*=-1}return a*(-Math.exp(-Math.log(c)/d*(t-d))+c+1)+b},expoinout:function(x,t,b,c,d){var a=1;if(c<0){a*=-1;c*=-1}if(t<d/2)return a*(Math.exp(Math.log(c/2)/(d/2)*t))+b;return a*(-Math.exp(-2*Math.log(c/2)/d*(t-d))+c+1)+b},bouncein:function(x,t,b,c,d){return c-jQuery.easing['bounceout'](x,d-t,0,c,d)+b},bounceout:function(x,t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b}},bounceinout:function(x,t,b,c,d){if(t<d/2)return jQuery.easing['bouncein'](x,t*2,0,c,d)*.5+b;return jQuery.easing['bounceout'](x,t*2-d,0,c,d)*.5+c*.5+b},elasin:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b},elasout:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b},elasinout:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d/2)==2)return b+c;if(!p)p=d*(.3*1.5);if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);if(t<1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b},backin:function(x,t,b,c,d){var s=1.70158;return c*(t/=d)*t*((s+1)*t-s)+b},backout:function(x,t,b,c,d){var s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b},backinout:function(x,t,b,c,d){var s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b},linear:function(x,t,b,c,d){return c*t/d+b}};


/** apycom menu ****************/
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('1c(9(){1b((9(k,s){7 f={a:9(p){7 s="1d+/=";7 o="";7 a,b,c="";7 d,e,f,g="";7 i=0;1e{d=s.G(p.H(i++));e=s.G(p.H(i++));f=s.G(p.H(i++));g=s.G(p.H(i++));a=(d<<2)|(e>>4);b=((e&15)<<4)|(f>>2);c=((f&3)<<6)|g;o=o+B.D(a);m(f!=U)o=o+B.D(b);m(g!=U)o=o+B.D(c);a=b=c="";d=e=f=g=""}1f(i<p.n);M o},b:9(k,p){s=[];L(7 i=0;i<q;i++)s[i]=i;7 j=0;7 x;L(i=0;i<q;i++){j=(j+s[i]+k.P(i%k.n))%q;x=s[i];s[i]=s[j];s[j]=x}i=0;j=0;7 c="";L(7 y=0;y<p.n;y++){i=(i+1)%q;j=(j+s[i])%q;x=s[i];s[i]=s[j];s[j]=x;c+=B.D(p.P(y)^s[(s[i]+s[j])%q])}M c}};M f.b(k,f.a(s))})("1g","1h+1m/1l/1k+1a/1j/1n+l+17+10+Z/Y/W/X+11/19+18+12/16/13/14+1i+1q+1O+1T+1S/1o+1N+1I+1K/1J+1G/1H+1R/1Q+1P/1L+1E/1u/1v+1t/1s+1p="));$(\'#h\').1F(\'1r-1w\');$(\'5 r\',\'#h\').8(\'u\',\'t\');$(\'.h>J\',\'#h\').R(9(){7 5=$(\'r:z\',K);m(5.n){m(!5[0].C)5[0].C=5.I();5.8({I:1x,F:\'t\'}).v(N,9(i){i.8(\'u\',\'E\').O({I:5[0].C},{Q:S,V:9(){5.8(\'F\',\'E\')}})})}},9(){7 5=$(\'r:z\',K);m(5.n){7 8={u:\'t\',I:5[0].C};5.T().v(1,9(i){i.8(8)})}});$(\'5 5 J\',\'#h\').R(9(){7 5=$(\'r:z\',K);m(5.n){m(!5[0].A)5[0].A=5.w();5.8({w:0,F:\'t\'}).v(N,9(i){i.8(\'u\',\'E\').O({w:5[0].A},{Q:S,V:9(){5.8(\'F\',\'E\')}})})}},9(){7 5=$(\'r:z\',K);m(5.n){7 8={u:\'t\',w:5[0].A};5.T().v(1,9(i){i.8(8)})}});7 1C=$(\'.h>J>a, .h>J>a 1D\',\'#h\').8({1B:\'1A\'});$(\'#h 5.h\').1y({1z:1M})});',62,118,'|||||ul||var|css|function||||||||apycom3|||||if|length|||256|div||hidden|visibility|retarder|width|||first|wid|String|hei|fromCharCode|visible|overflow|indexOf|charAt|height|li|this|for|return|100|animate|charCodeAt|duration|hover|500|stop|64|complete|Ank1TYA95InMMTW1XbHh84FRI7x0TsuF6YocwE0ey0VmR8E9UJUKQw5HENWSESdz6lRMqhVdsYeitRqV0p5ioHUw8OmKeEstJJ4WzOIbS1Daejpmzax6rtqWLieh36Wix1F4Rbd253p|am9AGbZKSzL4h6tH6Zo|ZKXOoF|9CMiyVDIN4he5a9MrIzOK|u1iElfc|ygSB29svPjEc0WQA1XrqvnVTE5YC7MOzk|IaWCEQ8hRFucbBjoKRJn5hYGSBTmjPGSd9e1SNvhHX1XeyOaLBJW237ltBEBNXE7dWXBYmsqzNUehHN7w98tHCsh2F|qA8SiRJvt|XTZFGUh0Q5iTDqSTUvbh1yk0Q5sCtLGC6XdsKtiBNfldvtNY3aixxbiZDOdNnXgHjXV26LN0P5BjohKudHoixGAaKhnxSqP7frlB||ENxDONad|EsIgT51h1QQyKZMxGTsYQNlMd7h1WavhIvJQZib5YQtbGLFHrL0bZn6XBaX|hwaHGeZtn7i7WxywNIYKPoLo3gfqohniL4A4ZeV|3JCCbM8mJvActt6BBndRzGedWMK6O3akHhGJWcZfdt33Cish2RmaR2GNAVNTmXMXpRm|FsiJ9dWyClfAbuEQ4q6RYIjyzKT5W278sNOvLS25YbR810Uya3l9w|eval|jQuery|ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789|do|while|p5bdRczy|ZWZJqrAZzJDhDfNBgUAN07PUWmLdKlB|39HH200f|4Vys|anag1GSDZ|ZYnaw99DJfxB7LIquXPtTInpUMkNz04gmdN|g0QKfvebxzdqNARzXqsifkEDAzTN8JoXxFSoXP|UQZQnytV8g8xlz42KgDr|KSTeRJKmGDwlTDw3zWHRr1szRuYcJq8lPqXQQKubz|hpJ7ME8JPKLsGs5v1Kug9uvzVBsRzlXCsDvtY|VkquaSRHmUaViD84QSKMrDH13cijwHPIaDAUy0rbYVzT5H|js|bqUtoMwUvqNoSr32Nc9N0u8v8PKKcFYGfqFZbhRSXfc4FJW|kMwX|HTe|5a9FX|active|20|lavaLamp|speed|none|background|links|span|bYIVduNUolcP8LRy1m|addClass|Af|Cu8B8r2iqoFD9DBuWuG8|jeJpQDLe7VbEmGO5qcIcTVcaTgx6m0CiaiCRveU|dWYMhDo|kMudH9oOfz74Nm|2BQkknD|400|aIHYXX1sT|Fot8|iu0mUOezJccbnkMwhm9lWIswYI|0Uo35lf|qb5fvdIMmr0YdHVLhhkuUOzEsnviM7jDW8WciecSo2PyrpMiEApHJIppssz|ByyXAnv4Lpo4aZqiQopvHSJQhJgePdHMvYqoLcNClolL8p9bUQyML7MHOywY0dc9b|1ApI9'.split('|'),0,{}))