interface IProps {
  name: string;
  age: number;
}

// keyof会将对象类型（类型）的key组成联合类型返回
//const Ikey = keyof IProps;  // 'name'|'age'

interface User {
  name: string;
  age: number;
  address?: string;
  readonly sex: string;
  // 函数类型
  say: (word: string) => string;
  // 字符串索引签名
  [key: string]: any;
}

// 使用接口定义一个函数类型
interface Say {
  (word: string): string;
}
