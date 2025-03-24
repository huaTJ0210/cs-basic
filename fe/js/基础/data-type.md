---
title: "javascript的数据类型"
date: "2018/3/5"
categories:
  - web
tags:
  - javascript
toc: true
---

## 数据类型

<!--more-->

#### undefined

> Undefined：是一个基本数据类型，它的唯一值是 undefined， 代表声明未初始化或者未声明直接获取值（直接使用有时会报错）；

```javascript
// (1)
let a; //声明但是未初始化
if (typeof a === "undefined") {
  console.log(a);
}
let b = undefined; //不建议这样使用
console.log(b);
//window.undefined 不可写，不可配置，不可枚举
console.log(window.undefined); // undefined是window的一个属性

// （2）函数参数
function foo(c) {
  console.log(c); // undefined
}
var res = foo();
console.log(res); // undefined

// （3）undefined作为变量
function test() {
  // 局部作用域中是可以作为变量的标识符，全局模式下不可以，因为他
  // 作为window的属性不可以写
  var undefined = 1;
  console.log(undefined);
}
test();

// (4)判断一个变量有没有被赋值； null undefined:
var x = null;
if (x == undefined) {
  console.log("x 未赋值");
} else {
  console.log("x 已赋值");
}
// (5) void + 表达式
// void(0):表示返回值是一个undefined
// <a href='javascript:void(0)'></a>
```

#### null

> Null 类型：只有一个值为 null，表示空对象的指针；使用的场景：变量要存储的值是对象，但此时没有，可以先初始化为 null；

```js
let car = null; // 语义上表示car之后要存储的是对象
console.log(typeof car); // 'object';
```

##### null 和 undefined 含义差不多，为什么要设置两个这样的值？

> JavaScript 的诞生之初，借鉴 java 只设置了 null 表示“无”；但是 null 转数字时，会自动变 0；
>
> 设计者表示如果 null 自动转为 0，很不容易发现错误，就又设计了 undefined，表示“此处无定义”的原始值，转为数字为 NaN

#### Boolean

> - Boolean 数据类型只有两个值：true 和 false
> - 其他数据类型可以通过 Boolean()转化为 Boolean 类型

```javascript
// ------- 隐式的数据类型转化 -------
// (2-1) String
let name = "";
Boolean(name); // false
let address = "beijing";
Boolean(address); // true

//(2-2) Number:
Boolean(0); // false
Boolean(NaN); // false
Boolean(1); // true 非0值都是转化为true

// (2-3) Undefined
Boolean(undefined); // false

// (2-4) Object
Boolean(null); // false ： 非空对象

// (2-5) if语句中会自动将值转为为Boolean类型
```

#### Number

> JavaScript 内部，所有数字都是以 64 位浮点数形式储存，即使整数也是如此。所以，`1`与`1.0`是相同的，是同一个数。

```javascript
/*
    (1) 数值精度
    javaScript 浮点数的64个二进制位，从最左边开始，是这样组成的。

    - 第1位：符号位，`0`表示正数，`1`表示负数
    - 第2位到第12位（共11位）：指数部分 ,决定数值的大小
    - 第13位到第64位（共52位）：小数部分（即有效数字）
    */

// （2）基本方法

// (2-1) parseInt(number,idx):用于将字符串转化为整数,idx代表进制
parseInt("123"); // 123

// (2-2)parseFloat(): 将字符串转为浮点
parseFloat("3.14"); // 3.14

// (2-3) isFinite方法返回一个布尔值，表示某个值是否为正常的数值。
isFinite(Infinity); // false
isFinite(-Infinity); // false
isFinite(NaN); // false
isFinite(undefined); // false
isFinite(null); // true
isFinite(-1); // true

// (2-4) Number.prototype.toFixed() : 将一个数转化为指定位数的小数
(10.055).toFixed(2); // 10.05
(10.005).toFixed(2); // 10.01 会四舍五入

// (2-5)Number.prototype.toLocaleString() ： 对数字进行格式化
(123).toLocaleString("zh-Hans-CN", {
  style: "currency",
  currency: "CNY",
}); // "￥123.00"
(123).toLocaleString("de-DE", { style: "currency", currency: "EUR" }); // "123,00 €"
(123).toLocaleString("en-US", { style: "currency", currency: "USD" }); // "$123.00"

// (2-6) NaN : 不是数值
console.log(0 / 0);
console.log(+0 / -0);
console.log(5 / 0); // Infinity
isNaN(NaN); // true
isNaN("10"); // false 可以转化为数值

// (2-7) 数值转换
Number(true); // 1
Number(false); // 0

Number(null); // 0
Number(undefined); // NaN

// (2-8)
0;
+0;
-0;
```

