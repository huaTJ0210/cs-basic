namespace Index {
  // 1、类型的转化
  const valueOne: unknown = 'hello'
  // 将valueOne的类型转为string
  let n = (valueOne as string).length
  console.log(n)

  const num = 1

  // 2、定义一个索引类型 【类、接口等都可以定】
  class Person {
    public name: string
    public age: number
    constructor(name: string, age: number) {
      this.name = name
      this.age = age
    }
  }
  // 2-1、 使用keyof查询索引类型，得到的是索引类型所有public属性名构成的联合类型
  type NameOrAge = keyof Person // 'name' | age

  //2-2、 类型访问修饰符:根据属性名称获取属性的类型
  type propsType = Person[keyof Person]

  // 2-3、映射类型的语法 [K in Keys]
  interface Animal {
    name?: string
    age?: number
    run: () => void
  }

  // 根据指定的类型U 在T中找出所有的属性构成的联合类型

  type ConditionalType<T, U> = keyof {
    [K in keyof T as T[K] extends U ? K : never]: T[K]
  }

  type FPName = ConditionalType<Animal, Function>

  // 将指定索引类型中的可选类型属性挑选出来
  type NullableKeys<T> = {
    [K in keyof T]-?: undefined extends T[K] ? K : never
  }[keyof T]

  type PPNames = NullableKeys<Animal>

  /*
    2-4、条件类型 :类似js的三元运算符，判断左侧类型是否能赋值给右侧类型
    特性：出现分发的情况，就是将联合类型的值一一传递，最终返回一个联合类型
    条件：
    + 条件类型的T传递的是联合类型
    + 联合类型的每一个类型必须是裸类型[不被其他类型（数组，元组等）包装]
  */
  type NakedUsage<T> = T extends boolean ? 'yes' : 'no'

  type Distributed = NakedUsage<number | boolean>

  // Example：将T中未在U内出现的元素找出来
  type Diff<T, U> = T extends U ? never : T
  // 将符合U条件的T中类型留下
  type Filter<T, U> = T extends U ? T : never
  type NonNullabel<T> = Diff<T, null | undefined>

  type Re = Diff<'a' | 'b' | 'c' | 'd', 'a' | 'c' | 'f'>
}
