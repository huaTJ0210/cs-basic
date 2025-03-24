/**
 * 1、Symbol : 设计的初衷是为了保证对象属性的唯一性，避免出现冲突
 */

// 创建一个符号类型的变量
const s = Symbol()

// 全局符号表中获取（如果首次获取没有，则会进行创建）
const globalSymbol = Symbol.for('foo')

// 给对象设置属性
const s1 = Symbol()
const o = {
  [s1]: 'foo',
  bar: 'var'
}
// 获取对象所有的属性(字符串类型及Symbol类型)
console.log(Reflect.ownKeys(o))


/**
 * Symbol避免对象键的重复
 *
 */
const sy = Symbol('foo')
const cache = {}

cache[sy] = 'cache sth'
