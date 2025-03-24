#### 1、CommonJS 模块化

> Node 对于 CommonJS 的实现：运行时加载所有导出的值赋值到**module.exports**对象的属性，因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化；

<!--more-->

##### 1.1 CommonJS 处理 js 文件

> CommonJS 模块规范下会将每个 js 文件包装成一个函数

```javascript
// (1)将js文件中的代码进行包装
function wrapper(script) {
  return (
    '(function (exports, require, module, __filename, __dirname) {' +
    script +
    '\n})'
  );
}

// (2) 返回包装之后的函数
const modulefunction = wrapper(`
  const sayName = require('./hello.js')
    module.exports = function say(){
        return {
            name:sayName(),
            author:'我不是外星人'
        }
    }
`);
```

##### 1.2 require()加载机制

###### 1.2.1 require 加载不同的标识原则：

> - 像 fs、path、http 成为 node 的**核心模块**：加载的是编译后的二进制
> - 相对路径成为**文件模块** ：先根据 module_id 从全局缓存 Module.cache 中获取没有就创建一个 module 加入缓存中，然后再加载执行文件中的脚本代码；
> - 非路径形式成为自定义模块：

###### 1.2.2 加载自定义模块的流程

![加载自定义模块流程](../img/js/加载自定义模块流程.jpeg)

###### 1.2.3 require 源码

```javascript
// id 为路径标识符
function require(id) {
   /* 查找  Module 上有没有已经加载的 js  对象*/
   const  cachedModule = Module._cache[id]

   /* 如果已经加载了那么直接取走缓存的 exports 对象  */
  if(cachedModule){
    return cachedModule.exports
  }

  /* 创建当前模块的 module  */
  const module = { exports: {} ,loaded: false , ...}

  /* 将 module 缓存到  Module 的缓存属性中，路径标识符作为 id */
  Module._cache[id] = module
  /* 加载文件 */
  runInThisContext(wrapper('module.exports = "123"'))(module.exports, require, module, __filename, __dirname))
  /* 加载完成 *//
  module.loaded = true
  /* 返回值 */
  return module.exports
}
```

###### 1.2.4 require 避免循环引用

```javascript
//----- a.js ------

const { b } = require('./b.js');
b();

exports.a = function () {
  console.log('func a in a.js');
};

/*
+ 以下方式导出即使在b.js中采用异步方式导出也是获取不到a的值
+ 主要原因是 在b.js：const{ a} = require('./a.js'); 导出的这个对象是一个{},后续a.js中module.exports
被赋值了一个新的对象；两者之间没有联系了；
const a = function(){
  console.log('func a in a.js');
}
module.exports={
  a
}
*/

//----- b.js-----

const { a } = require('./a.js');
/*
 + 执行a函数会报： Uncaught ReferenceError: a is not defined；
 + 原因：此时require('./a.js');是从缓存中获取的，module.exports只是一个空对象，并不包含a函数
 + a.js文件中结束时采用了 module.exports的方式给了module对象的属性exports赋值了一个新对象，
 会使得之前exports.xxx = xxx;导出的属性失效；
*/
//a();
// (1)解决a函数调用问题
setTimeout(() => {
  a();
}, 0);

const b = function () {
  console.log('func b in b.js');
};
module.exports = {
  b
};

// main.js
const { a } = require('./a.js');
const { b } = require('./b.js');

console.log('main.js');
```

##### 1.4 module.exports vs exports

###### 1.4.1 基本关系

- **exports** 是**require**函数中**runInThisContext**执行**wrapper**函数传递的一个函数形参名称叫做**exports**，他的值是**module.exports;**

```javascript
// 函数定义:exports仅仅是一个函数的形参名称
function foo(exports) {
  exports.name = 'hello';
}
// 函数调用
const module = { exports: {}, loaded: false };
foo(module.exports);
```

- **exports** 只是 **module.exports**对象的一个引用值；如果给**exports**赋值一个对象则 **exports**就指向其他对象和**module.exports**无关；而文件最终导出的是**module.exports**这个对象

###### 1.4.2 基本使用

```javascript
exports.a = function () {
  console.log('a');
};

exports.b = 'b';

const foo = function () {
  console.log('foo');
};

/*
 如果将module.exports赋值为一个新对象，则会将 exports导出的值给覆盖掉
module.exports = {
  foo
}
*/
```

#### 2、ES6 模块

> - ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量；
>
> - ES6 模块不是对象，而是通过`export`命令显式指定输出的代码，再通过`import`命令输入。

```javascript
// ES6模块 ：
import { stat, exists, readFile } from 'fs';
/*
  上面代码的实质是从fs模块加载 3 个方法，其他方法不加载。
  这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，
  效率要比 CommonJS 模块的加载方式高。当然，这也导致了没法引用 ES6 模块本身，因为它不是对象。
*/
```

##### 2.1 export

> - `export`命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系。
> - `export`语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。
> - export 命令会有变量声明提前的效果

##### 2.2 export default

> `export default`就是输出一个叫做`default`的变量或方法，然后系统允许你为它取任意名字

##### 2.3 import

> - `import`命令具有提升效果，会提升到整个模块的头部，首先执行
> - `import`是静态执行，所以不能使用表达式和变量
> - `foo`和`bar`在两个语句中加载，但是它们对应的是同一个`my_module`模块,也就是说，`import`语句是 Singleton 模式。

##### 2.4 export 与 import 的复合写法

> 如果在一个模块之中，先输入后输出同一个模块，`import`语句可以与`export`语句写在一起。

```javascript
export { foo, bar } from 'my_module';

// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };
```

#### 3、ES6 模块和 CommonJS 模块的不同

> - ES6 模块编译时执行，而 CommonJS 模块总是在运行时加载
> - ES6 模块输出的是值的引用，输出接口动态绑定，而 CommonJS 输出的是对象 module.exports

#### 资料来源

> - [module](https://es6.ruanyifeng.com/#docs/module)
> - [深入浅出 Commonjs 和 ES Module](https://zhuanlan.zhihu.com/p/397999271)
> - [循环引用问题](https://juejin.cn/post/6844903834532200461)
