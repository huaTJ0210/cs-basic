// 异步任务
const ajax = url =>
  new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove('url')
    }, 1000)
  })

// 使用generator执行异步任务
function* main() {
  try {
    const res = yield ajax('url1')
    console.log(res)
    const res2 = yield ajax('url2')
    console.log(res2)
  } catch (error) {
    console.log(2)
  }
}

// generator 异步执行器：
function co(generator) {
  const g = generator()

  function handleReuslt(result) {
    if (result.done) return
    result.value.then(
      data => {
        handleReuslt(g.next(data))
      },
      error => {
        g.throw(error)
      }
    )
  }
  handleReuslt(g.next())
}

// generator原理篇 【https://www.cnblogs.com/pingan8787/p/13069433.html】

/*
  其实在 JavaScript 中，生成器就是协程的一种实现方式
  (1) 协程：比线程更轻量级别的存在
    + 一个线程可以存在多个协程，但同时只能运行一个，并且可以切换
    + 协程不属于系统级别控制，内存占有量也小

  (2) 协程与主线程之间的切换
通过调用生成器函数 genDemo 来创建一个协程 gen，创建之后，gen 协程并没有立即执行。
要让 gen 协程执行，需要通过调用 gen.next。
当协程正在执行的时候，可以通过 yield 关键字来暂停 gen 协程的执行，并返回主要信息给父协程。
如果协程在执行期间，遇到了 return 关键字，那么 JavaScript 引擎会结束当前协程，并将 return 后面的内容返回给父协程。
*/