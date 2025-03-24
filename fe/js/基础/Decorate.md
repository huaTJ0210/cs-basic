---
title: 'Decorator'
date: '2021/4/5'
categories:
  - web
tags:
  - javascript
toc: true
---

### Decorate

> ES7 中的 decorator 依赖于 ES5 的 Object.defineProperty 方法,让我们有机会在代码的执行期间改变其行为；

<!--more-->

#### 1、基本概念

> [Decorators in ES7](https://zhuanlan.zhihu.com/p/20139834)

```javascript
// (1)实例方法定义装饰器
function readonly(target, key, descriptor) {
  // target 是Dog.prototype
  // descriptor：是属性描述
  descriptor.writable = false
  return descriptor
}

// (2)作用在类上的decorate
function isDog(target) {
  target.isDog = true
}

// (3) decorate也可以是工厂函数，对不同的目标需要差异性
function doge(isDog) {
  return function (target) {
    target.isDog = true
  }
}

@doge(true)
class Dog {
  @readonly
  bark() {
    return 'wang wang!'
  }
}

console.log(Dog.isDog)
const dog = new Dog()
dog.bark()
```

#### 2、使用场景

> [decorate 的使用场景](



### 参考资料

> + [装饰器在js中的应用](https://segmentfault.com/a/1190000015566627?utm_source=sf-similar-article)
> + [装饰器在TS中的使用](https://saul-mirone.github.io/zh-hans/a-complete-guide-to-typescript-decorator/)
