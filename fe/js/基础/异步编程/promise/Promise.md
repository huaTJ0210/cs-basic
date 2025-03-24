### 1、异步操作

#### 1.1、JavaScript 的单线程模型

> - JS 采用单线程模型主要为了避免多线程的 DOM 操作，让浏览器变得复杂；
> - 对于 CPU 消耗大的操作（类似 ajax 请求）JS 内部采用事件循环的方式处理任务；

#### 1.2、同步任务和异步任务

> - 同步任务：按照内存存储的顺序，执行的编译器指令；
> - 异步任务：执行编译器指令时被挂起，进入任务队列的任务；异步任务不具有：“堵塞”效应；

#### 1.3、任务队列和事件循环

> - JavaScript 运行时除了一个正在运行的主线程，还提供了一个任务队列里面是各种需要当前程序处理的异步任务；
> - JavaScript 引擎循环去检查那些挂起来的异步任务，是不是可以进入主线程，这种循环检查的机制就叫做：事件循环（event loop）

#### 1.4、异步操作的模式

```javascript
/*
  (4-1)回调函数:如果f1为异步则f2在f1执行后再执行;将f2作为回调函数传入f1中;
  回调函数的缺点：
  不利于代码的阅读和维护，各部分之间高度耦合；使得程序结构混乱，流程难以追踪（尤其多个函数嵌套的情况）
*/
function f1(callBack) {
  // do something
  callBack();
}
function f2() {}
f1(f2);

/*
  (4-2) 事件监听：采用事件驱动模式，
   缺点是整个程序都要变成事件驱动型，
   运行流程会变得很不清晰。阅读代码的时候，很难看出主流程
*/
function f3() {
  setTimeout(function () {
    // ...
    f3.trigger('done'); // f3执行完毕后触发‘done’事件的发生，进而开始执行f2
  }, 1000);
}
f3.on('done', f2);

/*
(4-3) 发布订阅模式：
因为可以通过查看“消息中心”，了解存在多少信号、
每个信号有多少订阅者，从而监控程序的运行
*/
jQuery.subscribe('done', f2);
function f1() {
  setTimeout(function () {
    // ...
    jQuery.publish('done');
  }, 1000);
}

// ******** (5) 异步操作的流程控制 **************
function asyncTask(arg, callback) {
  console.log('参数为' + arg + ',1秒后返回结果');
  setTimeout(function () {
    callback(arg * 2);
  }, 1000);
}
function finalTask(value) {
  console.log('完成:', value);
}
var items = [1, 2, 3, 4, 5, 6];
var results = [];

// (5-1) 所有异步任务串行执行:创建队列，从队列头部取异步任务
function serial(item) {
  if (item) {
    asyncTask(item, function (value) {
      results.push(value);
      return serial(items.shift());
    });
  } else {
    finalTask(results[results.length - 1]);
  }
}
serial(items.shift());

// (5-2) 并行执行
items.forEach(function (item) {
  asyncTask(item, function (result) {
    results.push(result);
    if (results.length === items.length) {
      finalTask(results[results.length - 1]);
    }
  });
});
```

#### 1.5、实现一个异步任务调度器

> JS 实现一个带并发限制的异步调度器 Scheduler

##### 1.5.1 Scheduler 的实现

```javascript
class Scheduler {
  constructor(maxConcurrentTasks) {
    this.maxConcurrentTasks = maxConcurrentTasks || 2;
    this.queue = [];
    this.runningTasks = 0;
  }
  add(task) {
    this.queue.push(task);
    this.runLoop();
  }
  runLoop() {
    if (this.queue.length > 0 && this.runningTasks < this.maxConcurrentTasks) {
      this.runningTasks++;
      const task = this.queue.shift();
      task().finally(() => {
        this.runningTasks--;
        this.runLoop();
      });
    }
  }
}
```

##### 1.5.2 测试代码

```javascript
function timeout(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
var scheduler = new Scheduler();

function addTask(time, order) {
  scheduler.add(() => timeout(time).then(() => console.log(order)));
}

addTask(1000, 1);
addTask(500, 2);
addTask(300, 3);
addTask(400, 4);

//要求
// ouput : 2 3 1 4
//一开始1,2俩个任务进入队列
//500ms时,2完成,输出2,任务3进入队列
//800ms时,3完成,输出3,任务4进入队列
//1000ms时,1完成,输出1
//1200ms时,4完成,输出4
```

#### 1.6 顺序执行 Promise

> 任务之间存在依赖关系

