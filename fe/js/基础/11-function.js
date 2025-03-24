/**
 * 1、函数定义
 *  + 函数声明
 *  + 函数表达式
 *  + 箭头函数
 */

/**
 * 2、函数对象属性及方法
 *  + length
 *  + name
 *  + call
 *  + apply
 *  + bind
 */

/**
 * 3、闭包：X是函数fn的闭包，X内部保存的是fn持有的外部函数的所有值的集合；
 * 通常通过嵌套函数来实现的
 */

// (3) call的实现
Function.prototype._callFunc = function (oThis, ...args) {
  if (typeof oThis == 'undefined') {
    oThis = window;
  }
  const obj = new Object(oThis);
  const func = this;
  const symbol = Symbol('__call_this__');
  obj[symbol] = func;
  const res = obj[symbol](...(args || []));
  delete obj[symbol];
  return res;
};

function greeting() {
  console.log(this.name);
  console.log(arguments);
}

const targetThis = {
  name: 'red'
};

const res = greeting._callFunc(targetThis, 1, 2, 3);
console.log(res);

/**
 *  4、bind的实现
 * */
Function.prototype._bind = function (oThis) {
  const args = Array.prototype.slice(arguments, 1);
  const fToBind = this;
  const func = function () {};
  const boundFunc = function () {
    // 此处也可以使用new.target判断是否作为构造函数被new调用
    return fToBind.apply(
      this instanceof func && oThis ? this : oThis,
      Array.prototype.slice(arguments).concat(args)
    );
  };
  // 保证使用new创建的实例原型链
  func.prototype = fToBind.prototype;
  boundFunc.prototype = new func();
  return boundFunc;
};

/**
 *  5、一个异步函数执行，超时则取消执行
 *
 */

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

/**
 * 6 、实现一个函数的缓存
 *  + 包装一个函数，返回一个具有缓存功能的函数，多次调用当传递相同的参数
 *  得到的是缓存结果
 */

const memoizeFunc = function (fn, oThis) {
  const map = new Map();
  return (...rest) => {
    const key = JSON.stringify(rest);
    map[key] = map[key] || fn.apply(oThis, rest);
    return map[key];
  };
};

/*
 * 节流和防抖
 */
function debounce(func, wait, immediate) {
  let timeout;

  return function executedFunction() {
    const context = this;
    const args = arguments;

    // 如果设置了 immediate 为 true，且之前没有定时器在等待，则立即执行函数
    if (immediate && !timeout) {
      func.apply(context, args);
    }

    // 清除之前的定时器
    clearTimeout(timeout);

    // 设置新的定时器
    timeout = setTimeout(() => {
      // 如果没有立即执行，则在定时器结束后执行函数
      if (!immediate) {
        func.apply(context, args);
      }
    }, wait);
  };
}

// 使用方法
// 例如，对窗口的 resize 事件使用防抖函数
window.addEventListener(
  'resize',
  debounce(
    function () {
      console.log('窗口大小改变了！');
    },
    250,
    true
  )
);

// 节流
function throttle(fn, delay) {
  let timer;
  let prevTime = Date.now();
  return function (...args) {
    let currTime = Date.now();
    let context = this;
    // 有待执行的任务先取消
    clearTimeout(timer);

    if (currTime - prevTime > delay) {
      prevTime = currTime;
      fn.apply(context, args);
      return;
    }

    // 解决每隔一段时间触发的操作
    timer = setTimeout(function () {
      prevTime = Date.now();
      timer = null;
      fn.apply(context, args);
    }, delay);
  };
}
