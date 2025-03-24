console.log('start')

setTimeout(() => {
  console.log('timeout')
}, 0)

Promise.resolve()
  .then(() => {
    console.log('promise1')
  })
  .then(() => {
    console.log('promise2')
  })
  .then(() => {
    console.log('promise3')
  })

console.log('end')

/*
  start -> end -> promise1 -> promise2 -> promise3 -> timeout
  promise.then中添加的回调任务被放置到微任务队列中，当前同步任务执行完毕后会立即执行
  而timeout的任务会放到宏任务队列中，等待微任务队列中所有任务执行完毕后才进行
*/
