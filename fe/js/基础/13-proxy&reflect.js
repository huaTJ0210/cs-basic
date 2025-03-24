/**
 * 1、代理：是对目标对象的抽象，可以为目标对象的基本操作赋予更多的能力
 */

const o = {
  id: 'foo'
}

// 创建一个空的代理对象：
const proxyO = new Proxy(o, {})
// Proxy.prototype等于undefined，因此不能采用instanceof操作符处理

/**
 * 2、Proxy VS defineProperty
 * + 监控的操作更多
 * + 可以监控数组
 * + 不需要对属性一一进行监控重写
 *
 */

const Person = { name: 'li', age: 20 }

const proxyPerson = new Proxy(Person, {
  get(target, property) {
    console.log(target, property)
    return Reflect.get(target, property)
  },
  set(target, property, value) {
    console.log(target, property, value)
    return Reflect.set(target, property, value)
  }
})

proxyPerson.name
proxyPerson.age = 23

/**
 * 3、可撤销的代理
 */
const o3 = {
  name: 'o3'
}

const { proxy, revoke } = new Proxy.revocable(o3, {})

/**
 *  4、Reflect : 提供了统一的一套操作对象的方法
 *  + 通常，Object 上的方法适用于通用程序，而反射方法适用于细粒度的对象控制与操作。
 * */

const obj = {
  name: 'li',
  age: 18
}

'name' in obj
Reflect.has(obj, 'name')
delete obj.age
Reflect.deleteProperty(obj, 'name')
Object.keys(obj)
Reflect.ownKeys(obj)