```js
// 异步函数
const  fl =() => new Promise((resolve, reject) => {
    setTimeout(() =>{
        console.log( 'pl 工u·nning' )
         resolve (1)
    }, 1000)



const runPromiseInSequeue = (array,value)=>{
  return  array.reduce((promiseChain,curFunc)=>{
    return  promiseChain.then(curFunc)
  },Promise.resolve(value))
}
```

### 2、Promise

> Promise 是一种引用数据类型，抽象的描述了异步操作；它充当异步操作与回调函数之间的中介，可以让异步操作写起来，就像在写同步操作的流程，而不必一层层地嵌套回调函数；

#### 2.1 错误观念：

> Promise 不是对回调的代替，Promise 在回调代码和将要执行这个任务的异步代码之间提供了一种可靠的中间机制来管理回调；

#### 2.2 Promise 构造函数

> 函数有两个参数；负责修改初始状态（pending）
>
> - resolve: 将 promise 的状态修改为 fulfilled
> - reject : 将 promise 的状态修改为 rejected

```javascript
var promise = new Promise(function (resolve, reject) {
  var isSuccess = true;
  if (isSuccess) {
    resolve();
  } else {
    reject();
  }
});
```

#### 2.3 静态方法

> - Promise.resolve() : 返回的是一个状态是 resolved 的 Promise
> - Promise.reject()：返回的是一个状态是 rejected 的 Promise

##### 2.3.1 Promise.all

> 如果有一个 rejected 的 promise 返回则直接返回，否则返回一组 fulfilled 的 promise 执行结果

```javascript
// Promise.all基本逻辑代码
Promise.all = function (promises) {
  // iterable: array/set/map 均可以
  if (!Array.isArray(promises)) {
    throw new TypeError(`${promises} is not iterable `);
  }
  const result = [];
  let count = 0;
  const length = promises.length;
  if (length === 0) {
    return Promise.resolve(promises);
  }
  return new Promise((resolve, reject) => {
    promises.forEach((p, index) => {
      p.then(
        (data) => {
          result[index] = data;
          count++;
          if (count === length) {
            resolve(result);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
};
```

##### 2.3.2 Promise.race

> 返回一组中最先更新状态的 Promise 的结果

```javascript
// Promise.race基本逻辑代码
Promise.race = function (promises) {
  if (!Array.isArray(promises)) {
    throw new TypeError(`${promises} is not iterable `);
  }
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      promise
        .then((res) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
};
```

```javascript
// [promise的执行超时了]
function foo() {
  return new Promise((resolve, relect) => {
    setTimeout(() => {
      resolve('foo excute finished!å');
    }, 1000);
  });
}

function timeoutPromise(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('timeout');
    }, delay);
  });
}
// 800毫秒 foo()未返回结果Promise.race可以直接返回结果
Promise.race([foo(), timeoutPromise(800)]).then(
  (result) => {
    console.log(result);
  },
  (error) => {
    console.log(error);
  }
);
```

##### 2.3.3 Promise.allSettled

> 返回的结果是个数组包含成功或者失败的结果

```javascript
Promise.allSettled = function (promises) {
  if (!Array.isArray(promises)) {
    throw new TypeError(`${promises} is not iterable `);
  }
  const result = [];
  const settled = 0;
  const length = promises.length;
  if (length === 0) {
    return Promise.resolve(promises);
  }
  return new Promise((resolve, reject) => {
    promises.forEach((p, index) => {
      p.then(
        (data) => {
          result[index] = {
            status: 'fulfilled',
            value: data
          };
        },
        (error) => {
          result[index] = {
            status: 'rejected',
            value: error
          };
        }
      ).finally(() => ++settled === promises.length && resolve(result));
    });
  });
};
```

##### 2.3.4 实例方法 then

> Promise.prototype.then()用来添加回调函数, then 方法可以接受两个回调函数:
>
> - 第一个是异步操作成功时（变为 fulfilled 状态）的回调函数，
> - 第二个是异步操作失败（变为 rejected）时的回调函数（该参数可以省略）,一旦状态改变，就调用相应的回调函数

```javascript
// 写法一
f1()
  .then(function () {
    return f2();
  })
  .then(f3); // f3回调函数参数是f2的执行结果

// 写法二
f1()
  .then(function () {
    f2();
    return;
  })
  .then(f3); //f3回调函数参数是undefined

// 写法三
f1().then(f2()).then(f3); // f3回调函数参数是f2返回函数的运行结果

// 写法四
f1().then(f2).then(f3); //f2会接收到f1()返回的结果
```

