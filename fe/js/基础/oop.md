# javascript 的面向对象

#### 1、对象继承

##### 1.1 构造函数

> 构造函数的缺点：浪费系统资源（同一个构造函数的多个实例之间无法共享属性（尤其是函数），从而造成对系统资源的浪费）

```javascript
function Cat(name, color) {
  this.name = name;
  this.color = color;
  this.meow = function () {
    console.log('喵喵');
  };
}

var cat1 = new Cat('大毛', '白色');
var cat2 = new Cat('二毛', '黑色');

cat1.meow === cat2.meow; // false ：
```

##### 1.2 原型对象及原型链

> 定义所有实例对象共享的属性和方法，实例对象是从原型对象上衍生出来的子对象

```javascript
function Cat(name, color) {
  this.name = name;
  this.color = color;
  this.meow = function () {
    console.log('喵喵');
  };
}

var cat1 = new Cat('大毛', '白色');
var cat2 = new Cat('二毛', '黑色');

// (1)原型对象：prototype每个函数都有该属性，对于构造函数来说，生成实例的时候，该属性会自动成为实例对象的原型
Cat.prototype.color = 'white';

cat1.color; // white
cat2.color; // white

// (2) 原型链：所有对象都有自己的原型，这样从实例对象到原型，再到原型的原型 就形成了原型链
//  cat1.__proto__ -> Cat.prototype （__proto__） -> Object.prototype -> null
```

##### 1.3 寄生继承

> 基于原型链及盗用构造函数

```javascript
function Shape() {
  this.x = 0;
  this.y = 0;
}
Shape.prototype.move = function (x, y) {
  this.x += x;
  this.y += y;
  console.info('Shape moved');
};
// 子类继承父类的实例
function Rectangle() {
  //调用父类的构造函数
  Shape.call(this);
}
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;
```

##### 1.4 实现 JavaScript 的多重继承（Mixin：混入技术）

```javascript
function M1() {
  this.hello = hello;
}
function M2() {
  this.world = world;
}

function S() {
  // 1 调用父类的构造函数
  M1.call(this);
  M2.call(this);
  // 2 继承链上加上M1
  S.prototype = Object.create(M1.prototype);
  // 3 继承链上加上M2
  Object.assign(S.prototype, M2.prototype);
  // 4 指定构造函数

  S.prototype.constructor = S;
}
```

##### 1.5 constructor

> constructor 属性的作用:可以得知某个实例对象，到底是哪一个构造函数产生的； constructor 属性表示原型对象与构造函数之间的关联关系；

##### 1.6 instanceof

> a instanceof B：
>
> a 的原型链上是否存在构造函数 B

```javascript
/*
v instanceof Vehicle;
Vehicle.prototype.isPrototypeOf(v);
*/

//(1) 由于instanceof 检查整个原型链，因此同一个实例对象，可能会对多个构造函数都返回true
var d = new Date();
d instanceof Date; // true
d instanceof Object; // true

// （2) instanceof判断失真的情况: instanceof 只能用于对象，不能用于原始类型的值
var obj = Object.create(null);
typeof obj; // "object"
obj instanceof Object; // false

// (3)实现instanceof方法
function instanceof(left,right){
  if(typeof left !== 'object'){
    return false;
  }
  while(true){
    if(left === null){
      return false;
    }
    if(right.prototype === left.__proto__){
      return true;
    }
    left = left.__proto__;
  }
}
```

#### 2、相关方法

> Object 对象的相关方法，用来处理面向对象编程的相关操作

```javascript
// (1) 获取参数对象的原型
var F = function () {};
var f = new F();
Object.getPrototypeOf(f) === F.prototype;
// (2) 为参数对象设置原型
var a = {};
var b = { x: 1 };
Object.setPrototypeOf(a, b);
Object.getPrototypeOf(a) === b;

// (3) 使用一个对象创建另一个对象
var A = {
  print: function () {
    console.log('hello');
  }
};
var B = Object.create(A);
Object.getPrototypeOf(B) === A; // true
B.print();

//(4) 判断对象是否为参数对象的原型
var o1 = {};
var o2 = Object.create(o1);
var o3 = Object.create(o2);
o2.isPrototypeOf(o3);
```

##### 2.1 对象拷贝

> - 浅拷贝 ：Object.assign(),会导致引用类型只复制一个引用，两个对象会有耦合
> - 深拷贝 ： 完全复制一个新的对象

