type School = {
  name: string
  address?: string
}

/*
  1、 Partial<T>将指定类型中的属性都改为可选（不包含嵌套）
*/
type PSchool = Partial<School>
// 原理
/**
 * 将类型的属性全部编程可选择
 */
type NPartial<T> = {
  [P in keyof T]?: T[P]
}
// 实现嵌套类型的递归可选
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/*
  2、 Required<T> 将指定类型中的属性都改为可选的（不包含嵌套）
*/

type RSchool = Required<School>
// 原理
type NRequired<T> = {
  [P in keyof T]-?: T[P]
}

/*
  3、Exclude<T,U> 将T中可分配给U的类型剔除
*/

type Fav = string | number | boolean

type OnlyString = Exclude<Fav, number | boolean>
// 原理: 会将联合类型依次传入（分发）
type NExclude<T, U> = T extends U ? never : T
/*
  分发：
  + 在泛型中传入联合类型
  + extends条件下
  + 裸类型：不对T进行其他操作
*/

/*
  4、Extract<T,U> 将T中符合U类型的元素都提取 ：针对联合类型
*/
type NExtract<T, U> = T extends U ? T : never

/*
  5、Pick<Type,Keys> 在Type挑选所有的keys属性
*/

interface UserProps {
  name: string
  age: number
  sex: number
}

type PUserProps = Pick<UserProps, 'name' | 'age'>
type NPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

/*
 6、Omit<T,K> 忽略T中的某些属性
*/

type OUserProps = Omit<UserProps, 'name' | 'age'>

type NOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>

/*
 7、Parameters<T> 获取函数的参数类型，以元组的方式返回
*/

const fn1 = (name: string, age: number) => {}
type Fn1Type = Parameters<typeof fn1>
type NParameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never

/*
    8、ReturnType<T>的用法：接收一个函数类型，返回函数的返回值类型
  */

const fn2 = (name: string) => {
  return 'string'
}

type RFn2 = ReturnType<typeof fn2>

type NReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any

/*
    9、Record<keys,values>构造一个新的对象类型

    Record<string, number> is equivalent to { [key: string]: number }
  */

type keys = 'name' | 'age' | 'sex'

interface Values {
  name: string
  label?: string
}

type R1 = Record<keys, Values>

const rObj: Record<string, number> = {
  '1': 1,
  '2': 2
}

// 原理实现
type NRecord<K extends keyof any, T> = {
  [P in K]: T
}

// 应用场景： 联合类型作为属性名，同时需要限制属性的类型时，需要创建一个新的类型
type Car = 'Audi' | 'BMW' | 'MercedesBenz'
type CarList = Record<Car, { age: number }>

const cars: CarList = {
  Audi: { age: 119 },
  BMW: { age: 113 },
  MercedesBenz: { age: 133 }
}

/*
  10、Computed的作用是将交叉类型合并
  将交叉类型扁平化处理，就是进行一次遍历
*/
type NComputed<T> = T extends Function ? T : { [P in keyof T]: T[P] }
type NC = NComputed<{ x: 'x' } & { y: 'y' }>
//type xy = { x: 'x' } & { y: 'y' }
//const xy2: xy = { x: 'x', y: 'y' }

/*
   11、Merge的实现:合并两个类型
*/

type NMerge<T, U> = NComputed<T & Omit<T, keyof U>>

/*
   12、Intersection 取出T的属性，该属性同时也存在于U中
*/

type NIntersection<T, U> = {
  [K in keyof T as K extends keyof U ? K : never]: T[K]
}

// 另外一种解法
type NIntersection1<T extends object, U extends object> = Pick<
  T,
  Extract<keyof T, keyof U>
>

type Props = { name: string; age: number; visible: boolean }
type DefaultProps = { age: string }

type res = NIntersection1<Props, DefaultProps>

/*
  13、Overwrite<T,U>用U中的属性覆盖出现在T中的属性
*/

// 将联合类型T中未出现在U中的类型返回
type Diff<T, U> = T extends U ? never : T

// 将T中未出现在U中的属性获取，并返回一个新的类型
type DiffType<T, U> = Pick<T, Diff<keyof T, keyof U>>

type NOverwrite<T, U, I = DiffType<T, U> & NIntersection<U, T>> = Pick<
  I,
  keyof I
>

type NO = NOverwrite<Props, DefaultProps>

type diff = DiffType<{ x: 'x'; y: 'y' }, { z: 'z'; y: 'y' }>

/*
   14、将T中所有属性的readonly移除掉
*/
type NMutable<T> = {
  -readonly [P in keyof T]: T[P]
}
