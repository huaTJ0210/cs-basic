
/**
 * 1、Promise.race
 *
 */

Promise.race = function (promises) {
  if (!Array.isArray(promises)) {
    throw new TypeError(`${promises} is not iterable `)
  }
  return new Promise((resolve, reject) => {
    promises.forEach(promise => {
      promise
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  })
}

/**
 * 3、Promise.allSettled
 *
 */
Promise.allSettled = function (promises) {
  if (!Array.isArray(promises)) {
    throw new TypeError(`${promises} is not iterable `)
  }
  const result = []
  const settled = 0
  const length = promises.length
  if (length === 0) {
    return Promise.resolve(promises)
  }
  return new Promise((resolve, reject) => {
    promises.forEach((p, index) => {
      p.then(
        data => {
          result[index] = {
            status: 'fulfilled',
            value: data
          }
        },
        error => {
          result[index] = {
            status: 'rejected',
            value: error
          }
        }
      ).finally(() => ++settled === promises.length && resolve(result))
    })
  })
}

/**
 * 4. error-first 进行promisfy
 */

function promisify(fn) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      args.push(function callback(error, ...values) {
        if (error) {
          reject(error)
        } else {
          resolve(values)
        }
      })
      // 给参数在运行时添加callback函数
      fn.call(this, ...args)
    })
  }
}