```javascript
// 浅拷贝
function shadowClone(source) {
  if (source == undefined || typeof source !== 'object') {
    return source;
  }
  const newObj = source instanceof Array ? [] : {};
  for (let k in source) {
    if (source.hasOwnProperty(k)) {
      newObj[k] = source[k];
    }
  }
  return newObj;
}

// ES5 ： 深拷贝对象
function deepClone(source, target) {
  var tar = target || {};
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && key !== null) {
        tar[key] =
          Object.prototype.toString.call(source[key]) === '[object Array]'
            ? []
            : {};
        deepClone(source[key], tar[key]);
      } else {
        tar[key] = source[key];
      }
    }
  }
  return tar;
}

// ES6
function deepClone(source, hashMap = new WeakMap()) {
  if (source == undefined || typeof source !== 'object') {
    return source;
  }
  if (source instanceof Date) {
    return new Date(source);
  }
  if (source instanceof RegExp) {
    return new RegExp(source);
  }
  // 判断当前对象是否已经被clone过了
  if (hashMap.get(source)) {
    return hashMap.get(source);
  }
  let target = new source.constructor(); // 创建一个[]或者{}
  // 记录当前对象已被克隆
  hashMap.set(source, target);
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      target[key] = deepClone(source(key), hashMap);
    }
  }
  return target;
}

var obj = {
  name: 'li',
  age: 18,
  hoddy: ['basketball', 'running', 'walking'],
  info: {
    address: 'beijing',
    company: 'lxl',
    work: 18
  }
};
// var newObj = deepClone(obj);
// newObj.info.work = 34;
// console.log(obj);
// console.log(newObj);

let test1 = {};
let test2 = {};

test2.test1 = test1; // 循环引用问题
test1.test2 = test2;

console.log(test2);
```

#### 3、实例变量与 new 命令

```javascript
/*
(1) Object Oriented Programming[OOP]：一种主流的编程范式【范式：公认的模型或者模式】
(2) JavaScript语言的对象体系，不是基于“类”的，而是基于构造函数（constructor）和原型链（prototype）
(3) 构造函数（constructor）：专门用来生成实例对象的函数，他就是对象的模板；
*/
// 构造函数：函数内部使用this代表将要新生成的实例对象，并且使用new关键字创建实例对象
var Student = function (name) {
  this.name = name;
};
/*
 new 命令的原理
 （1） 创建一个空对象，作为要返回的对象实例；
 （2） 将空对象的原型，指向构造函数的【prototype】属性
 （3） 将空对象赋值给函数内部的this关键字
 （4） 开始执行构造函数内部的代码
*/

var stu = new Student('li');

// *** new命令简化的内部流程图 ***
function _new(/* 构造函数 */ constructor, /* 构造函数参数 */ params) {
  // 将 arguments 对象转为数组
  var args = [].slice.call(arguments);
  // 取出构造函数
  var constructor = args.shift();
  // 创建一个空对象，继承构造函数的 prototype 属性
  var context = Object.create(constructor.prototype);
  // 执行构造函数
  var result = constructor.apply(context, args);
  // 如果返回结果是对象，就直接返回，否则返回 context 对象
  return typeof result === 'object' && result != null ? result : context;
}

// 实例
// var actor = _new(Person, '张三', 28);

var person1 = {
  name: '张三',
  age: 38,
  greeting: function () {
    console.log("Hi! I'm " + this.name + '.');
  }
};

var person2 = Object.create(person1);
console.dir(person2);
```

#### 4、this

```javascript
// (1) this 就是属性或者方法当前所在的对象
var person = {
  name: '张三',
  describe: function () {
    return '姓名' + this.name;
  }
};
person.describe(); // "姓名：张三"

/*
  (2) 由于函数可以在不同的运行环境中执行，因此要提供一种机制在函数体内部获取当前的执行环境；
  所以this就出现了，它设计的目的就是在函数体内部，指代函数当前的运行环境
*/

// (3) Function.prototype.call():指定函数内部this的指向（函数执行所在的作用域）
//  func.call(thisValue, arg1, arg2, ...) : 其他参数为函数调用时需要的参数
var obj = {};
var f = function () {
  return this;
};
f() === window; // true
f.call(obj) === obj; //true

// (3-1) call方法可以调用对象的原生方法（继承得到的方法）
Object.prototype.hasOwnProperty.call(obj, 'toString');

// (4) Function.prototype.apply(thisValue,[args1,args2,args3])
// (4-1)找出数组中最大数
var a = [10, 2, 4, 15, 9];
Math.max.apply(null, a);
Array.apply(null, ['a', , 'b']);

// (5) Function.prototype.bind() ： 将函数体内的this绑定到某个对象上，返回一个新函数

var counter = {
  count: 0,
  inc: function () {
    this.count++;
  }
};
var func = counter.inc.bind(counter);
func();
counter.count; // 1
```

