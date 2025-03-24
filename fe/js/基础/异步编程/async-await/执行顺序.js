async function foo() {
  console.log(1) // 2
  // let promise_ = new Promise((reslove) => {reslove(100) })
  let a = await 100 // (await 类似yeild生产一个promise对象)隐式返回一个promise
  let b = await new Promise(resolve => {
    console.log('--b')
    resolve(200)
  })
  console.log(a) // 5
  console.log(b)
  console.log(2) // 6
}
console.log(0) // 1
foo()
/*
 主协程默认设置的监听：
promise_.then(value => {
  // 返回foo协程中 4
})
*/
console.log(3) // 3

// log(3)执行完毕，则会触发检查微任务队列，存在一个reslove(100)的任务
// 执行后，回到foo内部，将100返回给a，继续向下执行

// 代码执行顺序的案例
async function foo() {
  console.log('foo') // 3 返回一个primise对象
}
async function bar() {
  console.log('bar start') // 2
  await foo() // 等待，函数结果被加入微任务队列
  console.log('bar end') // 6
}

console.log('script start') // 1

setTimeout(function () {
  console.log('setTimeout') // 8
}, 0) // 宏任务队列

bar()

new Promise(function (resolve) {
  console.log('promise executor') // 4
  resolve() // 加入微任务队列
}).then(function () {
  console.log('promise then') // 7
})
console.log('script end') // 5
