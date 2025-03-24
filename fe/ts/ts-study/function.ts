// TS约束函数的参数和返回值类型

// 可选参数
// 默认参数
// 剩余参数

interface FuncType {
  operation: (o: string) => void
  next(): string
}

const funcObj: FuncType = {
  operation: (o: string) => {},
  next() {
    return 'hello'
  }
}

funcObj.next()


