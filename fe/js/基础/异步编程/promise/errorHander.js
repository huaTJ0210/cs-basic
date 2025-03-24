(function () {
  const STOP_VALUE = {}; //只要外界无法“===”这个对象就可以了
  const STOPPER_PROMISE = Promise.resolve(STOP_VALUE);

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

// ---- 业务使用 -----

function request() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: { list: "123" }, status: 100 });
    }, 2000);
  })
    .then((res) => {
      const { data, status } = res;
      if (status === 200) {
        return { data, status };
      } else {
        // 终止promise链的执行
        return Promise.stop();
      }
    })
    .catch((error) => {
      // 终止promise链的执行
      return Promise.stop();
    });
}

async function test() {
  let res = await request();
  // 如果request中调用了 Promise.stop(); 下面代码就不再执行
  console.log("-----", res);
}

test();