#### 5、super

> super:间接代表 Object.getPrototypeOf();
>
> - 派生类的方法可以通过 super 关键字引用它们的原型。这个关键字只能在派生类中使用，而且仅限于类构造函数、实例方法和静态方法内部。在类构造函数中使用 super 可以调用父类构造函数。
> - ES6 给类构造函数和静态方法添加了内部特性[[HomeObject]]，这个特性是一个指针，指向定义该方法的对象。这个指针是自动赋值的，而且只能在 JavaScript 引擎内部访问。super 始终会定义为[[HomeObject]]的原型。

#### 6、谈谈对原型及原型链的认识

##### 6.1 基本概念

> - 每个函数创建后都有一个 prototype 的属性，它指向一个对象即原型对象
> - 以构造函数创建的实例内部存在一个部分浏览器支持的`_proto_`的指针指向原型对象
> - 原型对象内部也有`_proto_`，指向它的原型对象，指针最终指向 Object.prototype,这样构成的链就是原型链

##### 6.2 使用场景

> - 实例属性的动态查找
> - 继承机制--实现属性和方法的共享
> - 原生构造函数方法的共享：String 和 Array 的实例可以使用 Object.prototype 上的方法

#### 7、继承

##### 7.1 组合继承

```javascript
// 组合式继承
function inherit(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
  Child.super = Parent;

  // 静态属性继承
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(Child, Parent);
  } else if (Child.__proto__) {
    Child.__proto__ = Parent;
  } else {
    for (const k in Parent) {
      if (Parent.hasOwnPrototype(k) && !(k in Child)) {
        Child[k] = Parent[k];
      }
    }
  }
}

function Parent() {
  this.name = 'li';
}
// 原型方法
Parent.prototype.say = function () {
  console.log(this.name);
};
// 静态属性
Parent.className = 'className';

function Child() {
  Parent.call(this); //父类构造函数，继承实例属性
}

inherit(Child, Parent);

const child = new Child();
child.say();
console.log(Child.className); // Child.__proto__
```

##### 7.2 为什么不能直接 Child.prototype = Parent.prototype

> 如果直接赋值 Child.prototype 对象的改动会关联 Parent.prototype，增加耦合性

##### 7.3 extends

> extends 是基于 babel 转化的代码

[图片来源：深入理解 Class 和 extends 原理](https://juejin.cn/post/7001025002287923207)

```javascript
function _inherits(subClass, superClass) {
  // 判断superClass的类型
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function');
  }
  // 设置 subClass.prototype 的 [[Prototype]]指向 superClass.prototype 的 [[Prototype]]
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true }
  });
  // 设置 subClass 的 [[Prototype]] 指向 superClass
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}
```

##### 7.4 谈谈 ES5 中的继承与 ES6 有什么不同？

> - ES6 中提供了 class 和 extends 关键字来实现继承，但 class 的本质也是基于构造函数的
> - 基于 extends 的代码可以看出 ES6 中多了一步 【设置 subClass 的 [[Prototype]] 指向 superClass】，
> - 为什么要设置 subClass.**proto** = superClass 【主要为了实现静态属性的继承】
> - [参考资料](https://blog.csdn.net/liangklfang/article/details/64919861?spm=1001.2101.3001.6650.4&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-4-64919861-blog-98735440.pc_relevant_recovery_v2&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-4-64919861-blog-98735440.pc_relevant_recovery_v2&utm_relevant_index=5)

#### 8、new 关键字的代码实现

```javascript
// *** new命令简化的内部流程图 ***
function _new(/* 构造函数 */ constructor, /* 构造函数参数 */ params) {
  // 将 arguments 对象转为数组
  var args = [].slice.call(arguments);
  // 取出构造函数
  var constructor = args.shift();
  // 创建一个空对象，继承构造函数的 prototype 属性
  var context = Object.create(constructor.prototype);
  // 执行构造函数
  var result = constructor.apply(context, args);
  // 如果返回结果是对象，就直接返回，否则返回 context 对象
  return typeof result === 'object' && result != null ? result : context;
}
```

#### 9、函数的原型

```javascript
Function.prototype.a = () => {
  console.log(1);
};

Object.prototype.b = () => {
  console.log(2);
};

function A() {}
const a = new A();

console.log(a.__proto__ == A.prototype); // true
console.log(A.__proto__ == Function.prototype); // true
console.log(A.prototype.__proto__ == Object.prototype); // true
console.log(Function.prototype.__proto__ == Object.prototype); // true

// a.a(); //  a.a is not a function
a.b(); // 2
A.a(); // 1
A.b(); // 2
```
