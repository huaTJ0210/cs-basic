---
title: 'BOM之XMLHttpRequest'
date: '2018/4/16'
categories:
  - web
tags:
  - BOM
toc: true
---

#### 1、XMLHttpRequest

#### 1.1 简介

> AJAX 通讯：JavaScript 脚本发起 HTTP 通讯，从服务端获取数据，局部更新页面的技术；包含如下步骤：
>
> 1. 创建 XMLHttpRequest 实例；
> 2. 发起 HTTP 请求；
> 3. 接收服务器返回的数据
> 4. 更新网页数据

<!--more-->

#### 1.2 基本使用

```javascript
var xhr = new XMLHttpRequest()

xhr.onreadystatechange = function () {
  // 通信成功时，状态值为4
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      console.log(xhr.responseText)
    } else {
      console.error(xhr.statusText)
    }
  }
}

xhr.onerror = function (e) {
  console.error(xhr.statusText)
}

xhr.open('GET', '/endpoint', true)
xhr.send(null) // null表示发送请求时不带有数据体
```

#### 1.3 实例属性

##### 1.3.1 readyState

> 1. 0: 实例创建
> 2. 1：open() 函数被调用
> 3. 2：send()函数被调用
> 4. 3：正在接收服务器返回数据
> 5. 4：服务器返回数据已接收完毕

##### 1.3.2 onreadystatechange

> 监听实例的 readystate 属性变化；
>
> 【使用实例的 abort()方法可以终止 http 的请求】

##### 1.3.3 response

> 服务器返回的数据体（数据类型：字符串、对象、二进制对象等）

##### 1.3.4 responseType

> 通过设置此属性告知服务端需要返回的数据类型：
>
> 1. 默认为 text 文本类型
> 2. "arraybuffer" : ArrayBuffer 对象，表示服务器返回二进制数组
> 3. "blob"：Blob 对象，表示服务器返回二进制对象
> 4. "json" : JSON 对象

##### 1.3.5 timeout

> 设置请求超时时间

#### 1.4 Navigator.sendBeacon()

> 用于用户卸载网页的时候，向服务器发送一些数据；此方法作为浏览器进程的任务，请求的发送与当前页面的脱离；
>
> 不会延迟当前页面的卸载；

```JavaScript
// HTML 代码如下
// <body onload="analytics('start')" onunload="analytics('end')">

function analytics(state) {
  if (!navigator.sendBeacon) return;

  var URL = 'http://example.com/analytics';
  var data = 'state=' + state + '&location=' + window.location;
  navigator.sendBeacon(URL, data);

```

#### 2、同源限制

#### 2.1 同源含义

> A 网页设置的 cookie，B 网页不能使用；同源主要为了保证用户信息的安全；同源满足三个相同：
>
> 1. 协议相同
> 2. 域名相同
> 3. 端口相同

#### 2.2 限制范围

> 1. 无法读取非同源网页的 cookie、localStorage 和 indexDB
> 2. 非同源下网页的 DOM 无法操作
> 3. 无法向非同源地址发送 ajax 请求

#### 2.3 AJAX

> 规避同源限制的 3 中方法

##### 2.3.1 JSONP

```javascript
/*
 (1) 向服务端请求一个脚本
 <script src="http://api.foo.com?callback=bar"></script>
 (2) 服务器将返回的数据拼接为字符串放在函数的参数中
 (3) 客户端会将服务端返回的字符串作为代码解析
*/
function addScriptTag(src) {
  var script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.src = src
  document.body.appendChild(script)
}

window.onload = function () {
  addScriptTag('http://example.com/ip?callback=foo')
}

function foo(data) {
  console.log('Your public IP address is: ' + data.ip)
}
```

##### 2.3.2 websocket

> Websocket 是一种通讯协议，使用 ws://（wss://）作为协议的前缀，该协议不实行同源政策

##### 2.3.3 CORS

> CORS 是跨域资源分享；是 W3C 的标准，解决跨源不能发送 AJAX 请求的根本方法，
>
> CORS 允许各种类型（GET/POST 等）的请求

#### 3、CORS

[CORS](https://www.ruanyifeng.com/blog/2016/04/cors.html)

#### 1. 简介

> CORS 通讯的关键在于服务器，需要其实现 CORS 接口；对于浏览器来说一旦发现 ajax 是跨域的，就会在请求头部添加一些附加的头信息；

#### 2、两种请求

##### 2.1 简单请求

> 请求方法为（get、post、head）同时 HTTP 头部信息不能超出以下字段：Accept、Accept-language、Content-language、Content-Type[只限制：x-www-form-urlencode、form-data、textplain]

```http
GET /cors HTTP/1.1
Origin: http://api.bob.com
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

```http
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: FooBar
Content-Type: text/html; charset=utf-8
```

##### 2.2 非简单请求

> 请求方法是`PUT`或`DELETE`，或者`Content-Type`字段的类型是`application/json`。
>
> 非简单请求会在通讯前进行一次”预检“，浏览器会先询问服务器，当前所在的域名是否在服务器的许可名单中

```http
OPTIONS /cors HTTP/1.1
Origin: http://api.bob.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

```http
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2.0.61 (Unix)
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Content-Length: 0
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain
```