##### 2.3.5 实现 Promise (方案一)

```javascript
// ----  Promise ----
function Promise(fn) {
  let state = 'pending'; // Promise的状态
  let value = null;
  let deferreds = []; // then方法中添加的延期执行任务
  fn(resolve, reject); // 同步初始化Promsie的应用程序

  this.then = function (onFulfilled, onRejected) {
    // 为了实现链式的调用使用一个bridge promise
    return new Promise(function (resolve, reject) {
      handle({
        onFulfilled: onFulfilled || null,
        onRejected: onRejected || null,
        resolve: resolve,
        reject: reject
      });
    });
  };

  function handle(deferred) {
    if (state === 'pending') {
      deferreds.push(deferred);
      return;
    }

    // 以下步骤的执行也应该放到消息队列中去
    const cb =
      state === 'fulfilled' ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      cb = state === 'fulfilled' ? deferred.resolve : deferred.reject;
      cb(value);
      return;
    }

    /*
     如果在执行成功回调、失败回调时代码出错怎么办？对于这类异常，
     可以使用 try-catch 捕获错误，并将 bridge promise 设为 rejected 状态。
    */
    try {
      const ret = cb(value);
      deferred.resolve(ret);
    } catch (error) {
      deferred.reject(error);
    }
  }

  function resolve(newValue) {
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      // 如果是promise类型
      const then = newValue.then;
      if (typeof then === 'function') {
        // 手动执行Promise的then方法
        then.call(newValue, resolve);
        return;
      }
    }
    state = 'fulfilled';
    value = newValue;
    finale();
  }

  function reject(reason) {
    state = 'rejected';
    value = reason;
    finale();
  }

  function finale() {
    setTimeout(function () {
      // 必须异步回调，不然此时then方法没有调用deferreds中是空，后续传入的onFulfilled函数不能执行
      deferreds.forEach(function (deferred) {
        handle(deferred);
      });
    }, 0);
  }
}

// ----------测试方法------------------------
function getUserId() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('10002');
    }, 2000);
  });
}

function getUserMobileById(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('100000000');
    }, 1000);
  });
}
// ---- 串行promise的调用 ----
getUserId()
  .then(getUserMobileById)
  .then(function mobile(mobile) {
    console.log(mobile);
    return 'end';
  });
```

###### 资料来源

