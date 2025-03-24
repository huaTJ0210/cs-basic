/**
 * 0、Promise是一个描述异步任务的对象
 * 有三种状态，pending,fulfilled,rejected
 * 状态一旦变更就不可逆
 * 状态的改变时通过初始化传递的函数的参数（两个函数类型的参数）进行修改的
 * 获取异步的结果可以调用then方法传递两个函数类型的参数来接收成功结果或者失败的结果
 */

/**
 * 1、 Promise初始化接收一个函数，该函数接收两个参数
 *  resolve: 函数类型，能将Promise的状态修改为fulfilled
 *  reject:函数类型，能将Promise的状态修改为rejected
 */
console.log('start')
const promise = new Promise((resolve, reject) => {
  // 返回成功的回调 : 此处调用是同步触发的
  console.log('promise inner')
  resolve('success')
})

const p1 = promise.then(
  data => {
    // fulfilled状态下执行
    console.log('1---promise fulfilled')
    console.log(data)
  },
  error => {
    // rejected状态下执行
    console.log(error)
  }
)

const p2 = promise
  .then(data => {
    // fulfilled状态下执行
    console.log('2---promise fulfilled')
    console.log(data)
  })
  .catch(error => {
    console.log(error)
  })
console.log('end')



