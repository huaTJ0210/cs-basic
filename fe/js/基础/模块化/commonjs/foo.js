let name = 'li'
let obj = {
  age: 200
}

setTimeout(function () {
  console.log('---foo.js--')
  console.log(obj.age)
  ;(name = 'za'), (obj.age = 2)
}, 1000)

module.exports = {
  name,
  obj
}
