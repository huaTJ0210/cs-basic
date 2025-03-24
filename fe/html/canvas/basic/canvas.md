### 1、requestAnimationFrame

> - *requestAnimationFrame():*解决了浏览器不知道 JavaScript 动画何时开始的问题，以及最佳间隔是多少;
>
> - requestAnimationFrame 跟排期任务有关，支持它的方法浏览器实际上会暴露出一个钩子的回调队列；所谓钩子（hook），浏览器执行下一次重绘之前的一个点，这个回调队列是一个可修改的函数列表，

<!--more-->

#### 1.1 节流

```javascript
// 节流操作:
let enable = true;
function handler() {
  console.log('handler:' + Date.now());
}
window.addEventListener('scroll', () => {
  if (enable) {
    enable = false;
    window.requestAnimationFrame(expensiveOperation);
    window.setTimeout(() => (enable = true), 50);
  }
});
```

### 2、canvas

#### 2.1 基本画布功能

```javascript
/*
  <canvas id="drawing" width="200" height="200">A drawing of something</canvas>
*/

// 获取canvas对象
let canvas = document.getElementById('drawing');
// 判断浏览器是否支持
if (canvas.getContext) {
  // 获取绘图上下文的引用
  let context = canvas.getContext('2d');

  // 取得图像的数据URI
  let imageURI = canvas.toDataURL('image/png');
  //显示图片
  let image = document.createElement('img');
  image.src = imageURI;
  document.body.appendChild(image);
}
```

#### 2.2、2D 绘制上下文

```javascript
let canvas = document.getElementById('draw');
if (canvas.getContext) {
  let context = canvas.getContext('2d');
  // 绘制红色矩形
  context.fillStyle = '#ff0000';
  // fillRect:用于以指定颜色在画布上绘制并填充矩形
  context.fillRect(10, 10, 50, 50);
  // 绘制半透明蓝色矩形
  context.fillStyle = 'rgba(0,0,255,0.5)';
  context.fillRect(30, 30, 50, 50);
  // 绘制轮廓
  context.strokeStyle = '#ff0000';
  context.strokeRect(50, 50, 50, 50);
}
```

#### 2.3 、不带数字的表盘

```javascript
let clockCanvas = document.getElementById('clock');
if (clockCanvas.getContext) {
  let context = clockCanvas.getContext('2d');
  // 创建路径
  context.beginPath();
  // 绘制外圆
  context.arc(100, 100, 99, 0, 2 * Math.PI, false);
  // 绘制内圆
  context.moveTo(194, 100); // 如果不moveTo有个连笔出现
  context.arc(100, 100, 94, 0, 2 * Math.PI, false);
  // 绘制分针
  context.moveTo(100, 100);
  context.lineTo(100, 25);
  // 绘制时针
  context.moveTo(100, 100);
  context.lineTo(35, 100);
  // 顶部绘制数字’12‘
  context.font = 'bold 14px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('12', 100, 20);
  //描画路径
  context.stroke();
}
```
