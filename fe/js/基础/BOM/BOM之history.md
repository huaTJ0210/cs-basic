---
title: 'BOM之history'
date: '2018/4/20'
categories:
  - web
tags:
  - BOM
toc: true
---

### history

> History 对象，它表示当前窗口的浏览历史

<!--more-->

####  location

> 浏览器提供的原生对象，提供了 URL 相关的信息和操作方法

```javascript
// 当前网址为 :  http://user:passwd@www.example.com:4097/path/a.html?x=111#part1
document.location.href; // "http://user:passwd@www.example.com:4097/path/a.html?x=111#part1"
document.location.protocol; // "http:"
document.location.host; // "www.example.com:4097"
document.location.hostname; // "www.example.com"
document.location.port; // "4097"
document.location.pathname; // "/path/a.html"
document.location.search; // "?x=111"
document.location.hash; // "#part1"
document.location.username; // "user"
document.location.password; // "passwd"
document.location.origin; // "http://user:passwd@www.example.com:4097"
```

#### URL 的编码和解码

> `http://www.example.com/q=春节`这个 URL 之中，汉字“春节”不是 URL 的合法字符，所以被浏览器自动转成`http://www.example.com/q=%E6%98%A5%E8%8A%82`。其中，“春”转成了`%E6%98%A5`，“节”转成了`%E8%8A%82`。这是因为“春”和“节”的 UTF-8 编码分别是`E6 98 A5`和`E8 8A 82`，将每个字节前面加上百分号，就构成了 URL 编码

> JavaScript 提供了 4 个 URL 的编码/解码方法：
>
> 1. encodeURI() : 编码整个 URL
> 2. `encodeURIComponent()` : 单独转码 URL 的组成部分
> 3. `decodeURI()`
> 4. `decodeURIComponent()`

#### URLSearchParams 对象

> `URLSearchParams`对象是浏览器的原生对象，用来构造、解析和处理 URL 的查询字符串（即 URL 问号后面的部分）

```javascript
// set 方法
var params = new URLSearchParams('?foo=1');
params.set('foo', 2);
params.toString(); // "foo=2"
params.set('bar', 3);
params.toString(); // "foo=2&bar=3"

// get方法
var params = new URLSearchParams('?foo=1');
params.get('foo'); // "1"
params.get('bar'); // null
```

