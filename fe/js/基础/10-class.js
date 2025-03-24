class Person {
  // 静态成员
  static tag = 'tag'
  // 成员变量
  age = 18
  // 构造函数
  constructor(name) {
    this.name = name
  }
  // 实例方法
  say() {
    console.log('say')
  }
  // 静态方法
  static getTag() {
    console.log(this.tag)
  }
}

// 类的继承
class Student extends Person {
  constructor(name) {
    super(name)
  }
}

console.log(Student.__proto__ === Person)

/**
 *   1、ES6的继承与ES5有何不同？
 *   + 为了实现静态成员的继承，ES6中的子类内部[[prototype]]直接指向了父类
 */

/**
 *   2、ES6的class中的constructor为什么super()必须在this之前调用？
 *   + 在super之前this还没有被初始化
 */
