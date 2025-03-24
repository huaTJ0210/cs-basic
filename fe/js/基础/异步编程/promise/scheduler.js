/**
 * 控制并发任务数量的调度器
 */
class Scheduler {
  constructor(maxConcurrentTasks) {
    this.maxConcurrentTasks = maxConcurrentTasks || 2
    this.queue = []
    this.runningTasks = 0
  }
  add(task) {
    this.queue.push(task)
    this.runLoop()
  }
  runLoop() {
    if (this.queue.length > 0 && this.runningTasks < this.maxConcurrentTasks) {
      this.runningTasks++
      const task = this.queue.shift()
      task().finally(() => {
        this.runningTasks--
        this.runLoop()
      })
    }
  }
}

// --- 测试代码 --

function timeout(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

var scheduler = new Scheduler()

function addTask(time, order) {
  scheduler.add(() => timeout(time).then(() => console.log(order)))
}

addTask(1000, 1)
addTask(500, 2)
addTask(300, 3)
addTask(400, 4)

//要求
// ouput : 2 3 1 4
//一开始1,2俩个任务进入队列
//500ms时,2完成,输出2,任务3进入队列
//800ms时,3完成,输出3,任务4进入队列
//1000ms时,1完成,输出1
//1200ms时,4完成,输出4
