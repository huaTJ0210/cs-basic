function debounce(fn, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, ...args)
    }, delay)
  }
}

function throttle(fn, delay) {
  let timer = null
  let canOperator = true
  return function (...args) {
    if (canOperator && timer == null) {
      canOperator = false
      fn.apply(this, ...args)
      timer = setTimeout(() => {
        canOperator = true
        clearTimeout(timer)
        timer = null
      }, delay)
    } else {
      // 不执行任何的操作
      console.log(canOperator)
    }
  }
}

function fn() {
  console.log('fn opr')
}

const fnDounce = debounce(fn, 5)

const fnThrottle = throttle(fn, 5000)

let count = 0

const t = setInterval(() => {
  count++
  fnThrottle()
  if (count === 20) {
    clearInterval(t)
  }
}, 1000)

function f1(next) {
  return function f1_inner(action) {
    next()
  }
}

function f2(next) {
  return function f2_inner(action) {
    next()
  }
}

function f3(next) {
  return function f3_inner(action) {
    next()
  }
}

const f = f1(f2(f3(() => {})))

console.log(f)

// [f1,f,2,f3] ==> (x)=>f1(f2(f3(x)))
/*
  const operate = compose(div2, mul3, add1, add1)
operate(0) //=>相当于div2(mul3(add1(add1(0)))) 
operate(2) //=>相当于div2(mul3(add1(add1(2))))

*/
const compose = (...funcs) => {
  if (funcs.length === 0) {
    return arg => arg
  } else if (funcs.length === 1) {
    return funcs[0]
  } else {
    return funcs.reduce(
      (a, b) =>
        (...args) =>
          a(b(...args))
    )
  }
}

// arrayToTree
const arrayToTree = items => {
  const result = []
  const map = {}

  for (let item of items) {
    const id = item.id
    const pid = item.pid

    if (!map[id]) {
      map[id] = {
        children: []
      }
    }
    map[id] = {
      ...item,
      children: map[id].children
    }

    const treeItem = map[id]

    if (pid === 0) {
      result.push(treeItem)
    } else {
      if (!map[pid]) {
        map[pid] = {
          children: []
        }
      }
      map[pid].children.push(treeItem)
    }
  }
  return result
}
