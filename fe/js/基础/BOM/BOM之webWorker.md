---
title: 'BOM之webworker'
date: '2018/4/28'
categories:
  - web
tags:
  - BOM
toc: true
---

#### 1、 web worker

#### 1.1 概述

> Web Worker 的作用，就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行;

<!--more-->

#### 1.2 使用限制

> 1. 同源限制：与主线程的脚本文件同源
> 2. DOM 限制：无法读取主线程所在的网页的 DOM
> 3. 全局对象限制 ：Worker 的全局对象是 WorkerGlobalscope，不同于网页的全局对象 window
> 4. 通讯联系：和主线程的通讯必须通过消息发送
> 5. 脚本限制 ： alert()等方法不能执行，但是能发送 ajax 请求
> 6. 文件限制：无法读取本地文件，加载的脚本必须来自网络

#### 1.3 基本用法

```javascript
// (1) 主线程文件脚本内容
var worker = new Worker('./work.js') // 通过构造函数创建一个Worker的线程
// 通过onmessage方法监听worker线程的消息
worker.onmessage = function (event) {
  console.log(event.data)
  /*
    通过postMessage()方法向创建的worker线程发送消息 
    其他方式： worker.postMessage({method: 'echo', args: ['Work']});
  */

  worker.postMessage('message from main Thread')
  /*
    任务结束后关闭worker线程
    worker.terminate();
  */
}

// (2) work.js
importScripts('script1.js') // 加载外部脚本的方法
self.postMessage('message from work Thread')
self.onmessage = function (event) {
  console.log(event.data)
  /*
    self.close(); 用于自身关闭
  */
}
```

#### 1.4 使用场景

- 处理密集型数学计算
- 大数据集的排序
- 数据处理（压缩、音频分析、图像处理等）
- 高流量网络通讯

##### 1.4.1 worker 线程完成轮询

> 浏览器需要轮询服务器状态，以便第一时间得知状态改变。这个工作可以放在 Worker 里面

```javascript
function createWorker(f) {
  var blob = new Blob(['(' + f.toString() + ')()']);
  var url = window.URL.createObjectURL(blob);
  var worker = new Worker(url);
  return worker;
}

var pollingWorker = createWorker(function (e) {
  var cache;

  function compare(new, old) { ... };

  setInterval(function () {
    fetch('/my-api-endpoint').then(function (res) {
      var data = res.json();

      if (!compare(data, cache)) {
        cache = data;
        self.postMessage(data);
      }
    })
  }, 1000)
});

pollingWorker.onmessage = function () {
  // render data
}

pollingWorker.postMessage('init');
```
