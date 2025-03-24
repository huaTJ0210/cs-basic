/**
 * 1、async：修饰的函数被称为异步函数,但真正起作用的是await关键。
 * await会将后面的代码加入到消息队列，然后等待执行
 */

// 异步任务
const ajax = url =>
  new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove('url')
    }, 1000)
  })

// 使用async...await语法糖直接以同步的方式进行处理
async function main() {
  try {
    const res = await ajax('url1')
    console.log(res)
    const res2 = await ajax('url2')
    console.log(res2)
  } catch (error) {
    console.log(2)
  }
}

// 直接调用
main()
