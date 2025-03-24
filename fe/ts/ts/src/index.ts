type NullableKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];

interface Person {
  name: string;
  age: number;
  address?: string;
  from?: string;
}

type keys = NullableKeys<Person>;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

// 向已存在的对象添加新的属性 : Node 环境下会报错
/*
 window.fn = 'hell';

console.log(window.fn);
*/
