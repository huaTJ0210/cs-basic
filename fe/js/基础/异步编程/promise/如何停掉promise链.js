/*
  https://developer.aliyun.com/article/682726
*/

(function () {
  var STOP_VALUE = {}; //只要外界无法“===”这个对象就可以了
  var STOPPER_PROMISE = Promise.resolve(STOP_VALUE);

  Promise.prototype._then = Promise.prototype.then;

  Promise.stop = function () {
    return STOPPER_PROMISE; //不是每次返回一个新的Promise，可以节省内存
  };

  Promise.prototype.then = function (onResolved, onRejected) {
    return this._then(function (value) {
      return value === STOP_VALUE ? STOP_VALUE : onResolved(value);
    }, onRejected);
  };
})();

Promise.resolve(8)
  .then((v) => {
    console.log(v);
    return 9;
  })
  .then((v) => {
    console.log(v);
    return Promise.stop(); //较为明确的语义
  })
  .catch(function () {
    // will never called but will be GCed
    console.log("catch");
  })
  .then(function () {
    // will never called but will be GCed
    console.log("then");
  })
  .finally(() => {
    console.log("finally");
  });

// 写Promise链的规范
