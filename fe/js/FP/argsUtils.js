/**
 * 1、将函数的参数控制为一个
 */

function unary(fn) {
  return function oneArg(arg) {
    return fn(arg)
  }
}

;['1', '2', '3', '4'].map(unary(parseInt))

/**
 * 2、改造参数constant
 *  + promise的then方法只能接收函数
 * 那么如何才让能他接收一个普通值类型呢
 */

function constant(v) {
  return function value() {
    return v
  }
}

// 使用场景
new Promise(resolve => {
  resolve()
})
  .then(constant(34))
  .then(data => {
    console.log(data)
  })

/**
 * 3、接受一个值返回一个值
 * + 可以作为断言函数
 */

function identity(v) {
  return v
}

let words = '   hello world  '.split(/\s|\d/)
words.filter(identity) // 断言函数判断是否为空
