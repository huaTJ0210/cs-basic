/*
   0、模块化的发展历程
   + 文件直接引用导致全局作用域冲突
   + 命名空间的方式，不能保证模块内部成员的私有性
   + 立即执行函数，比较复杂
   + common.js规范不适合浏览器端，它是同步引用的方式
   + AMD/CMD：相对使用复杂
   + ESM：语言层面上的规范


   1、common.js模块规范
   + 一个文件就是一个模块
   + 每个模块有单独的作用域
   + 通过module.exports导出成员
   + 通过require函数载入模块
   + 以同步的方式加载模块
   + 导出的内容是浅拷贝[值类型不会再改变，引用类型会随着模块内部的改变而改变]
   + 在外部导出的模块中修改引用类型的值时，也会引发模块内部值的变化

   2、AMD : 复杂度高
   + require.js : 
    -  define('module1',['jquery'],function($,module){
     return {
    
     }
  })

  3、ES Module
  + ESM的script标签会延迟执行脚本
  + ESM是通过CORS取请求外部JS模块
  + ESM自动是严格模式
  + ESM中每个文件都是一个单独作用域

  3.1 ESM导出成员的用法
  + export关键子在头部修饰声明（变量、函数、类等）
  + export关键字统一导出一个对象
  + export default （default是关键字，所以需要导入时起一个别名）

  3.2 ESM导入导出的注意事项
  + export {name age} : 导出的不是一个字面量对象，而是export的固定用法
  + 如果想导出一个值 可以使用 export default xx
  + 导入的时候 import {name,age} from 'xx' 也不是导入的一个对象，而是对应export的导出
  + export导出的是将引用关系给出了导入的模块，因此模块内部的修改也会同步到导入模块中
  + import 导入的内容是constant，只读的，不能进行修改

  4、UMD 的方式
  + 
*/
