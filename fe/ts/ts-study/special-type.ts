/*
   1、any作为类型则放弃了TS的类型检查；建议不要使用

   noImplicitAny
*/
let ch1: any = true
ch1 = 'hello'
Math.round(ch1)

/*
  2、unknow：和any类似，但比any更安全（使用前需要进行类型判断）
*/

let ch2: unknown = 1
ch2 = () => {}
if (typeof ch2 === 'function') {
  ch2()
}

/*
  3: never
*/

/*
  4、 null/undefined

  配置： strictNullChecks
*/

let y: undefined = undefined
let z: null = null

// 谨慎使用： 4-1 Null Assertion : 当返回值是可选类型，但能保证一定有值的时候
function getValue(): string | undefined {
  return 'hello'
}
let value = getValue()
console.log(value!.length)
// 4-2 空值合并 ?? ；当value1可能为空时则使用默认值

const value1: string | null = ''
const value2 = value1 ?? 'default'

// 4-3 ?. 可选链式:主要避免在null|undefiend上执行不合法的操作
const funcOne: () => void | null = () => {}
funcOne?.()

// 5 object

