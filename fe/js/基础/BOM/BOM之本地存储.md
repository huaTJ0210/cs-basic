---
title: 'BOM之本地存储'
date: '2018/4/24'
categories:
  - web
tags:
  - BOM
toc: true
---

### Storage 接口

> Stroage 接口用于在浏览器保存数据，其中两个对象部署了这个接口：
>
> 1. sessionStorage：保存的数据用于浏览器的一次会话（session），当会话结束，数据被清空
> 2. localStorage: 保存的数据长期存在，下一次访问网站可以直接读取

<!--more-->

#### 接口方法

##### setItem()

> 存储数据 `session.setItem('key','value')`

##### getItem()

> 获取数据 `session.getItem('key')`

##### removeItem()

> 清除数据 `session.removeItem('key')`

##### clear

> 清除所有数据 `session.clear()`
