// infer: 在条件类型判断中表示待推断的类型变量
namespace KeyWord {
  // 1、获取函数的返回值类型
  type NReturnType<T extends (...args: any[]) => any> = T extends (
    ...args: any[]
  ) => infer R
    ? R
    : never

  const func = (): [number, string] => [1, 'string']
  type FuncReturnType = NReturnType<typeof func>

  // 2、获取构造函数的参数
  class Person {
    constructor(public name: string, public age: number) {}
  }
  type ConstructorParams<T> = T extends new (...args: infer R) => any ? R : any

  type CP = ConstructorParams<typeof Person>

  // 3、tuple转union,比如[string, number] -> string | number:
  type ElementOf<T> = T extends Array<infer E> ? E : never
  const tuple = ['1', 1]
  const arr: Array<string | number> = tuple
  // 4、联合类型转交叉类型
  type UnionToIntersection<U> = (
    U extends any ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never
}
