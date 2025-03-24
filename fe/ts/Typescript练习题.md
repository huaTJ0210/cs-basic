#### 1、父子类型之间的赋值

```typescript
type User = {
  id: number;
  kind: string;
};

function makeCustomer<T extends User>(u: T): T {
  // Error（TS 编译器版本：v4.4.2）
  // Type '{ id: number; kind: string; }' is not assignable to type 'T'.
  // '{ id: number; kind: string; }' is assignable to the constraint of type 'T',
  // but 'T' could be instantiated with a different subtype of constraint 'User'.
  return {
    id: u.id,
    kind: 'customer'
  };
}
/*
  1、题目分析：
  T extends User 则表明T是User的子类型，在TS中子类型可以赋值给父类型，但反之则不行；
  函数中直接返回User类型给T因此才会报错
  2、解决方法：
  return {
    ...u, // 添加了u的解构，则会让函数返回一个T类型
    id: u.id,
    kind: 'customer'
  }
*/
```

#### 2、函数重载 ??

1、问题

本道题我们希望参数 `a` 和 `b` 的类型都是一致的，即 `a` 和 `b` 同时为 `number` 或 `string` 类型。当它们的类型不一致的值，TS 类型检查器能自动提示对应的错误信息。

```typescript
function f(a: string | number, b: string | number) {
  if (typeof a === 'string') {
    return a + ':' + b; // no error but b can be number!
  } else {
    return a + b; // error as b can be number | string
  }
}

f(2, 3); // Ok
f(1, 'a'); // Error
f('a', 2); // Error
f('a', 'b'); // Ok
```

2、解法一使用函数的重载

```typescript
function f(a: string, b: string): string;
function f(a: number, b: number): number;
function f(a: string | number, b: string | number): string | number {
  if (typeof a === 'string') {
    return a + ':' + b;
  } else {
    //📢📢：此处将a和b进行了类型断言，便于TS的推断
    return (a as number) + (b as number);
  }
}

f(2, 3); // Ok
f(1, 'a'); // Error
f('a', 2); // Error
f('a', 'b'); // Ok
```

3、解法二使用泛型

```typescript
function f<T extends string | number>(a: T, b: T) {
  if (typeof a === 'string') {
    return a + ':' + b;
  } else if (typeof a === 'number') {
    return (a as number) + (b as number);
  } else {
    const check: never = a; //
    return '';
  }
}
```

#### 3、工具函数的使用

Partial、Required、Pick、Omit 以及 交叉类型

```typescript
type Foo = {
  a: number;
  b?: string;
  c: boolean;
};

// 定义的工具函数，用于扁平化T类型
type Simplify<T> = {
  [P in keyof T]: T[P];
};

// 将T中属性属于K的全部变为可选，其他保持不变
type SetOptional<T, K extends keyof T> = Simplify<
  Partial<Pick<T, K>> & Omit<T, K>
>;

// 将T中属性属于K的全部变为必选，其他保持不变
type SetRequired<T, K extends keyof T> = Simplify<
  Required<Pick<T, K>> & Omit<T, K>
>;

// 测试用例
type SomeOptional = SetOptional<Foo, 'a' | 'b'>;
type SomeRequired = SetRequired<Foo, 'a' | 'b'>;
```

#### 4、

```typescript
interface Example {
  a: string;
  b: string | number;
  c: () => void;
  d: {};
}

// 根据指定的条件返回合适的类型
type ConditionalPick<O, T> = {
  [P in keyof O as O[P] extends T ? P : never]: O[P];
};

// 测试用例：
type StringKeysOnly = ConditionalPick<Example, string>;
//=> {a: string}
```
