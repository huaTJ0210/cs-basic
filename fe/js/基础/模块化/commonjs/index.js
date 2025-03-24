const foo = require('./foo.js')

console.log('---1、index.js---')
console.log(foo.name)
console.log(foo.obj.age)
foo.obj.age = 300

setTimeout(function () {
  console.log('---2、index.js---')
  console.log(foo.name)
  console.log(foo.obj.age)
}, 2000)
