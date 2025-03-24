---
title: 'BOM之事件'
date: '2018/4/13'
categories:
  - web
tags:
  - BOM
toc: true
---

### window

> 浏览器里面，window 对象指当前的浏览器窗口

#### window 对象的方法

<!--more-->

##### window.requestAnimationFrame()

> 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行
>
> + 使用场景之一：大数据渲染，对数据进行切片处理，使用该函数进行渲染的回调
> + 对于不支持CSS3的属性执行动画

```javascript
function step() {
  // do sth
}
window.requestAnimationFrame(step)
```

#####  window.requestIdleCallback()

> 该函数保证将回调函数推迟到系统资源空闲时执行，当某个任务不是很关键可以采用此方法将其推迟；
>
> 该函数接收一个回调函数和一个配置对象，配置对象只有一个属性 timeout，用来指定回调函数推迟执行的最大毫秒数

```javascript
/*
  window.requestIdleCallback(callback[, options])
  callback参数是一个回调函数。该回调函数执行时，系统会传入一个IdleDeadline对象作为参数。IdleDeadline对象有一个     didTimeout属性（布尔值，表示是否为超时调用）和一个timeRemaining()方法（返回该空闲时段剩余的毫秒数）。

options参数是一个配置对象，目前只有timeout一个属性，用来指定回调函数推迟执行的最大毫秒数。该参数可选。
requestIdleCallback(processPendingAnalyticsEvents, { timeout: 2000 }); 设置timeout，要求必须在未来2秒内执行
*/

requestIdleCallback(myNonEssentialWork)

function myNonEssentialWork(deadline) {
  while (deadline.timeRemaining() > 0) {
    doWorkIfNeeded()
  }
}
```



#### window 对象的事件

#####  load 事件和 onload 属性

> load 事件发生在文档在浏览器窗口加载完毕时，即所有的资源都加载完毕后（脚本、图像等内资源阻塞）

##### 浏览器脚本发生错误：error



#### Navigator

> window.navigator 属性指向一个包含浏览器和系统信息的 Navigator 对象，
>
> 1. userAgent：浏览器厂商和版本信息
> 2. geolocation:用户地理位置信息



#### Screen

> Screen 对象表示当前窗口所在的屏幕，提供显示设备的信息。
>
> 例如：screen.width/screen.height



#### Cookie

> Cookie 是服务器保存在浏览器的一段文本信息，浏览器每次发送信息，会自动附上这段信息；Cookie 的主要用途：
>
> 1. 对话（session）管理：保存登录、购物车等需要记录的信息；
> 2. 个性化信息：保存用户的偏好；
> 3. 追踪用户：记录和分析用户行为；

##### Cookie的一些设置字段

>+ 过期时间Expires或者有效期Max-Age
>+ Secure：只能被HTTPS协议加密过的请求发送给服务器
>+ HttpOnly：document.cookie的API无法访问
>+ Domain：指定哪些主机可以接受Cookie，默认是origin不包含子域
>+ path：指定主机下的哪些路径可以接受cookie
>+ SameSite ： 
>  + None
>  + Strict ： 新打开相同的Tab页也丢失登录信息（用户体验不好）
>  + Lax ： 相对约束少

#####  HTTP 回应：cookie 的生成

```http
HTTP/1.0 200 OK
Content-type: text/html
Set-Cookie: yummy_cookie=choco
Set-Cookie: tasty_cookie=strawberry

[page content]
```

#####  HTTP 请求：cookie 的发送

```http
GET /sample_page.html HTTP/1.1
Host: www.example.org
Cookie: yummy_cookie=choco; tasty_cookie=strawberry
```

##### cookie 使用场景

###### 利用 cookie 实现自动登录

> 用户登录成功后，服务端一般会在 cookie 中设置 sessionID，并设置 cookie 的过期时间，在 cookie 的有效期内，用户再次在浏览器中访问页面时，浏览器本地的 cookie 会通过 HTTP 请求发送给服务端，若 sessionID 还有效，则不需要再次登录；

###### 根据用户的爱好定制站点

> 用户的偏好设置；如果需要同步则需要在服务端进行保存；

###### 使用 cookie 记录各个用户的访问计数

> 1.获取 cookie 数组中专门用于统计用户访问次数的 cookie 的值 
>
> 2.将值转换成 int 型 
>
> 3.将值加 1 并用原来的名称重新创建一个 Cookie 对象
>
>  4.重新设置最大时效 
>
> 5.将新的 cookie 输出
