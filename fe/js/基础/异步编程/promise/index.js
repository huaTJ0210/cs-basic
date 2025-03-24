const MyPromise = require('./myPromise')

const p = new MyPromise((resolve, reject) => {
  //
  setTimeout(() => {
    resolve('成功')
  }, 2000)
})

p.then(
  data => {
    console.log(data, 1)
  },
  error => {
    console.log(error, 1)
  }
)
p.then(
  data => {
    console.log(data, 2)
  },
  error => {
    console.log(error, 2)
  }
)
