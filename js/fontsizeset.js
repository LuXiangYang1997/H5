(function (doc, win) {
var docEl = doc.documentElement,
  resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
  recalc = function () {
    var clientWidth = docEl.clientWidth;
    if (!clientWidth) return;
    docEl.style.fontSize = 100 * (clientWidth / 375) + 'px';
  };

if (!doc.addEventListener) return;
win.addEventListener(resizeEvt, recalc, false);
doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

window.toast = function  (str,callbacks) {
    var m = document.createElement('div');
    m.innerHTML = str;
    m.style.cssText="padding:0.1rem 0.20rem;font-size:0.16rem; min-width:1.60rem; background:#000; opacity:0.77; line-height:0.20rem; color:#fff;text-align:center; border-radius:0.10rem; position:fixed; top:50%; left:50%; z-index:99999999;transform:translate(-50%,-50%);";
     document.body.appendChild(m);
    setTimeout(function() {
       var d = 0.5;
         m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
         m.style.opacity = '0';
       setTimeout(function() { document.body.removeChild(m); if(callbacks){callbacks()}}, d * 1000);
    }, 2000);
 }
