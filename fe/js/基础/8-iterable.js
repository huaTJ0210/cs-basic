/*
  使用for循环遍历部分数据结构显得过于笨拙，
  某些情况下还会导致代码的混乱，
  ES6中某些数据结构实现了iterable接口，并且内置了
  [Symbol.iterator]作为属性返回一个新的迭代器
*/


// 对象实现可迭代接口
const obj = {
  name: 'li',
  age: 20,
  [Symbol.iterator]: function () {
    let index = 0
    let keys = Object.keys(this)
    let self = this
    return {
      next: function () {
        const key = keys[index]
        return { value: { [key]: self[key] }, done: index++ >= keys.length }
      }
    }
  }
}

for (let item of obj) {
  console.log(item)
}
