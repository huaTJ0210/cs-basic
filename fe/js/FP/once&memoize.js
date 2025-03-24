// 1、once函数：函数只执行一次
const once = fn => {
    let done = false
    return (...args) => {
      if (!done) {
        done = true
        return fn.apply(this, args)
      }
    }
  }
  
  const pay = money => console.log(`支付：${money}`)
  const payAction = once(pay)
  
  payAction(5)
  payAction(5)
  payAction(5)
  
  // 2、memoize
  const memoize = fn => {
    let cache = {}
    return (...args) => {
      const key = JSON.stringify(args)
      cache[key] = cache[key] || fn.apply(this, args)
      return cache[key]
    }
  }
  
  const getArea = num => {
    console.log(`计算：${num}`)
    return num * num
  }
  
  const memoizeGetArea = memoize(getArea)
  memoizeGetArea(5)
  memoizeGetArea(5)
  memoizeGetArea(5)