/**
 * 1、generator的基本用法
 * + 解决异步操作回调函数嵌套过深的问题
 */

function* foo() {
  console.log('foo start')
  const res = yield 'foo'
  console.log(res) // next函数传递的数据
  console.log('foo end')
}

const gen = foo() // 生成执行器对象
const res = gen.next()
console.log(res)
const res1 = gen.next('outside')
console.log(res1)

// 2、案例1 : id生成器
function* idMaker() {
  let id = 0
  while (true) {
    yield id++
  }
}

// 3、案例2： 迭代器

const todos = {
  life: ['eat', 'watch'],
  learn: ['语文', '数学'],
  [Symbol.iterator]: function* () {
    const all = [...life, ...learn]
    for (let item of all) {
      yield item
    }
  }
}

// 异步可迭代
async function test() {
  const array3 = [1, 2, 3]
  // 实现异步迭代数据
  array3[Symbol.asyncIterator] = async function* () {
    yield 1
    yield 2
    yield 3
  }
  for await (const iterator of array3) {
    console.log(iterator)
  }
}

var count = 0
function sleep() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`${++count}`, new Date().getSeconds())
      resolve()
    }, 2000)
  })
}

function test1() {
  for (let index = 0; index < 3; index++) {
    sleep()
  }
}

test1()