##### 0.1 + 0.2 === 0.3 ==》 false

> 原因： 计算机在将小数转化为存储二进制时，将十进制的小数 乘 2 取整数，这样会导致产生无限循环小数，但存储位数有限，会舍弃超出精度的位置由此导致数据失真了；以至于计算结果产生问题
> 解决方案： 使用对应的处理库（bignumber.js）

##### 浮点数的运算

```js
const operation = {
  /**
   * 将传入的参数转化为数组
   */
  getParams(args) {
    return Array.prototype.concat.apply([], args);
  },

  /**
   * 获取每个浮点数的乘数因子
   * 没有小数点则返回1
   * 有小数点：1.2返回10,1.21返回100
   */
  multiplier(x) {
    const parts = x.toString().split(".");
    return parts.length < 2 ? 1 : Math.pow(10, parts[1].length);
  },

  /**
   * 获取多个数中最大的乘数因子
   */
  collectionFactor() {
    const args = Array.prototype.slice.call(arguments);
    const argsArr = this.getParams(args);
    return argsArr.reduce((accum, next) => {
      const num = this.multiplier(next);
      return Math.max(accum, num);
    }, 1);
  },

  /**
   * 加法运算
   */
  add(...args) {
    const argsArr = this.getParams(args);
    const factor = this.collectionFactor(argsArr);
    const sum = argsArr.reduce((accum, next) => {
      return accum + Math.round(next * factor);
    }, 0);
    return sum / factor;
  },
  /**
   * 减法
   */
  subtract(...args) {
    const argsArr = this.getParams(args);
    const factor = this.collectionFactor(argsArr);
    const res = argsArr.reduce((accum, next, index) => {
      if (index === 1) {
        return Math.round(accum * factor) - Math.round(next * factor);
      }
      return accum - Math.round(next * factor);
    });
    return res / factor;
  },
  /**
   * 乘法
   */
  multiply(...args) {
    const argsArr = this.getParams(args);
    const factor = this.collectionFactor(argsArr);
    const res = argsArr.reduce((accum, next) => {
      return accum * Math.round(next * factor);
    }, 1);
    return res / Math.pow(factor, argsArr.length);
  },
  /**
   * 除法
   */
  divide(...args) {
    const argsArr = this.getParams(args);
    const res = argsArr.reduce((accum, next) => {
      const factor = this.collectionFactor(accum, next);
      return Math.round(accum * factor) / Math.round(next * factor);
    });
    return res;
  },
};

// 加法
const num1 = operation.add(0.1, 0.02);
console.log(num1); // 0.12

// 减法
const num2 = operation.subtract(0.1, 0.02);
console.log(num2); // 0.08

// 乘法
const num3 = operation.multiply(0.1, 0.1);
console.log(num3); // 0.01

// 除法
const num4 = operation.divide(0.1, 0.01);
console.log(num4); // 0.01
```

##### == 的隐式类型转换

> 遇到运算操作符时，js 中会出现一下隐式类型数据的转化

```js
let a = {
  i: 1,
  toString() {
    return a.i++;
  },
};

if (a == 1 && a == 2 && a == 3) {
  console.log(1); // 会打印输出
}
```

