# Class

### Class

#### 1 创建实例对象的方法

<!--more-->

##### 1.1 ES5

```javascript
// 生成实例对象的方法
function Point(x, y) {
  this.x = x;
  this.y = y;
}
// 增加构造函数上的方法是通过原型对象
Point.prototype.toString = function () {
  return "(" + this.x + "," + this.y + ")";
};
//  使用new关键字创建实例对象
var p = new Point(1, 2);
console.log(p.toString());
console.log(p.hasOwnProperty("x")); // true
console.log(p); // 如下图：
```

##### 1.2 ES6

```javascript
// 以面向对象的形式，以类为模板创建对象
class Point {
  // 构造器
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  // 成员方法
  toString() {
    return "(" + this.x + "," + this.y + ")";
  }
}
// （1）类的数据类型是函数，类本身指向构造函数
Point === Point.prototype.constructor;
//  (2) 创建对象使用new命令
var p = new Point(1, 2);
console.log(p.toString());
```

##### 1.3 类内部的方法都是不可枚举的

> ES5 中是可以枚举定义在原型上的方法的

```javascript
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype);
// []
Object.getOwnPropertyNames(Point.prototype);
// ["constructor","toString"]  : 成员方法定义在类的原型对象上
```

#### 2 constructor 方法

> constructor 方法是默认构造函数，如果没有显示的声明，JavaScript 引擎会默认创建一个无参的 constructor 方法

```javascript
// (1) 不显示创建constructor函数时；
class Point {}

// 等同于
class Point {
  constructor() {}
}

// (2) 注意事项： constructor函数默认返回实例对象（即this），如果自定义对象返回，则导致创建的实例对象不属于该类
class Foo {
  constructor() {
    return Object.create(null);
  }
}

new Foo() instanceof Foo;
// false
```

#### 3 类的实例

> 实例的属性除非显示定义在其本身（即定义在 this 对象上），否则都定义在原型上

```javascript
//定义类
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  toString() {
    return "(" + this.x + ", " + this.y + ")";
  }
}

var point = new Point(2, 3); // 必须使用new关键字不然会报错

point.toString(); // (2, 3)

point.hasOwnProperty("x"); // true
point.hasOwnProperty("y"); // true
point.hasOwnProperty("toString"); // false
point.__proto__.hasOwnProperty("toString"); // true
console.log(point); // 如下图：
```

#### 4 getter 和 setter 函数

> 存值函数和取值函数是设置在属性的 Descriptor 对象上的。

```javascript
class CustomHTMLElement {
  constructor(element) {
    this.element = element;
  }

  get html() {
    return this.element.innerHTML;
  }

  set html(value) {
    this.element.innerHTML = value;
  }
}

var descriptor = Object.getOwnPropertyDescriptor(
  CustomHTMLElement.prototype,
  "html"
);

"get" in descriptor; // true
"set" in descriptor; // true
```

#### 5 this 的指向问题

```javascript
// (1) 单独提取方法使用会引发this指向问题
class Logger {
  printName(name = "there") {
    this.print(`Hello ${name}`);
  }
  print(text) {
    console.log(text);
  }
}
const logger = new Logger();
const { printName } = logger;
printName(); // TypeError: Cannot read property 'print' of undefined；当前this指向方法运行时所在的环境，找不到print的定义

// 解决方案： （1）在构造函数中绑定this
class Logger {
  constructor() {
    this.printName = this.printName.bind(this);
  }
  // ...
}
```

#### 6 静态方法

> 如果在一个方法前，加上`static`关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。

```javascript
class Foo {
  static classMethod() {
    return "hello";
  }
  static bar() {
    this.baz(); // 此时this关键字指向的是类而不是实例
  }
  static baz() {
    console.log("hello");
  }
}

Foo.classMethod(); // 'hello'

var foo = new Foo();
foo.classMethod();
// TypeError: foo.classMethod is not a function
```

##### 6.1 子类继承父类的静态方法

```javascript
class Foo {
  static classMethod() {
    return "hello";
  }
}

class Bar extends Foo {
  static classMethod() {
    return super.classMethod() + ", too"; // 通过super关键字进行调用
  }
}

Bar.classMethod(); // "hello, too"
```

#### 7 实例属性的新写法

```javascript
class IncreasingCounter {
  /*
   （1）定义在构造函数中
   constructor() {
    this._count = 0;
  }
  */
  // (2) 统一定义在类的顶部
  _count = 0;
  get value() {
    console.log("Getting the current value!");
    return this._count;
  }
  increment() {
    this._count++;
  }
}
```

