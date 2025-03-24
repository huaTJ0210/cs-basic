namespace Dec {
  //定义一个类装饰器（本质上时一个函数）
  interface ConstructorType {
    new (...args: any[]): any
  }
  function addAge<T extends ConstructorType>(ctor: T) {
    return class extends ctor {
      // 新增方法
      addMethod() {
        console.log('addMethod')
      }
    }
  }

  // 属性和方法的装饰器
  function method(target: any, propKey: string, desc: PropertyDescriptor) {
    const fn = desc.value as Function
    return {
      ...desc,
      value: function (...args: any[]) {
        // 对方法进行额外的功能修复
        console.log('inner--call')
        fn.apply(this, args)
      }
    }
  }

  // 装饰器可以传递参数
  function dmethod(...args: any[]) {
    return (target: any, prop: string, desc: PropertyDescriptor) => {
      const fn = desc.value as Function
      return {
        ...desc,
        value: function (...innerArgs: any[]) {
          console.log(args)
          fn.apply(this, innerArgs)
        }
      }
    }
  }

  // 给函数的参数添加装饰器
  function params(target: any, prop: string, index: number) {
    // 使用全局对象进行存储
      // 然后在方法的装饰器中进行处理
      console.log(prop, index)
  }

  //给类型添加装饰器
  @addAge
  class Person {
    name: string
    age?: number
    constructor(name: string) {
      this.name = name
    }
    @method
    say() {
      console.log('say func :hello')
    }
    @dmethod('params')
    move(@params direction: string) {
      console.log('move move func')
    }
  }

  const p = new Person('li')
  //console.log(p.age)
  //p.say()
  //p.move('UP')
}