> - [剖析 Promise 之基础篇](https://tech.meituan.com/2014/06/05/promise-insight.html)

##### 2.3.6 实现 Promise (方案二)

###### 1、实现 Promise 的构造函数

```javascript
function Promise(executor) {
  this.status = 'pending';
  this.value = null;
  this.reason = null;
  this.onFulfilledArray = [];
  this.onRejectedArray = [];

  const resolve = (value) => {
    if (value instanceof Promise) {
      return value.then(resolve, reject);
    }
    setTimeout(() => {
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.value = value;
        this.onFulfilledArray.forEach((func) => {
          func(value);
        });
      }
    });
  };

  const reject = (reason) => {
    setTimeout(() => {
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.reason = reason;
        this.onRejectedArray.forEach((func) => {
          func(reason);
        });
      }
    });
  };
  // 执行
  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}
```

###### 2、实现 Promise 的 then 方法

```javascript
Promise.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled =
    typeof onFulfilled === 'function' ? onFulfilled : (data) => data;
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : (error) => {
          throw error;
        };

  let promise2;
  if (this.status === 'fulfilled') {
    promise2 = new Promise((resolve, rejected) => {
      try {
        let result = onFulfilled(this.value);
        resolvePromise(promise2, result, resolve, reject);
      } catch (error) {
        rejected(error);
      }
    });
  }
  if (this.status === 'rejected') {
    promise2 = new Promise((resolve, rejected) => {
      try {
        let result = onRejected(this.reason);
        resolvePromise(promise2, result, resolve, reject);
      } catch (error) {
        rejected(error);
      }
    });
  }
  if (this.status === 'pending') {
    promise2 = new Promise((resolve, reject) => {
      this.onFulfilledArray.push((value) => {
        try {
          let result = onFulfilled(value);
          resolvePromise(promise2, result, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
      this.onRejectedArray.push((reason) => {
        try {
          let result = onRejected(reason);
          resolvePromise(promise2, result, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  return promise2;
};
```

###### 3、实现 onfulfilled/onRejected 函数不同返回值的处理函数

```javascript
const resolvePromise = (promise2, result, resolve, reject) => {
  // 避免死循环
  if (result === promise2) {
    reject(new TypeError('error due to circle reference'));
  }

  if (result instanceof Promise) {
    if (result.status === 'pending') {
      result.then((data) => {
        resolvePromise(promise2, data, resolve, reject);
      }, reject);
    } else {
      result.then(resolve, reject);
    }
    return;
  }

  // 是否已经执行过onfulfilled或者onrejected
  let consumed = false;
  let thenable;
  let isComplexResult = (target) =>
    typeof target === 'function' ||
    (typeof target === 'object' && target !== null);
  // 如果返回值疑似Promise类型
  if (isComplexResult(result)) {
    try {
      thenable = result.then;
      if (typeof thenable === 'function') {
        thenable.call(
          result,
          function (data) {
            if (consumed) {
              return;
            }
            consumed = true;
            return resolvePromise(promise2, data, resolve, reject);
          },
          function (error) {
            if (consumed) {
              return;
            }
            consumed = true;
            return reject(error);
          }
        );
      } else {
        resolve(result);
      }
    } catch (error) {
      if (consumed) {
        return;
      }
      consumed = true;
      return reject(error);
    }
  } else {
    resolve(result);
  }
};
```

##### 2.3.7 Promise.any

>

```javascript
Promise.any = function (promiseArr) {
  let index = 0;
  return new Promise((resolve, reject) => {
    if (promiseArr.length === 0) return;
    promiseArr.forEach((p, i) => {
      p.then(
        (val) => {
          resolve(val);
        },
        (err) => {
          index++;
          if (index === promiseArr.length) {
            reject(new AggregateError('All promises were rejected'));
          }
        }
      );
    });
  });
};
```

##### 2.3.8 Promisify

> 针对 error-first 的函数修改为 promise 风格

```javascript
function promisify(fn) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      args.push(function callback(error, ...values) {
        if (error) {
          reject(error);
        } else {
          resolve(values);
        }
      });
      // 给参数在运行时添加callback函数
      fn.call(this, ...args);
    });
  };
}
```

##### 2.3.9 finally

```js
Promise.prototype.finally = function (callback) {
  // 为了兼容某些自定义的promise【例如myPromise】
  let P = this.constructor;
  return this.then(
    (value) => P.resolve(callback()).then(() => value),
    (reason) => P.resolve(callback()).then(() => reason)
  );
};
```

#### 2.4 异步并发执行任务

> Promise.all/Promise.settle

#### 2.5、微任务&宏任务

> - 宏任务：JavaScript 引擎遇到异步任务（setTimeout、setInterval）等会将异步任务放在消息队列中，等待同步任务执行完毕后再执行；
> - 微任务：本轮事件循环执行完成（同步任务执行完毕），会优先检查微任务队列中是否存在待执行的任务，如果没有才进行下一次事件的循环（执行消息队列中的任务）；

```javascript
console.log(1); // 同步任务
setTimeout(function () {
  console.log(6, ':--宏任务--'); // 宏任务
}, 0);
new Promise(function (resolve, reject) {
  console.log(2); // 同步任务
  resolve(5);
  console.log(3); // 同步任务
}).then((res) => {
  console.log(res, ':--微任务--'); // 微任务
});
console.log(4); // 同步任务
```

#### 2.6、用动画描述界面元素的运动轨迹

```javascript
const el = document.getElementById('app');
// cssText返回的是元素的内联样式
el.style.cssText = `
    position: absolute;
    left: 0px;
    top: 0px;
  `;

const walk = (direction, distance) =>
  new Promise((resolve, reject) => {
    const innerWalk = () => {
      setTimeout(() => {
        let currentLeft = parseInt(el.style.left, 10);
        let currentTop = parseInt(el.style.top, 10);
        const shouldStop =
          (direction === 'left' && currentLeft === -distance) ||
          (direction === 'top' && currentTop === -distance);
        if (shouldStop) {
          resolve();
        } else {
          if (direction === 'left') {
            currentLeft--;
            el.style.left = `${currentLeft}px`;
          }
          if (direction === 'top') {
            currentTop--;
            el.style.top = `${currentTop}px`;
          }
          innerWalk();
        }
      }, 20);
    };
    innerWalk();
  });

walk('left', 30)
  .then(() => walk('top', 50))
  .then(() => walk('left', 30));
```

#### 2.7、红绿灯的无限轮转

```javascript
function red() {
  console.log('red');
}
function green() {
  console.log('green');
}
function yellow() {
  console.log('yellow');
}

const task = (light, delay) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (light === 'red') {
        red();
      } else if (light === 'green') {
        green();
      } else if (light === 'yellow') {
        yellow();
      }
      resolve();
    }, delay);
  });
};

const runLoop = () => {
  task('red', 3000)
    .then(() => task('green', 1000))
    .then(() => task('yellow', 2000))
    .then(runLoop);
};
```

#### 实现一个 sleep 函数

```js
function sleep(delay) {
  // 返回一个未来的结果
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

// aync await 能实现同步等待异步任务
async function func() {
  console.log('程序开始。。。。');
  await sleep(3000);
  console.log('3秒后....');
}
func();
```

### 3.异步函数

> async/await 语法让以同步方式写代码能够异步执行；

##### 3.1 async

> 声明函数为异步函数，仍具有普通函数的正常行为

```javascript
async function foo() {
  console.log('1');
  // 没有return 则返回undefined
  return 'foo'; // 返回值会被Promise.resolve()封装
}
let res = foo();
console.log('2');
// 1,2
console.log(res); // Promise<resolved>:foo
```

##### 3.2 await

> await 关键字会暂停执行异步函数后面的代码，让出 JavaScript 运行时的执行线程。
>
> 这个行为与生成器函数中的 yield 关键字是一样的。
>
> await 关键字同样是尝试“解包”对象的值，然后将这个值传给表达式，再异步恢复异步函数的执行。

```javascript
async function foo() {
  let p = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(3);
    }, 1000);
  });
  let res = await p;
  console.log(res); // 3
}
foo();
```

##### 3.3 执行顺序

```javascript
async function foo() {
  /*
    第1次同步执行的操作： await关键字暂停foo()中【行7】之后的执行，向事件队列中添加一个Promise在落定之后执行的任务；如果Promise立即落定，则把给await提供值的任务添加到事件队列；
    第2次同步执行的操作：Promise返回值是[foo]，此时【行7】变为 wait 'foo', JavaScript运行时向事件队列中添加一个恢复执行foo()函数的任务；
    第3次同步执行的操作：await 将'foo' 返回给res，再进一步执行console.log
  */
  let res = await Promise.resolve('foo');
  console.log(res);
}

async function bar() {
  /*
    第1次同步执行的操作： await会暂停bar，添加一个恢复bar()执行的任务到事件队列中，
    第2次同步执行的操作： await 返回'bar'，然后执行console.log()
  */
  let res = await 'bar'; //
  console.log(res);
}

async function baz() {
  let res = 'baz';
  console.log(res);
}

foo();
bar();
baz();

// baz , bar , foo;
```

##### 3.4 实现 sleep

```javascript
function sleep(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

async function test() {
  const t0 = Date.now();
  await sleep(1500);
  console.log(Date.now() - t0);
}
```

#### 4、generator

> 生成器是一个特殊的函数，可以在执行过程中暂停，同时在暂停/恢复的循环中提供了一个双向的通讯机制；暂停时可以返回一个值，恢复它时可以发回一个值；

```javascript
// (1)生成器语法：【当作产生器，每次的迭代都是一次消费】
function* foo() {
  let x = 10;
  let y = 20;
  let z = yield Math.random(); // yeild 发出一个值
  console.log(z);
}
let it = foo(); // 执行生成器仅仅是创建了一个迭代器，用来控制生成器函数的调用
const res = it.next();
console.log(res); // {value: 0.10955971254019792, done: false}
const res1 = it.next('z'); // z
console.log(res1); // {value: undefined, done: true}
```

##### 4.1 generator 执行器

```javascript
function run(gen) {
  // （1）执行gen获取迭代器
  const args = [].slice.call(arguments, 1);
  let it = gen.call(this, ...args);

  // （2）将任务放到微任务队列中
  return Promise.resolve().then(function handleNext(value) {
    const next = it.next(value);

    return (function handleResult(next) {
      if (next.done) {
        return next.value; // gen函数返回值
      } else {
        return Promise.resolve(next.value).then(
          handleNext,
          function handleError(error) {
            return Promise.resolve(it.throw(error).then(handleResult));
          }
        );
      }
    })(next);
  });
}

// 测试代码
function requestOne() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('requestOne:data from');
    }, 3000);
  });
}
function requestTwo() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('requestTwo:data from');
    }, 1000);
  });
}

function* main() {
  let p1 = requestOne();
  let p2 = requestTwo();

  let res1 = yield p1;
  let res2 = yield p2;

  console.log(res1); // requestOne:data from
  console.log(res2); // requestTwo:data from
}

run(main);
```
