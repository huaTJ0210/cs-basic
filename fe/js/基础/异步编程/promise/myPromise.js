const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  constructor(executor) {
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }
  // promise的状态
  state = PENDING
  // 成功后获取的值
  value = null
  // 失败后获取的值
  reason = null
  // 成功后的回调函数集合（then方法可能会被多次调用）
  successCallback = []
  // 失败后的回调函数集合
  failedCallBack = []

  // 修改成功后的状态
  resolve = value => {
    if (this.state !== PENDING) return
    this.state = FULFILLED
    this.value = value
    // 如果是异步，依次执行成功的回调函数
    while (this.successCallback.length) this.successCallback.shift()()
  }

  // 修改失败后的状态
  reject = reason => {
    if (this.state !== PENDING) return
    this.state = REJECTED
    this.reason = reason
    // 如果是异步，依次执行失败的回调函数
    while (this.failedCallBack.length) this.failedCallBack.shift()()
  }

  // 根据状态选择调用的函数
  then(successCallback, failedCallBack) {
    // 解决then不传递参数的情况
    successCallback = successCallback ? successCallback : value => value
    failedCallBack = failedCallBack
      ? failedCallBack
      : reason => {
          throw reason
      }
    
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.state === FULFILLED) {
        // 异步执行：主要为了获取promise2，为了防止successCallback返回promise2
        setTimeout(() => {
          try {
            // 获取成功回调的返回值
            const res = successCallback(this.value)
            // 根据res的数据类型决定如何将res返回给下一个promise的then函数
            resolvePromise(promise2, res, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      } else if (this.state === REJECTED) {
        setTimeout(() => {
          try {
            // 获取失败回调的返回值
            const res = failedCallBack(this.reason)
            // 根据res的数据类型决定如何将res返回给下一个promise的then函数
            resolvePromise(promise2, res, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      } else {
        // 状态为等待时需要记录成功和失败的回调函数
        this.successCallback.push(() => {
          setTimeout(() => {
            try {
              // 获取成功回调的返回值
              const res = successCallback(this.value)
              // 根据res的数据类型决定如何将res返回给下一个promise的then函数
              resolvePromise(promise2, res, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
        this.failedCallBack.push(() => {
          setTimeout(() => {
            try {
              // 获取失败回调的返回值
              const res = failedCallBack(this.reason)
              // 根据res的数据类型决定如何将res返回给下一个promise的then函数
              resolvePromise(promise2, res, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
      }
    })
    // 返回promise对象，是为了then函数可以链式调用
    return promise2
  }

  // finally函数
  finally(callback) {
    // then方法能知道当前promise的状态
    return this.then(
      value => {
        // 为了避免出现callback返回的是异步promise
        return MyPromise.resolve(callback()).then(() => value)
      },
      reason => {
        return MyPromise.resolve(callback()).then(() => {
          throw reason
        })
      }
    )
  }

  // catch函数
  catch(failedCallBack) {
    return this.then(undefined, failedCallBack)
  }

  // all
  static all(array) {
    let result = []
    let index = 0
    return new MyPromise((resolve, reject) => {
      function addData(key, value) {
        array[key] = value
        index++
        // promise中可能存在异步操作
        if (index === array.length) {
          resolve(result)
        }
      }
      for (let i = 0; i < array.length; i++) {
        const item = array[i]
        if (item instanceof MyPromise) {
          item.then(data => addData(i, data), reject)
        } else {
          addData(i, item)
        }
      }
    })
  }

  static resolve(value) {
    if (value instanceof MyPromise) {
      return value
    }
    return new MyPromise((reslove, _) => reslove(value))
  }
  static reject(reason) {
    if (reason instanceof MyPromise) {
      return reason
    }
    return new MyPromise((_, reject) => reject(reason))
  }
}

function resolvePromise(promise, res, resolve, reject) {
  if (promise === res) {
    // 在then方法的成功回调中不能返回与当前promise一致的值
    return reject(new TypeError('cannot return same promise'))
  }
  if (res instanceof MyPromise) {
    // 返回值是一个promise,则使用then判断promise的状态
    res.then(resolve, reject)
  } else {
    // 返回值是一个普通值
    resolve(res)
  }
}

module.exports = MyPromise
