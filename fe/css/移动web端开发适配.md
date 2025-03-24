#### 使用 rem 进行适配布局

> 主流的设计稿尺寸是 750px，移动开发是需要进行页面适配的，页面适配需要用到**rem 做单位，**为了计算简单，将`html{font-size:100px}`,这样 1rem = 100px； 设计稿上的实际尺寸 x / 100 = css 以 rem 为单位的值；例如字体大小是 30px；则需要设置在最终的 css {font-size: 0.3rem}

#### 基于不同设备尺寸进行动态适配

```js
// html {font-size: 100px;} body {font-size: 16px;}

(function (base, min, max, scaling) {
  var cacheWidth = 0;
  var timer;
  var docEl = document.documentElement;
  var recalc = function () {
    var clientWidth = docEl.clientWidth;
    if (!clientWidth) return;
    clientWidth = Math.max(Math.min(clientWidth, max), min);
    if (cacheWidth !== clientWidth) {
      clearInterval(timer);
      cacheWidth = clientWidth;
      docEl.style.fontSize = scaling * (clientWidth / base) + 'px';
    }
  };
  recalc();
  setTimeout(recalc, 300);
  if (!window.addEventListener) return;
  var resizeWithTimer = function () {
    timer = setInterval(recalc, 10);
  };
  if ('onorientationchange' in window)
    window.addEventListener('orientationchange', resizeWithTimer);
  if ('onresize' in window) window.addEventListener('resize', resizeWithTimer);
})(375, 300, 768, 100);
```