#### 8 new.target

> ES6 为`new`命令引入了一个`new.target`属性，该属性一般用在构造函数之中，返回`new`命令作用于的那个构造函数。如果构造函数不是通过`new`命令或`Reflect.construct()`调用的，`new.target`会返回`undefined`，因此这个属性可以用来确定构造函数是怎么调用的。

```javascript
function Person(name) {
  if (new.target !== undefined) {
    this.name = name;
  } else {
    throw new Error("必须使用 new 命令生成实例");
  }
}

// 另一种写法
function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error("必须使用 new 命令生成实例");
  }
}

var person = new Person("张三"); // 正确
var notAPerson = Person.call(person, "张三"); // 报错
```

#### 9、Class 的继承

##### 9.1 通过 extends 关键字实现继承

> ES5 的继承，实质是先创造子类的实例对象`this`，然后再将父类的方法添加到`this`上面（`Parent.apply(this)`）。
>
> ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到`this`上面（所以必须先调用`super`方法），然后再用子类的构造函数修改`this`。

```javascript
// 父类
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// 子类
class ColorPoint extends Point {
  constructor(x, y, color) {
    /*
      子类显式使用constructor方法就必须先调用super方法
      否则实例创建会出错；
      原因：子类的this对象必须先有父类的构造函数塑造后才能对其再加工
    */
    super(x, y);
    this.color = color;
  }
  toString() {
    return this.color + " " + super.toString(); // 调用父类的toString()
  }
}
```

##### 9.2 Object.getPrototypeof()

```javascript
// 判断一个类是否继承了另一个类
Object.getPrototypeOf(ColorPoint) === Point;
// true
```

#### 10 super 关键字

##### 10.1 super 作为函数调用，代表父类的构造函数

```javascript
class A {
  constructor() {
    console.log(new.target.name);
  }
}
class B extends A {
  constructor() {
    super(); // A.prototype.constructor.call(this)
  }
}
new A(); // A
new B(); // B
```

##### 10.2 super 作为对象时，在普通方法中，指向父类的原型对象

```javascript
class A {
  constructor() {
    this.p = 2;
  }
}

class B extends A {
  get m() {
    return super.p; // super代表A的原型对象，而p是定义在A上所以获取不到
  }
}

let b = new B();
b.m; // undefined
```

##### 10.3 ES6 规定，在子类普通方法中通过 super 调用父类的方法时，方法内部的 this 指向当前的子类实例。

```javascript
class A {
  constructor() {
    this.x = 1;
  }
  print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
    super.x = 3; // this.x = 3;
    console.log(super.x); // undefined : A.prototype.x 未定义
    console.log(this.x); // 3
  }
  m() {
    super.print(); // A.prototype.print.call(this);
  }
}

let b = new B();
b.m(); // 2
```

##### 10.4 `super`在静态方法之中指向父类，在普通方法之中指向父类的原型对象。

```javascript
class Parent {
  static myMethod(msg) {
    console.log("static", msg);
  }

  myMethod(msg) {
    console.log("instance", msg);
  }
}

class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg);
  }

  myMethod(msg) {
    super.myMethod(msg);
  }
}

Child.myMethod(1); // static 1

var child = new Child();
child.myMethod(2); // instance 2
```

#### 11、Mixin 模式的实现

> Mixin 指的是多个对象合成一个新的对象，新对象具有各个组成成员的接口

```javascript
function mix(...mixins) {
  class Mix {
    constructor() {
      for (let mixin of mixins) {
        copyProperties(this, new mixin()); // 拷贝实例属性
      }
    }
  }

  for (let mixin of mixins) {
    copyProperties(Mix, mixin); // 拷贝静态属性
    copyProperties(Mix.prototype, mixin.prototype); // 拷贝原型属性
  }

  return Mix;
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if (key !== "constructor" && key !== "prototype" && key !== "name") {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}
```

##### 11.1 具体使用

```javascript
class DistributedEdit extends mix(Loggable, Serializable) {
  // ...
}
```

#### 如何实现一个 new

```js
function newFunc(constructor, ...args) {
  // 基于构造函数的原型创建一个新对象
  const obj = Object.create(constructor.prototype);
  // 修改构造函数内部的this指针
  const res = constructor.apply(obj, args);
  // 判断最终需要返回的对象结果
  return res instanceof Object ? res : obj;
}
```