##### 实现(5).add(3).minus(2)

> 实现：5 + 3 - 2 = 6
>
> - (5)包装为 Number 类型，会调用原型上的方法
> - 因此在 Number 的原型对象上添加 add 和 minus 方法
> - ==此处要注意浮点类型的处理==

```js
Number.prototype.add = function (i) {
  if (typeof i !== "number") {
    throw new Error("请输出数字类型");
  }
  return this.valueOf() + i;
};

Number.prototype.minus = function (i) {
  if (typeof i !== "number") {
    throw new Error("请输出数字类型");
  }
  return this.valueOf() - i;
};
```

#### String

> JavaScript 使用 Unicode 字符集; 每个字符在 JavaScript 内部都是以 16 位（即 2 个字节）的 UTF-16 格式储存。也就是说，JavaScript 的单位字符长度固定为 16 位长度，即 2 个字节。

```javascript
// 0: 字符串的长度
const str = "hello";
console.log(str.length);

// 1： 遍历字符串
for (let codePoint of "foo") {
  console.log(codePoint);
}

// 2：模板字符串 :使用 反引号（``），同时支持字符串插值
const count = 8;
const desc = `apple count is ${count}`;
console.log(desc);

// 3:  模板编译【待补充】

// 4: 实例方法：includes(), startsWith(), endsWith()
let s = "Hello world!";

//使用第二个参数n时，endsWith的行为与其他两个方法有所不同。它针对前n个字符，而其他两个方法针对从第n个位置直到字符串结尾
s.startsWith("world", 6); // true
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (search, startIndex) {
    if (typeof startIndex !== "number") {
      startIndex = 0;
    }
    return this.substring(startIndex, startIndex + search.length) === search;
  };
}

s.endsWith("Hello", 5); // true，前5个位置中存在hello
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (search, this_len) {
    if (this_len === undefined || this_len > this.length) {
      this_len = this.length;
    }
    return this.substring(this_len - search.length, this_len) === search;
  };
}

s.includes("Hello", 6); // false
if (!String.prototype.includes) {
  String.prototype.includes = function (search, start) {
    if (typeof start !== "number") {
      start = 0;
    }
    if (start + search.length > this.length) {
      return false;
    }
    return this.indexOf(search, start) !== -1;
  };
}
// 5: 实例方法：repeat()
"x".repeat(3); // "xxx"

// 6: 实例方法：padStart()：头部补全，padEnd()：尾部补全
"x".padStart(5, "ab"); // 'ababx'
"x".padStart(4, "ab"); // 'abax'

// 7:  截取字符串
var subString = "Javascript".slice(0, 4); // beginIndex,endIndex
console.log("slice:", subString);

var substr = "Javascrpt".substring(0, 4); // beginIndex endIndex
console.log("substr:", substr);

// 7-0 :替换子串
function replaceString(oldS, newS, fullS) {
  // Replaces oldS with newS in the string fullS
  for (var i = 0; i < fullS.length; i++) {
    if (fullS.substring(i, i + oldS.length) == oldS) {
      fullS =
        fullS.substring(0, i) +
        newS +
        fullS.substring(i + oldS.length, fullS.length);
      break; // break是防止死循环
    }
  }
  return fullS;
}
let fullS = "Brave New World";
// 如果oldS是newS的子串会发生死循环
replaceString("World", "OtherWorld", fullS);
console.log(fullS);

// 7-1 : 获取指定字符
const a = "cat".charAt(1);
const aCode = "cat".charCodeAt(1);
console.log(a, aCode);

/*
    8: Base64转码
    所谓 Base64 就是一种编码方法，可以将任意值转成 0～9、A～Z、a-z、`+`和`/`这64个字符组成的可打印字符。
    使用它的主要目的，不是为了加密，而是为了不出现特殊字符，简化程序的处理
    btoa()：任意值转为 Base64 编码
     atob()：Base64 编码转为原来的值
     这两个方法不适合非 ASCII 码的字符，会报错。[例如中文]
  */
function b64Encode(str) {
  return btoa(encodeURIComponent(str));
}

function b64Decode(str) {
  return decodeURIComponent(atob(str));
}
b64Encode("你好"); // "JUU0JUJEJUEwJUU1JUE1JUJE"
b64Decode("JUU0JUJEJUEwJUU1JUE1JUJE"); // "你好"
```

