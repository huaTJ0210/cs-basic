# 函数

### 基础

#### 函数概述

> 函数是执行特定功能的一段可以反复调用的代码块；

```javascript
function foo(x, y) {
  return x + y;
}
```

#### 函数定义

##### 函数声明

> javascript 引擎会对函数声明进行提升，因此在定义之前的位置调用也是合法的

```javascript
function add(a, b) {
  return a + b;
}
```

##### 函数表达式

> 将匿名函数赋值给变量，匿名函数又叫做函数表达式

```javascript
var add = function (a, b) {
  // do sth
};
```

#### 函数属性和方法

##### 函数属性&arguments

```javascript
foo(1,2); // 函数声明会被js编译器进行提升（将foo的定义提前）
foo.length;//3 函数定义时形参数个数，不会发生改变
foo.name;// "foo"
foo.toString();// 返回字符串，函数实现的源码

function foo(x,y,z){
  arguments.length;// 2 实参个数
  arguments[0];// 1
  arguments[0] = 10;
  x; // change to 10;

  arguments[2] = 100；
  z; // still undefined!!!
}
```

##### apply/call 方法

> 定义在函数原型(Function.prototype)上的方法

```javascript
function foo(x, y) {
  console.log(x, y, this);
}
foo.call(100, 1, 2); // 1,2, Number(100)
foo.apply(true, [3, 4]); // 3,4,Boolean(true)
foo.apply(null); //undefined undefined window
foo.apply(undefined); //undefined undefined window
```

##### bind 方法

```javascript
this.x = 9; // 相当于window.x = 9;
var module = {
  x: 81,
  getX: function () {
    return this.x;
  }
};

module.getX(); // 81

var getX = module.getX;
getX(); //9，默认的this绑定，this === window

var boundGetX = getX.bind(module);
boundGetX(); // 81 ，强绑定 this === module
```

##### bind 与 new

```javascript
function foo() {
  this.b = 100;
  return this.a;
}
var func = foo.bind({ a: 1 });

func(); // 1 当前this 指向 {a:1}因此返回值为 1

var obj = new func(); //foo函数中this指向新创建的对象obj，这个对象的原型为foo.prototype
```

##### 手写 call & apply

```javascript
Function.prototype._call = function(oThis,...args) {
  if(oThis == undefined){
    oThis = window;
  }
  oThis = new Object(oThis); // 基本类型要转成对象类型

  const callFunc = this;
  const symbol = Symbol('_callThis_');
  oThis[symbol] = callFunc;

  const res = oThis[symbol](...(args||[]);
  delete oThis[symbol];
  return res;
};
```

##### 手写 bind

```javascript
Function.prototype._bind = function (oThis) {
  var aArgs = Array.prototype.slice.call(arguments, 1);
  var fToBind = this;
  var fNOP = function () {};
  var fBound = function () {
    return fToBind.apply(
      // 判断绑定函数是否被new关键字调用，如果调用了就返回绑定的this
      this instanceof fNOP && oThis ? this : oThis,
      Array.prototype.slice.call(arguments).concat(aArgs)
    );
  };
  // 构建原型链
  fNOP.prototype = fToBind.prototype;
  fBound.prototype = new fNOP();
  return fBound;
};
```

##### 超时取消回调函数

```javascript
function timeoutify(fn, delay) {
  var tm = setTimeout(() => {
    clearTimeout(tm);
    tm = null;
    fn(new Error('timeout'));
  }, delay);
  return function () {
    if (tm) {
      clearTimeout(tm);
      fn.apply(this, arguments);
    }
  };
}

ajax('http://dxxxx.com/getuser', timeoutify(fn, 500));
```

#### 作用域

##### 作用域概念

> 作用域：定义值（变量）存储或者获取的规则
>
> 在 ES5 的规范中，JavaScript 只有两种作用域：一种是全局作用域，变量在整个程序中一直存在，所有地方都可以读取；另一种是函数作用域，变量只在函数内部存在

##### 函数本身的作用域

> 函数本身也是一个值，也有自己的作用域。
>
> 它的作用域与变量一样，就是其声明时所在的作用域，==**与其运行时所在的作用域无关**。==

