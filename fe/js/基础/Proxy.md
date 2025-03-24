---
title: 'Proxy'
date: '2020/4/5'
categories:
  - web
tags:
  - javascript
toc: true
---

#### 代理与反射

> Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写

<!--more-->

#### 1、创建空代理对象

```javascript
let target = {
  // 目标对象
  name: 'li'
}

let handler = {} // 处理程序对象
let proxy = new Proxy(target, handler) // 空代理对象

// 代理对象上执行的操作都会反应在目标对象上
proxy.name = 'shan'
console.log(target.name) // 'shan'
target.name = 'zhang'
console.log(proxy.name) // 'zhang'
```

#### 2、定义捕获器

```javascript
let target = {
  // 目标对象
  name: 'li'
}
let handler = {
  // 捕获器
  get(trapTarget, property, receiver) {
    console.log(trapTarget === target)
    console.log(property)
    console.log(receiver === proxy)
    return 'handler override'
  }
} // 处理程序对象
let proxy = new Proxy(target, handler)
console.log(proxy.name)
```

#### 3、在捕获器中调用目标对象的原始行为

```javascript
let target = {
  name: 'li' // 目标对象
}
let handler = {
  // 捕获器
  get() {
    // 重新调用目标对象上的原始行为
    return Reflect.get(...arguments)
  }
} // 处理程序对象
let proxy = new Proxy(target, handler) // 空代理对象
console.log(proxy.name)
```

##### 3.1 代理捕获器与反射方法

```javascript
const person = { name: 'li' }
const proxy = new Proxy(person, {
  get(target, property, receiver) {
    // 捕获器不变式；target.property如果是不可写或者不可配置
    return Reflect.get(...arguments)
  },
  set(target, property, value, receiver) {
    return Reflect.set(...arguments)
  },
  has(target, property) {
    // 'name' in proxy
    return Reflect.has(...arguments)
  },
  defineProperty(target, property, descriptor) {
    return Reflect.defineProperty(target, property, descriptor)
  },
  apply(target, thisArg, argumentsList) {
    // 调用函数时的拦截
    return Reflect.apply(...arguments)
  },
  construct(target, argumentsList, newTarget) {
    // 拦截new
    return Reflect.construct(...arguments)
  }
})
console.log(proxy.name)
```

#### 4、可撤销代理

```javascript
let target = {
  // 目标对象
  name: 'li'
}
let handler = {
  // 捕获器
  get() {
    // 重新调用目标对象上的原始行为
    return Reflect.get(...arguments)
  }
} // 处理程序对象
const { proxy, revoke } = Proxy.revocable(target, handler)
revoke() // 调用此函数就可以撤销目标对象与代理对象之间的关联
```

#### 5、示例

```javascript
function observe1(obj, callback) {
  return new Proxy(obj, {
    get(target, property) {
      return Reflect.get(...arguments)
    },
    set(target, property, value) {
      callback(property, value)
      return Reflect.set(...arguments)
    },
    defineProperty(target, property, descriptor) {
      console.log('新增属性')
      return Reflect.defineProperty(target, property, descriptor)
    }
  })
}

const obj = observe(
  {
    name: 'zz',
    sex: 'man'
  },
  (key, value) => {
    console.log(`属性[${key}]的值被修改为[${value}]`)
  }
)

obj.name = 'li'
obj.sex = 'woman'
```