##### 模板字符串的替换

```js
let template = "我的名字是{{name}},年龄:{{age}}";
const context = {
  name: "li",
  age: 18,
};

function render(template, context) {
  /*
    replace方法：
    第一个参数是正则表达式；
    第二个参数是替换的内容，可以为函数类型，接收匹配到的文本和分组内容
    */
  // ? : 表示非贪婪模式，匹配到就结束
  return template.replace(
    /\{\{(.*?)\}\}/g,
    (match, key) => context[key.trim()]
  );
}

const res = render(template, context);
console.log(res); //  我的名字是li,年龄:18
```

#### Date

```javascript
// 获取当前日期 x天后的日期
var myDate = new Date();
myDate.setDate(myDate.getDate() + 12);
console.log(myDate);
var year = myDate.getFullYear();
var month = myDate.getMonth() + 1;
var day = myDate.getDate();
console.log(year + "-" + month + "-" + day);
```

#### RegExp

##### 基础语法

```javascript
// （1）字面量定义正则表达式
var regExp = /cat/;
regExp.test("cat and dog");

// (2) 正则表达式带有g修饰，表示全局搜索[lastIndex表示正则表达式下一次开始搜索的开始位置]
var r = /x/g;
var s = "_x_x";
r.lastIndex; // 0
r.test(s); // true

r.lastIndex; // 2
r.test(s); // true

r.lastIndex; // 4
r.test(s); // false

/*
基本语法
   （1）\d : 匹配一个数字
   （2）\w ： 字母、数字、下划线 等价于：[a-zA-Z0-9_]
   （3）. ： 可以匹配任意字符(\n \r 除外)
   
   ----  规定字符的长度 ---
   （4）* ： 代表前面的字符出现 (0 - n) o* :
   （5）+ : 代表前面的字符出现（1 - n） o+ : 
   （6）？ ：0或者1个
   （7）{n}:表示n个字符
   （8）{n,m}:表示n-m个字符
   /\d{3}\s+\d{3,8}/
   
   --- 精准匹配 ----
   (1) [0-9a-zA-Z\_]可以匹配一个数字、字母或者下划线；
   (2) [0-9a-zA-Z\_]+可以匹配至少由一个数字、字母或者下划线组成的字符串，比如'a100'，'0_Z'，'js2015'等等；
   (3) [a-zA-Z\_\$][0-9a-zA-Z\_\$]*可以匹配由字母或下划线、$开头，后接任意个由一个数字、字母或者下划线、$组成的字符串，也就是JavaScript允许的变量名；
   (4) [a-zA-Z\_\$][0-9a-zA-Z\_\$]{0, 19}更精确地限制了变量的长度是1-20个字符（前面1个字符+后面最多19个字符
  --- 开头、结尾、 或 ---
  (1) ^表示行的开头，^\d表示必须以数字开头。
  (2) $表示行的结束，\d$表示必须以数字结束。
*/

// (1) 匹配 0 ~ 99的正整数
var regExp = /^(?:0|[1-9]\d)$/; // (?:pattern)例如， 'industr(?:y|ies) 就是一个比 'industry|industries' 更简略的表达式。
console.log(regExp.test(00));
// (2)
```

##### 解析模板字符串