- 场景（一）

  ```javascript
  var a = 1;
  var x = function () {
    console.log(a);
  };

  function f() {
    var a = 2;
    x();
  }

  f(); // 1 : x()函数调用取的是函数在定义时a变量所在的作用域
  ```

- 场景（二）

  ```javascript
  var x = function () {
    console.log(a);
  };

  function y(f) {
    var a = 2;
    f();
  }

  y(x);
  // ReferenceError: a is not defined： f()--> x()--> 定义所在的作用域中没有a的定义
  ```

##### 全局作用域

> 全局对象的作用域，任意地方都可以访问到（如果没有被函数作用域覆盖）

```JavaScript
// 全局变量:挂载到window对象上
 var i = 0;
 // 定义外部函数 ： 挂载到window对象上
 function outer(){
     console.log(i); // 0：获取的是全局变量window.i
     // 定义一个内部函数
     function inner(){
       // 隐式在此处有： var i；的提升声明
         console.log(i); // undefined: 先在i所处的函数作用域中找是否有i的其他声明,由于函数作用域中存在i的其他声明，因此会把 var i；提前（变量提升），声明未赋值所以值为undefined
         var i = 1;
         console.log(i); // 1 ：在函数作用域执行完毕，函数作用域中的i会被清理
     }
     inner();
     console.log(i);// 0 ： 获取的是window.i
 }
 outer();
 console.log(i);// 0
```

##### [[Scopes]] 属性

> - 每个 javascript 函数都是一个对象，对象中有些属性我们可以访问，但有些不可以；不可以访问的属性仅供 javascript 引擎存取，[[Scopes]]就是其中一个;[[Scopes]]指的就是我们所说的作用域,其中存储了运行期上下文的集合。即作用域决定了代码区块中变量和其他资源的可见性。
> - 当函数执行时，会创建一个称为执行期上下文的内部对象。一个执行期上下文定义了一个函数执行时的环境，函数每次执行时对应的执行上下文都是独一无二的，所以多次调用一个函数会导致创建多个执行上下文，当函数执行完毕，执行上下文被销毁
> - 在函数中查找变量，从其作用域链的顶端依次向下查找，从 Scope chain 的 0 位依次查到最后一位。

![scopes](../img/js/scopes.png)

###### 1、 示例

```javascript
function a() {
  function b() {
    var y = 234;
    x = 0;
  }
  var x = 123;
  b(); // 执行该函数将x的值给修改了；
  console.log(x); // 0
}
var glob = 100;
a();
```

###### 2、 a 函数定义

> a()函数定义,其 scope 中存放 Global Object

![a函数执行](../img/js/a函数定义.png)

###### 3、 a 函数执行

> a 函数执行时，形成作用域链，Scope chain[0] 存放 Activation Object， Scope chain[1] 存放 Global Object

![a函数执行](../img/js/a函数执行.png)

###### 4、 b 函数定义

> b 函数定义，因为它是 a 函数内部的函数，因此其执行期上下文与 a 函数执行时是一样的；

![b函数定义](../img/js/b函数定义.png)

###### 5、 b 函数执行

> b 函数执行时，产生自己的 AO，在作用域链中将 a 函数的 AO 与 GO 储存位置下移，第 0 位存自己的 AO

![b函数执行](../img/js/b函数执行.png)

###### 7、 最终

> b 函数 Scope chain 储存的 a 函数的 AO 与 a()中的 AO 一样，只是将其引用挂到里面，即通过 b()中可以改变 a()中变量的值

##### var 声明变量的作用域问题

```js
// 引发问题的代码：1秒后全部输出为10;主要原因是var声明的变量污染了全局作用域
for (var i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}

// 解法1 ： 利用let的块级作用域
for (let i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}
// 解法2 ： 利用IIFE的闭包实现
for (var i = 0; i < 10; i++) {
  (function (i) {
    setTimeout(() => {
      console.log(i);
    }, 1000);
  })(i);
}
```

#### 顶层对象

