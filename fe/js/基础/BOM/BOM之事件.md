---
title: 'BOM之事件'
date: '2018/4/6'
categories:
  - web
tags:
  - BOM
toc: true
---

### 事件

> 事件代表文档或者浏览器窗口中某个有意义的时刻，JavaScript 与 HTML 的交互是通过事件实现的

<!--more-->

#### 1.事件流

> 页面接收事件的顺序

##### 1.1 事件冒泡

> 事件被定义从最具体的元素开始触发，然后向上传播到没那具体的元素
>
> 下列点击事件冒泡的顺序：div -> body -> html -> document

```html
<html>
  <body>
    <div id="myDiv">click</div>
  </body>
</html>
```

##### 1.2 事件捕获

> 事件被定义从最不具体的元素开始触发，然后向上传播到最具体的元素
>
> 下列点击事件冒泡的顺序：document -> html -> body -> div

```html
<html>
  <body>
    <div id="myDiv">click</div>
  </body>
</html>
```

##### 1.3 DOM 事件流

> - 事件捕获
> - 到达目标
> - 事件冒泡

#### 2、事件处理程序

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <!-- （1）动态创建了一个包装函数，内部有一个局部变量-- event对象 -->
    <input type="button" value="on click" onclick="console.log('clicked!!'+ this.value);" />
    <!-- （2）创建事件 -->
    <input id="button" type="button" value="button" />
    <!-- （3）创建事件使用监听方法 -->
    <input id="myBtn" type="button" value="my button" />

    <script>
      const button = document.getElementById('button')
      // 以此种方式注册的事件是在事件流的冒泡阶段；
      button.onclick = function () {
        // this代表当前button元素
        console.log('button onclick')
      }
      //使用监听方法处理事件
      const myBtn = document.getElementById('myBtn')
      const clickHandler = () => {
        console.log('my btn click!!')
      }
      myBtn.addEventListener('click', clickHandler, false)
      // 移除事件：只能移除和添加事件处理程序一致的事件程序
      myBtn.removeEventListener('click', clickHandler, false)
    </script>
  </body>
</html>
```

#### 3、事件对象

```javascript
const button = document.getElementById('button')
button.addEventListener(
  'click',
  function (event) {
    console.log(this)
    console.log(event.currentTarget)
    // 事件的目标元素，但并不代表是事件处理程序的绑定元素
    console.log(event.target)
    // 事件类型:click mouseover load
    console.log(event.type)
    // 取消默认行为的对象; 比如a标签的点击跳转
    event.preventDefault()
    // 取消后续的捕获事件或者冒泡冒泡，只有在bubbles为true才调用
    event.stopPropagation()
    //取消后续的捕获事件或者冒泡冒泡
    event.stopImmediatePropagation()
    // 事件流当前所处的阶段
    console.log(event.eventPhase)
  },
  false
)
```

#### 4、事件类型

##### 4.1 load

> window 的 load 事件 : 整个页面加载完成后触发【某页面或者资源加载完成（页面或者资源从缓存中加载则不会触发） 浏览网页的资源有哪些：图像（image）、样式表（style）、脚本（script）、视频（video）、音频（audio）Ajax 请求（XMLHttpRequest）】

##### 4.2 DOMContentLoaded

> DOM 树创建完毕即可以执行，不需要等待 js、css，图片资源的加载

#### 5、内存与性能

##### 5.1 事件委托

```javascript
//  (1)与逐步给每一个li元素添加事件处理程序相比，将事件处理程序添加在ul上更节省内存；
const ulEl = document.getElementsByTagName('ul')
ulEl.addEventListener(
  'click',
  function (event) {
    switch (event.target.id) {
      case '1':
        console.log('1')
        break
      case '2':
        console.log('2')
        break
      case '3':
        console.log('3')
        break
      default:
        console.log('0')
    }
  },
  false
)
```

#### 6、自定义事件

> - createEvent
> - initEvent
> - dispatchEvent;