```javascript
//  '我是{{name}}，年龄{{age}}，性别{{sex}}'
function render(template, data) {
  let reg = /\{\{(\w+)\}\}/;
  if (reg.test(template)) {
    const prop = reg.exec(template)[1];
    template = template.replace(reg, data[prop]);
    return render(template, data);
  }
  return template;
}

// 简化方法
function render(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (a, b, c) => {
    //a为匹配到的正则值，例如 {{name}}
    //b为括号匹配的值，例如 name
    // c为匹配到的位置，例如 {{name}}的开始下标值
    return data[b];
  });
}
```

##### 解析 URL 为对象

```javascript
function parseParam(url) {
  const paramsStr = /.+\?(.+)$/.exec(url)[1]; // 将 ? 后面的字符串取出来
  const paramsArr = paramsStr.split("&"); // 将字符串以 & 分割后存到数组中
  let paramsObj = {};
  // 将 params 存到对象中
  paramsArr.forEach((param) => {
    if (/=/.test(param)) {
      // 处理有 value 的参数
      let [key, val] = param.split("="); // 分割 key 和 value
      val = decodeURIComponent(val); // 解码
      val = /^\d+$/.test(val) ? parseFloat(val) : val; // 判断是否转为数字

      if (paramsObj.hasOwnProperty(key)) {
        // 如果对象有 key，则添加一个值
        paramsObj[key] = [].concat(paramsObj[key], val);
      } else {
        // 如果对象没有这个 key，创建 key 并设置值
        paramsObj[key] = val;
      }
    } else {
      // 处理没有 value 的参数
      paramsObj[param] = true;
    }
  });

  return paramsObj;
}
```

##### 其他案例

```js
// 匹配HTML开始标签的正则表达式
const reg = /^<((?:[a-zA-Z_][\w]*)?[a-zA-Z_][\w]*)/;

const res1 = "<div></div>".match(reg);
// [ '<div', 'div', index: 0, input: '<div></div>', groups: undefined ]
console.log(res1);

const res2 = "</div><div>".match(reg);

console.log(res2);

let text = "1234567890";

console.log(text.match(/\B(?=(?:\d{3})+(?!\d))/g)); //[ '', '', '' ]

text = text.replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
console.log(text);
```

#### Symbol

> Symbol 类型：是 ES6 新增的符号类型:符号的主要意义是创建一个类似字符串的不会与其任何值冲突的值
>
> - 使用符号值为自定义事件命名；
> - 对象属性使用唯一标识符；

```javascript
// (1)基本使用
let sym = Symbol(); //'symbol'
// (2)使用全局符号注册表，如果没有就创建一个
let foolGlobal = Symbol.for("foo");
console.log(typeof foolGlobal); // symbol
// (3)使用符号作为属性
let s1 = Symbol("foo");
let o = {
  [s1]: "foo val",
};
// (4) Symbol.hasInstance
/*
      instanceof运算符的左边是实例对象，右边是构造函数。
      它会检查右边构造函数的原型对象（prototype），是否在左边对象的原型链上
    */
function Foo() {}
const res = foo instanceof Foo;
console.log(res);
const res1 = Foo[Symbol.hasInstance](foo);
console.log(res1);
```

#### JSON

```javascript
var obj = {
  name: "li",
  age: 18,
  address: ["1", "2", "3"],
};
var jsonStr = JSON.stringify(obj);
console.log(jsonStr);
var originObj = JSON.parse(jsonStr);
console.table(originObj);
```

#### javascript 隐式数据类型转化

> - 当对象类型进行类型转换时，会调用 js 内部一个方法 toPrimitive， 此方法接收两个参数，一个参数为需要转换的对象，另一个方法接收一个期望类型，string 或 number。
>   - 当期望值为 number 时,会调用 valueOf 方法，如果返回的值不是原始值，则继续调用 toString 方法。
>   - 当期望值为 string 时,会调用 toString 方法，如果返回的值不是原始值，则继续调用 valueOf 方法。
>
> [文章](https://blog.csdn.net/zbban_56/article/details/111875463)