> [ES2020](https://github.com/tc39/proposal-global) 在语言标准的层面，引入`globalThis`作为顶层对象。也就是说，任何环境下，`globalThis`都是存在的，都可以从它拿到顶层对象，指向全局环境下的`this`。

```javascript
var b = 1;
// 如果在 Node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.b; // 1

let a = 1;
window.a; // undefined ; 挂载在全局scope的script下，见下图：
```

![顶层对象](../img/js/顶层对象.png)

#### 原始值与引用值

> 原始值就是最简单的数据，主要包含：Undefined、Null、Boolean、Number、String 和 Symbol；
>
> 引用值是由多个值组成的对象；

##### 动态属性

```javascript
// (1)引用类型可以添加属性
let person = new Object();
person.name = 'yi';
console.log(person.name);

// (2) 基本类型不能添加属性
let name = 'zheng';
name.age = 18;
console.log(name.age); // undefined
```

##### 复制值

```javascript
// (1) 基本类型: 赋值之后之后互不相干
let num1 = 5；
let num2 = num1;
num2 = 100;
console.log(num1,num2);// 5,100

// (2)引用类型: 两个指针指向内存的同一块区域
let obj1 = {};
let obj2 = obj1;
obj.name = 'zheng';
console.log(obj1.name,obj2.name);// 'zheng' 'zheng'
```

##### 传递参数

```javascript
//(1) 函数的形参传递是值传递；
function addTen(num) {
  num += 10;
  return num;
}
let count = 20;
let result = addTen(count);
console.log(count); // 20
console.log(result); // 30

//(2) 函数参数是引用类型也是值传递；
function setName(obj) {
  obj.name = 'li';
  // 指针指向另外的区域
  obj = new Object();
  obj.name = 'wang';
}
let person = new Object();
setName(person);
console.log(person.name); // 'li'
```

#### 闭包

> 函数内部提供一个在函数作用域外可以访问函数作用域内标识符（变量）的接口，这个接口就是闭包

```javascript
// (1) 函数外部无法读取函数内部声明的变量
function f1() {
  var n = 999;
}
console.log(n); // n is not defined

// (2) 函数内部的局部变量可以在函数内部定义一个函数来读取
function f1() {
  var n = 999;
  function f2() {
    console.log(n); // 999
  }
}

// (3) 将函数内部定义的内部函数作为返回值返回，这样在函数外部就能读取到函数内的局部变量了
function f1() {
  var n = 999;
  function f2() {
    console.log(n); // 999
  }
  return f2;
}
var result = f1();
result(); // 999  : 闭包就是函数f2，即能够读取其他函数内部变量的函数
```

##### 闭包的用处

> 闭包的最大用处有两个：
>
> - 一个是可以读取函数内部的变量，
> - 另一个就是让这些变量始终保持在内存中，即闭包可以使得它诞生环境一直存在；

###### 闭包使得内部变量记住上一次调用时的运算结果。

```javascript
function createIncrementor(start) {
  return function () {
    return start++;
  };
}

var inc = createIncrementor(5);

inc(); // 5
inc(); // 6
inc(); // 7
// 原因就在于inc始终在内存中，而inc的存在依赖于createIncrementor，因此也始终在内存中，不会在调用结束后，被垃圾回收机制回收。
```

###### 封装对象的私有属性和私有方法

```javascript
function Person(name) {
  var _age;
  function setAge(n) {
    _age = n;
  }
  function getAge() {
    return _age;
  }

  return {
    name: name,
    getAge: getAge,
    setAge: setAge
  };
}

var p1 = Person('张三');
p1.setAge(25);
p1.getAge(); // 25
```

##### 闭包实例

```javascript
// 基本函数
function outer() {
  var localVal = 30;
  return localVal;
}
outer(); // 30

// 函数内部返回函数
function outer() {
  var localVal = 30;
  return function () {
    return localVal;
  };
}

var func = outer();
func(); // 30
```

##### 闭包-常见错误之循环闭包

```javascript
document.body.innerHTML =
  '<div id=div1>aaa</div>' +
  '<div id=div2>bbb</div>' +
  '<div id=div3>ccc</div>';
for (var i = 1; i < 4; i++) {
  document.getElementById('div' + i).addEventListener('click', function () {
    alert(i); // all are 4
  });
}

// 如何解决上述问题:
for (var i = 1; i < 4; i++) {
  !(function (i) {
    document.getElementById('div' + i).addEventListener('click', function () {
      alert(i); //
    });
  })(i);
}
```

#### 立即执行函数

> 定义函数后立即调用

```javascript
function(){ /* code */ }();
// SyntaxError: Unexpected token
// JavaScript 规定，如果function关键字出现在行首，一律解释成语句。因此，引擎看到行首是function关键字之后，认为这一段都是函数的定义，不应该以圆括号结尾，所以就报错了

// 解决方法：添加小括号：这种写法就叫做立即调用函数：IIFE
(function(){ /* code */ }());
```

> 【立即执行函数的使用场景】
>
> 一、是不必为函数命名，避免了污染全局变量；
>
> 二、是 IIFE 内部形成了一个单独的作用域，可以封装一些外部无法读取的私有变量。

```javascript
// 写法一 : 完全污染了全局变量
var tmp = newData;
processData(tmp);
storeData(tmp);

// 写法二
(function () {
  var tmp = newData;
  processData(tmp);
  storeData(tmp);
})();
```

### this

#### this 的规则

> - this 不指向函数本身，也不指向函数的作用域；
> - this 是函数执行上下文的一个属性，在函数运行时绑定，遵循一下规则：
>   - 默认绑定，函数直接调用无修饰，默认 this 绑定 window，严格模式下绑定 undefined
>   - 隐式绑定：函数的调用有上下文对象修饰：obj.foo()等，this 绑定上下文对象
>   - 强绑定：call、apply、bind 情况下，this 绑定函数指定的对象
>   - new 操作符，this 绑定创建的新对象
>   - 箭头函数 this 绑定取决于箭头函数执行所在的作用域函数 this 的绑定

#### this 场景

##### 一般函数的（浏览器）

```javascript
function f1() {
  return this;
}
f1() === window; //true： 默认绑定

function f2() {
  'use strict'; //严格模式下
  return this;
}
f2() === undefined; // true
```

##### 作为对象方法的函数的 this

```javascript
// (1)
var o = {
  prop: 37,
  f: function () {
    return this.prop;
  }
};
console.log(o.f()); // 37 ： 使用o调用，属于隐式调用 this 绑定当前对象 o

// (2) this 等于当前对象 o
var o = { prop: 37 };
function independent() {
  return this.prop;
}
o.f = independent;
console.log(o.f());
```

##### 对象原型链上的 this

```javascript
var o = {
  f: function () {
    return this.a + this.b;
  }
};
var p = Object.create(o);
p.a = 1;
p.b = 4;

console.log(p.f()); //5 ： this隐式绑定了p
```

##### get/set 方法与 this

```javascript
function modulus() {
  return Math.sqrt(this.re * this.re + this.im * this.im);
}

var o = {
  re: 1,
  im: -1,
  get phase() {
    return Math.atan2(this.im + this.re);
  }
};

Object.defineProperty(o, 'modulus', {
  get: modulus,
  enumerable: true,
  configurable: true
});

console.log(o.phase, o.modulus); // -0.78 1.4142
```

##### 构造器（new）中的 this

```javascript
function MyClass() {
  this.a = 37;
}

var o = new MyClass();
console.log(o.a); //37

function C2() {
  this.a = 37;
  return { a: 38 };
}
o = new C2();
console.log(o.a); // 38
```

##### call/apply 方法与 this

```javascript
function add(c, d) {
  return this.a + this.b + c + d;
}

var o = { a: 1, b: 3 };
add.call(o, 5, 7); // 1+3+5+7 = 16
add.apply(o, [10, 20]); // 1+3+10+20 = 34

function bar() {
  console.log(Object.prototype.toString.call(this));
}
bar.call(7); // "[object Number]"
```

##### bind 方法与 this

```javascript
function f() {
  return this.a;
}
// bind接收一个对象，当你想把函数的this指针修改时可以采用bind
var g = f.bind({ a: 'test' });
console.log(g()); // test

var o = { a: 37, f: f, g: g };
console.log(o.f(), o.g()); //37,test
```

#### this 常见问题

##### 普通函数的 this 指针

```javascript
// 情况1：
function foo() {
  console.log(this);
}
foo(); // 默认绑定，非严格模式，因此this指向window

// 情况2：
function foo() {
  console.log(this);
}
var obj = {
  foo: foo
};
obj.foo(); // 隐式调用，因此this指向obj;
```

##### 普通函数的 setTimeout：this 指针

```javascript
// 情况1：默认绑定
function foo() {
  console.log(this);
  setTimeout(function () {
    console.log(this);
  }, 100);
}
foo();

// 情况2：
function foo() {
  console.log(this); // 隐式绑定
  setTimeout(function () {
    console.log(this); // 默认绑定
  }, 100);
}
var obj = {
  foo: foo
};
obj.foo();
```

##### 箭头函数的 setTimeout：this 指针

```javascript
// 情况1：
function foo() {
  console.log(this); // 默认绑定
  setTimeout(() => {
    console.log(this); // 箭头函数this的绑定取决于运行时所在外层作用域的this的绑定
  }, 100);
}
foo();

// 情况2：
function foo() {
  console.log(this); //隐式绑定
  setTimeout(() => {
    console.log(this); // 箭头函数this的绑定取决于运行时所在外层作用域的this的绑定
  }, 100);
}
var obj = {
  foo: foo
};
obj.foo();
```

##### 构造函数的 this

> `Timer`函数内部设置了两个定时器，分别使用了箭头函数和普通函数。
>
> - 前者的`this`绑定新创建的 timer 对象
> - 后者的 this 使用的是默认绑定，绑定了 window
> - 因此 3100 毫秒之后，`timer.s1`被更新了 3 次，而`timer.s2`一次都没更新

```javascript
function Timer() {
  this.s1 = 0;
  this.s2 = 0;
  // 箭头函数
  setInterval(() => this.s1++, 1000);
  // 普通函数
  setInterval(function () {
    this.s2++;
  }, 1000);
}

var timer = new Timer();

setTimeout(() => console.log('s1: ', timer.s1), 3100);
setTimeout(() => console.log('s2: ', timer.s2), 3100);
// s1: 3
// s2: 0 // 实际的this.s2 每次都是NaN
```

##### 箭头函数可以让`this`指向固定化，这种特性很有利于封装回调函数

> 下面代码的`init`方法中，使用了箭头函数，这导致这个箭头函数里面的`this`，总是指向`handler`对象。否则，回调函数运行时，`this.doSomething`这一行会报错，因为此时`this`指向`document`对象。

```javascript
var handler = {
  id: '123456',

  init: function () {
    document.addEventListener(
      'click',
      // 当前this指向handler
      (event) => this.doSomething(event.type),
      false
    );
  },

  doSomething: function (type) {
    console.log('Handling ' + type + ' for ' + this.id);
  }
};
```

##### 箭头函数中根本没有自己的 this

> 下面代码的`init`方法中，使用了箭头函数，这导致这个箭头函数里面的`this`，总是指向`handler`对象。否则，回调函数运行时，`this.doSomething`这一行会报错，因为此时`this`指向`document`对象。

```javascript
// ES6
function foo() {
  setTimeout(() => {
    console.log('id:', this.id);
  }, 100);
}

// ES5
function foo() {
  var _this = this;
  setTimeout(function () {
    console.log('id:', _this.id);
  }, 100);
}
// 转换后的 ES5 版本清楚地说明了，箭头函数里面根本没有自己的this，而是引用外层的this。
```

##### 请问下面的代码之中有几个`this`？

> 下面代码之中，只有一个`this`，就是函数`foo`绑定的`this`，所以`t1`、`t2`、`t3`都输出同样的结果。因为所有的内层函数都是箭头函数，都没有自己的`this`，它们的`this`其实都是最外层`foo`函数的`this`绑定的值。

```javascript
function foo() {
  return () => {
    return () => {
      return () => {
        console.log('id:', this.id);
      };
    };
  };
}

var f = foo.call({ id: 1 });

var t1 = f.call({ id: 2 })()(); // id: 1
var t2 = f().call({ id: 3 })(); // id: 1
var t3 = f()().call({ id: 4 }); // id: 1
```

##### 不适合使用箭头函数

> 由于箭头函数使得`this`从“动态”变成“静态”，下面两个场合不应该使用箭头函数。

```javascript
// 第一个场合是定义对象的方法，
const cat = {
  lives: 9,
  jumps: () => {
    this.lives--;
  }
};

// 第二个场合是需要动态this的时候，也不应使用箭头函数。
var button = document.getElementById('press');
button.addEventListener('click', () => {
  this.classList.toggle('on'); // 此时this指向了window
});
```

### 箭头函数

```javascript
/*
  1、如果只有一个参数，()可以省略
  2、如果只有一个return,可以省略{}
*/
function foo() {
  alert('abc');
}

let foo = () => {
  alert('abc');
};

let arr = [12, 5, 8, 99, 44, 34];
arr.sort((n1, n2) => {
  return n1 - n2;
});
// 省略写法
arr.sort((n1, n2) => n1 - n2);
```

#### 函数参数

##### 参数的扩展/展开

```javascript
/*
  参数扩展： rest parameter
  1、收集剩余参数：参数必须放在函数参数末尾
  2、展开数组； ...arr 
*/

function show(a, b, ...args) {
  alert(a);
  alert(b);
  alert(args);
}
show(12, 15, 8, 9, 34);

// 例子
function show(...args) {
  fn(...args);
}
function fn(a, b) {
  alert(a + b);
}
show(12, 5);
```

##### 默认参数

```javascript
function show(a, b = 15) {
  alert(a);
  alert(b);
}
show(10);
```

### 垃圾回收

> 垃圾回收：JavaScript 是执行环境负责在代码执行时负责管理内存；

#### 标记清理法

> 当变量进入执行上下文进行标记，当变量出上下文也进行标记清除；
>
> 随后垃圾回收程序会做一次内存清理，回收内存；

#### 引用计数

> 对每个值都记录它被引用的次数，引用次数为 0 时，就会被清理

### 函数的扩展

#### 函数柯里化

> 将使用多个参数的函数转换成一系列使用一个参数的函数调用的技术

```javascript
function curry(func) {
  const _func = (...args) => {
    if (args.length === func.length) {
      return func(...args);
    } else {
      return (...arg) => _func(...args, ...arg);
    }
  };
  return _func;
}

// 示例

function add(a, b, c) {
  return a + b + c;
}
const res = add(1, 2, 3);
console.log(res);

let addCurry = curry(add);
const res1 = addCurry(1)(2)(3);
console.log(res1);
```

#### 偏函数

```javascript
function partial(fn, ...args) {
  return (...arg) => {
    return fn(...args, ...arg);
  };
}
```

#### compose 函数

> - compose 函数是从右向左去执行参数（函数类型），a(b(c(x)))
> - 从左向右的数据执行流就是 pipe 函数了:c(b(a(x))) ,

```javascript
let add = (a) => {
  return a + 1;
};

let multiple = (b) => {
  return b * 10;
};
const compose =
  (...args) =>
  (x) =>
    args.reduceRight((res, cb) => cb(res), x);

let calculate = compose(add, multiple);
console.log(calculate(1)); // 11

const pipe =
  (...args) =>
  (x) =>
    args.reduce((res, cb) => cb(res), x);
```

#### 实现一个 add 函数

> 实现一个 add 函数，要求完成：
>
> - add(1) : 1
> - add(1)(2) : 3
> - add(1)(2)(3) : 6

```js
function add() {
  let args = [...arguments];
  let addFunc = function () {
    args.push(...arguments);
    return addFunc;
  };
  addFunc.toString = function () {
    return args.reduce((x, y) => x + y);
  };
  return addFunc;
}

// 将函数转化为String类型，直接打印会打出函数的实现
console.log('' + add(1)(2)(3));
```

#### 实现深层获取对象的值

```js
const getKey = (keys, target) => {
  return keys.reduce((obj, key) => {
    return obj && obj[key] ? obj[key] : null;
  }, target);
};

// 使用

const obj = {
  user: [
    {
      comments: '123'
    }
  ]
};
const res = getKey(['user', 0, 'comments'], obj);
```

#### 实现函数的缓存

```js
const memoize = function (func, content) {
  let cache = Object.create(null);
  content = content || this;
  return (...key) => {
    if (!cache[key]) {
      cache[key] = func.apply(content, key);
    }
    return cache[key];
  };
};
// Test
const calc = memoize(add);
const num1 = calc(100, 200);
const num2 = calc(100, 200); // 缓存得到的结果
```
