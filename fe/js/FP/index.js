/**
 *  1、函子是函数编程的数据结构
 *  它是一个容器包含一个值和一个map方法
 * 一般约定，函子的标志就是容器具有map方法。
 * 该方法将容器里面的每一个值，映射到另一个容器。
 * */

class Functor {
  static of(value) {
    return new Functor(value)
  }
  constructor(value) {
    this._value = value
  }
  map(fn) {
    return Functor.of(fn(this._value))
  }
}

/**
 * 2、学习函数式编程，实际上就是学习函子的各种运算。
 * 由于可以把运算方法封装在函子里面，所以又衍生出各种不同类型的函子，有多少种运算，就有多少种函子。函数式编程就变成了运用不同的函子，解决实际问题。
 *
 */

/**
 * 3、Maybe函子： 初始化函子容器时可能传入的值是null
 * Maybe函子 设置空值检查机制
 */

class Maybe extends Functor {
  map(fn) {
    return this._value ? Maybe.of(fn(this._value)) : Maybe.of(null)
  }
}

/**
 * 4、Either 函子：
 * 条件运算if...else是最常见的运算之一，
 * 函数式编程里面，使用 Either 函子表达。
 */

class Either extends Functor {
  constructor(left, right) {
    super()
    this.left = left
    this.right = right
  }

  map(f) {
    return this.right
      ? Either.of(this.left, f(this.right))
      : Either.of(f(this.left), this.right)
  }
}

Either.of = function (left, right) {
  return new Either(left, right)
}

/**
 * 5、ap 函子
 *
 */
class Ap extends Functor {
  ap(F) {
    return Ap.of(this._value(F.val))
  }
}
// 函子的值是一个函数，同时部署了ap函数
function addTwo(x) {
  return x + 2
}
Ap.of(addTwo).ap(Functor.of(2))
// Ap(4)

/**
 * 6、Monad 函子 ： 解决函子的值还是函子的情况
 * Monad 函子的作用是，总是返回一个单层的函子。
 * 它有一个flatMap方法，与map方法作用相同，
 * 唯一的区别是如果生成了一个嵌套函子，它会取出后者内部的值，
 * 保证返回的永远是一个单层的容器，不会出现嵌套的情况。
 */

class Monad extends Functor {
  join() {
    return this._value
  }
  flatMap(f) {
    return this.map(f).join()
  }
}

/**
 * 7、IO函子
 * IO 函子中的 _value 是一个函数，这里是把函数作为值来处理
 * IO 函子可以把不纯的动作存储到 _value 中
 * 延迟执行这个不纯的操作(惰性执行)，包装当前的操作；
    把不纯的操作交给调用者来处理
 */
const fp = require('lodash/fp')
class IO {
  static of(x) {
    return new IO(function () {
      return x
    })
  }
  constructor(fn) {
    this._value = fn
  }
  map(fn) {
    // 把当前的 value 和 传入的 fn 组合成一个新的函数 return new IO(fp.flowRight(fn, this._value))
    return new IO(fp.flowRight(fn, this._value))
  }
  join() {
    return this._value
  }
  flatMap(f) {
    return this.map(f).join()
  }
}

let io = IO.of(process).map(p => p.execPath)
console.log(io._value())

// 读取函数

var fs = require('fs')

var readFile = function (filename) {
  return new IO(function () {
    return fs.readFileSync(filename, 'utf-8')
  })
}

var print = function (x) {
  return new IO(function () {
    console.log(x)
    return x
  })
}

readFile('./package.json').flatMap(print)
