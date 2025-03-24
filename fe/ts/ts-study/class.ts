//#region -- 类声明：类类型和实例类型 ---
class Point {
  static version: number = 1

  x: number = 1
  y: number

  constructor() {
    this.y = 1
  }

  area() {
    return this.x + this.y
  }
}

// 创建类的实例 : 实例的类型即为Point
const p0 = new Point()
p0.area()

// typeof Point 获取的是类的构造函数类型（类类型）
type a = typeof Point
const p1: a = Point
console.log(p1.version)

// 类的构造函数类型
interface PointConstructor {
  version: number
  new (): Point //构造函数
}

const p: PointConstructor = Point
console.log(p.version)

//#endregion

//#region -- this类型 --
class Counter {
  count: number

  constructor(count: number) {
    this.count = count
  }
  // 方法的返回类型为this类型
  public add(): this {
    this.count++
    return this
  }
  public subtract(): this {
    this.count--
    return this
  }
  public getResult(): number {
    return this.count
  }
}

const count = new Counter(0)
count.add().subtract().getResult()
//#endregion
