JavaScript 是一种松散类型[无类型约束]的编程语言，数据[变量、函数等]在使用时很难理解类型相关的信息，一些类型错误也只能等到运行时才能被触发。TypeScript 在 JavaScript 之上添加相关的语法，允许开发人员添加类型，使得类型相关错误在编译阶段就得到提示。

### 简单类型

#### 1、基本类型

TypeScript 中包含基本数据类型：`string`、`number`、`boolen`、null、undefined、symbol

#### 2、类型声明方式

```typescript
// 1、显示声明：
let a: string = 'hello'; // a是一个string类型
// 2、隐式声明：
let b = 'world'; // TS会进行类型推断为string类型
const c = 'hi'; // TS会将c推断为字面量类型：'hi'
```

#### 3、类型不匹配错误

数据类型不匹配 TS 会抛出错误

```typescript
let a: string = 'hello'; // a为string类型

a = 1; //error： Type 'number' is not assignable to type 'string'.
```

### 特殊类型

#### 1、any

使用 any 作为类型，则会完全放弃 TS 类型检查，这样任意类型都可以赋值给 any 类型的变量

```typescript
let a: any = 'hello';
a = 1; // no error
Math.round(a); // no error
```

#### 2、unknown

unknow 和 any 类似，但比 any 更安全（使用前需要进行类型判断）

```typescript
let ch2: unknown = 1;
ch2 = () => {}; // 重新赋值为函数
// 使用前需要判断类型
if (typeof ch2 === 'function') {
  ch2();
}
```

#### 3、null 和 undefined

null 和 undefined 作为基本类型同 string、number 等类型一样可以赋值给变量；

如果你在 tsconfig.json 指定了`"strictNullChecks":true` ，`null` 和 `undefined` 只能赋值给 `void` 和它们各自的类型，未设置则可以赋值给其他类型

如下示例是对 null 和 undefined 的安全操作：

```typescript
//1、 空值合并 ?? ；当value1可能为空时则使用默认值
const value1: string | null = null;
const value2 = value1 ?? 'default'; // 此时value2的值为'default'

// 2、 ?. 可选链式:主要避免在null|undefiend上执行不合法的操作
const funcOne: () => void | null = () => {};
funcOne?.();
```

#### 4、object、Object、{}

1、object 代表的是所有非原始类型，也就是说我们不能把 number、string、boolean、symbol 等 原始类型赋值给 object

2、Object 代表所有拥有 toString、hasOwnProperty 方法的类型，所以所有原始类型、非原始类型都可以赋给 Object

3、{}空对象类型和大 Object 一样，也是表示原始类型和非原始类型的集合

**综上所述：{}、大 Object 是比小 object 更宽泛的类型（least specific），{} 和大 Object 可以互相代替，用来表示原始类型（null、undefined 除外）和非原始类型；而小 object 则表示非原始类型。**

```typescript
const o1: object = { x: 1 }; // no error
const o2: object = new Number(1); // no error

const o3: Object = 1; // no error
const o4: {} = 1; // no error

// Object能赋值给object：原始类型（可以自动装箱）赋值给对象类型
let o6: Object = 1;
let o7: object = {}; // no error
o7 = o6;
```

#### 5、字面量类型

字面量不仅可以作为值，也可以作为类型

字面量类型可以赋值给相应的类型反之不行（字符串字面量可以赋值给字符串类型反之则不可以）

```typescript
// 字符串字面量
let specifiedStr: 'this is string' = 'this is string';
// 数字字面量
let specifiedNum: 1 = 1;
// 布尔字面量
let specifiedBoolean: true = true;

// TS对const声明的基本类型会推断为字面量类型
const num = 1; // ==>  num:1

// 应用场景（1）：组合形成联合类型
type Direction = 'up' | 'down';

function move(dir: Direction) {
  // ...
}
move('up'); // ok
move('right'); // ts(2345) Argument of type '"right"' is not assignable to parameter of type 'Direction'

// 应用场景（2）
interface Config {
  size: 'small' | 'big';
  isEnable: true | false;
  margin: 0 | 2 | 4;
}
```

#### 6、类型缩小

在 TypeScript 中，我们可以通过某些操作将变量的类型由一个较为宽泛的集合缩小到相对较小、较明确的集合，这就是 "Type Narrowing"。

```typescript
// 使用类型守卫，缩小angthing的类型
{
  let func = (anything: any) => {
    if (typeof anything === 'string') {
      return anything; // 类型是 string
    } else if (typeof anything === 'number') {
      return anything; // 类型是 number
    }
    return null;
  };
}

/*
  注意以下情况
*/
const el = document.getElementById('foo'); // Type is HTMLElement | null
if (typeof el === 'object') {
  el; // Type is HTMLElement | null ： typeof null也是“object”
}
function foo(x?: number | string | null) {
  if (!x) {
    // falsy的情况下包含0和空字符串
    x; // Type is string | number | null | undefined
  }
}

/*
  帮助类型检查器缩小类型的另一种常见方法是在它们上放置一个明确的 “标签”：
*/
interface UploadEvent {
  type: 'upload';
  filename: string;
  contents: string;
}

interface DownloadEvent {
  type: 'download';
  filename: string;
}

type AppEvent = UploadEvent | DownloadEvent;

function handleEvent(e: AppEvent) {
  switch (e.type) {
    case 'download':
      e; // Type is DownloadEvent
      break;
    case 'upload':
      e; // Type is UploadEvent
      break;
  }
}
```

#### 7、绕开额外的类型检查

TS 是结构类型系统，采用的是鸭式辨型法；所谓的**鸭式辨型法**就是`像鸭子一样走路并且嘎嘎叫的就叫鸭子`，即具有鸭子特征的认为它就是鸭子，TS 在比对类型时比对的类型的形状

```typescript
class Person {
  name:string
  age：number
}

class Animal {
  name:string
  age：number
}

// 以下赋值没有错误，这就是鸭式辨型法，Person和Animal的结构是一样的，
// 因此可以相互赋值；这在其他类型语言中是绝对不可以的
const p:Person = new Animal()
const a:Animal = new Person()
```

1、规避属性检查,使用中间变量

```typescript
/*
  (1)使用myObj接收然后再赋值则不会进行严格的类型检查，而是参考鸭式辨型法
*/
interface LabeledValue {
  label: string;
}
function printLabel(labeledObj: LabeledValue) {
  console.log(labeledObj.label);
}
let myObj = { size: 10, label: 'Size 10 Object' };
printLabel(myObj); // OK： myObj的类型是LabeledValue的子类型，因此能够赋值

/*
  (2)在参数里写对象就相当于是直接给labeledObj赋值，
   这个对象有严格的类型定义，所以不能多参或少参 ？？？📢 这个需要探究为啥会触发属性检查！！
*/
interface LabeledValue {
  label: string;
}
function printLabel(labeledObj: LabeledValue) {
  console.log(labeledObj.label);
}
printLabel({ size: 10, label: 'Size 10 Object' }); // Error
```

2、类型断言： 类型断言的意义就等同于你在告诉程序，你很清楚自己在做什么，此时程序自然就不会再进行额外的属性检查了。

```typescript
interface Props {
  name: string;
  age: number;
  money?: number;
}

let p: Props = {
  name: 'xx',
  age: 25,
  money: -1000,
  man: false
} as Props; // OK 告诉编译器P 就是props类型
```

3、索引签名

```typescript
interface Props {
  name: string;
  age: number;
  money?: number;
  [key: string]: any; // 索引签名可以保证多出的属性符合类型的要求
}

let p: Props = {
  name: 'xx',
  age: 25,
  money: -100000,
  girl: false
}; // OK
```

### 数组

```typescript
// 声明数组类型
let nums: number[] = [1, 2, 3, 4];
nums.push(5); // no error
nums.push('a'); // error: 类型不匹配

// 声明只读数组
const nums: readonly number[] = [1, 2, 3];
```

### 元组

元组是一个类型化数组，每个索引都有预定义的长度和类型

```typescript
// 元组的声明
let httpResult: [string, number] = ['OK', 200];
// 元组的解构
const graph: [number, number] = [1, 2];
const [x, y] = graph;
```

### 对象

```typescript
// 对象的声明 ： { type: string, model: string, year: number }  为对象字面量类型
const car: { type: string; model: string; year: number } = {
  type: 'Toyota',
  model: 'Corolla',
  year: 2009
};

// 对象类型可选属性
const person: { name: string; age?: number } = {
  name: 'zhang'
};
```

### 枚举

```typescript
// 枚举定义
enum CardinalDirections {
  North, // 默认值是0，但可以自定义 允许number和string类型
  East,
  South,
  West
}
// 使用枚举
let currentDirection = CardinalDirections.North;
```

### 类型别名

```typescript
// 为类型起别名
type CarYear = number;
type CarType = string;
type CarModel = string;

type Car = {
  year: CarYear;
  type: CarType;
  model: CarModel;
};
```

### interface

在面向对象语言中，接口（Interfaces）是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类（classes）去实现（implement）。

TypeScript 中的接口是一个非常灵活的概念，除了可用于[对类的一部分行为进行抽象]以外，也常用于对「对象的形状（Shape）」进行描述。

```typescript
// 接口描述函数
interface TestFunc {
  (num: number): number;
}

// 接口描述对象
interface Rectangle {
  height: number;
  width: number;
}
// 接口作为类型使用
const rectangle: Rectangle = {
  height: 20,
  width: 10
};

// 接口继承 ： extends关键字
interface ColoredRectangle extends Rectangle {
  color: string;
}

// 使用接口描述对象的形状
interface Person {
  name: string;
  age?: number; // 声明可选属性
  [propName: string]: any; // 表示接受属性但需要注意属性的类型
}

let tom: Person = {
  name: 'Tom',
  gender: 'male' //
};
```

### 联合类型

```typescript
// 声明联合类型 :使用 | 将类型隔开
const fav: number | string | boolen = 'string';
function printStatusCode(code: string | number) {
  console.log(`My status code is ${code}.`);
}
```

### 交叉类型

交叉类型是将多个类型合并为一个类型。 这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性，使用`&`定义交叉类型。

```typescript
type Useless = string & number; //Useless的类型为never，因为没有符合这种条件的类型

// 应用场景是合并对象类型实现类似接口继承的特征
type IntersectionType = { id: number; name: string } & { age: number };
const mixed: IntersectionType = {
  id: 1,
  name: 'name',
  age: 18
};

/*
   注意事项：
   在混入多个类型时，若存在相同的成员，且成员类型为非基本数据类型，那么是可以成功合并；
   如果是基本类型，同时相同键值的类型不兼容，则会得到上述Useless的情况，进而无法赋值
 */
```

### 函数

#### 1、基本函数定义

```typescript
// 定义函数的参数类型和返回值类型
function sum(a: number, b: number): number {
  return a + b;
}
// 定义函数的某个参数是可选的
function sum(a: number, b: number, c?: number): number {
  return a + b + c || 0;
}
// 定义函数的某个参数有默认值
function sum(a: number, b: number, c: number = 2): number {
  return a + b + c;
}
// 定义函数的某个参数为剩余参数
function add(a: number, b: number, ...rest: number[]) {
  return a + b + rest.reduce((p, c) => p + c, 0);
}

// 函数的类型
type sumType = (a: number, b: number) => number;
// 使用函数类型的参数
function opera(op: sumType, a: number, b: number): number {
  return op(a, b);
}
interface Fn {
  next: () => void; // next 为函数类型
}
```

#### 2、函数重载

函数名称相同，但函数参数和返回值不同时，就可以使用重载定义函数

```typescript
type Types = number | string;
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: string, b: number): string;
function add(a: number, b: string): string;
function add(a: Types, b: Types) {
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}
const result = add('Semlinker', ' Kakuqo');
result.split(' ');
```

### 操作符

#### 1、as

as 操作符可以进行类型的转换

```typescript
let x: unknown = 'hello';
// 需要进行转换后才能安全使用
console.log((x as string).length);
```

#### 2、keyof

keyof 可以获取对象的所有属性，组成一个联合类型返回

```typescript
interface Person {
  name: string;
  age: number;
}

type nameAndAge = keyof Person; // nameAndAge为 'name'|'age'
```

#### 3、is

类型保护就是一些表达式，它们会在运行时检查以确保在某个作用域里的类型。 要定义一个类型保护，我们只要简单地定义一个函数，它的返回值是一个 _类型谓词_（test is string）：

```typescript
function isString(test: any): test is string {
  return typeof test === 'string';
}

// 在调用
function test(t: any) {
  if (isString(t)) {
    // 此时TS能推断出t一定是string类型
  } else {
    // 此作用域中TS推断t一定不是string类型
  }
}
```

#### 4、 const 断言

当你在一个值之后使用 const 断言时，TypeScript 将为它推断出最窄的类型，没有拓宽

```typescript
// Type is { x: number; y: number; }
const obj1 = {
  x: 1,
  y: 2
};
// Type is { x: 1; y: number; }
const obj2 = {
  x: 1 as const,
  y: 2
};
// Type is { readonly x: 1; readonly y: 2; }
const obj3 = {
  x: 1,
  y: 2
} as const;

// Type is number[]
const arr1 = [1, 2, 3];

// Type is readonly [1, 2, 3]
const arr2 = [1, 2, 3] as const;
```

#### 5、in

`in` 用来遍历枚举类型：

```typescript
type Keys = 'a' | 'b' | 'c';

type Obj = {
  [p in Keys]: any;
}; // -> { a: any, b: any, c: any }
```

#### 6、infer

在条件类型语句（extends）中，可以用 `infer` 声明一个类型变量（表示推断）并且对它进行使用。

```typescript
/*
  infer R 就是声明一个变量来承载传入函数签名的返回值类型，简单说就是用它取到函数返回值的类型方便之后使用
*/
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```

#### 7、extends

除了继承以外，extends 还可以作为泛型的类型约束来使用

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

#### 8、！

```typescript
// 1、 Null Assertion（ ！） : 当返回值是可选类型，但能保证一定有值的时候
function getValue(): string | undefined {
  return 'hello';
}
let value = getValue();
// 为了保证value是string类型的可以使用!进行断言
console.log(value!.length);

/*
 2、 :通过 let x!: number; 确定赋值断言，TypeScript 编译器就会知道该属性会被明确地赋值，
  如果不使用！则TS编译器则会报x在未初始化前就被使用了【TS静态类型检查是不执行函数的，所以无法判断x是否初始化】
*/
let x!: number;
initialize();
console.log(2 * x); // Ok

function initialize() {
  x = 10;
}
```

### 类

#### 1、TS 为类增加了类型和访问修饰符

```typescript
class Person {
  private name: string; // 私有访问修饰符

  public constructor(name: string) {
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }
}

const person = new Person('Jane');
console.log(person.getName()); // person.name isn't accessible from outside the class since it's private
```

#### 2、类的继承及子类重写父类的方法

```typescript
interface Shape {
  getArea: () => number;
}

class Rectangle implements Shape {
  // using protected for these members allows access from classes that extend from this class, such as Square
  public constructor(
    protected readonly width: number,
    protected readonly height: number
  ) {}

  public getArea(): number {
    return this.width * this.height;
  }

  public toString(): string {
    return `Rectangle[width=${this.width}, height=${this.height}]`;
  }
}

class Square extends Rectangle {
  public constructor(width: number) {
    super(width, width);
  }

  // this toString replaces the toString from Rectangle
  public override toString(): string {
    return `Square[width=${this.width}]`;
  }
}
```

#### 3、抽象类

抽象类的编写方式允许它们用作其他类的基类，而无需实现所有成员。

```typescript
abstract class Polygon {
  public abstract getArea(): number;

  public toString(): string {
    return `Polygon[area=${this.getArea()}]`;
  }
}

class Rectangle extends Polygon {
  public constructor(
    protected readonly width: number,
    protected readonly height: number
  ) {
    super();
  }

  public getArea(): number {
    return this.width * this.height;
  }
}
```

### 泛型

泛型允许创建“类型变量”，这些变量可用于创建不需要显式定义它们使用的类型的类、函数和类型别名

#### 1、泛型函数

```typescript
function createPair<S, T>(v1: S, v2: T): [S, T] {
  return [v1, v2];
}
console.log(createPair<string, number>('hello', 42)); // ['hello', 42]
```

#### 2、类型别名

```typescript
type Wrapped<T> = { value: T };
const wrappedValue: Wrapped<number> = { value: 10 };
```

#### 3、Extends

extends 在泛型中主要为了限制某个类型变量

```typescript
// 必须属于联合类型'name'|'age'
function test<T extend 'name'|'age'>(props:T):T{
   return props;
}
```

### 工具类型

#### 1、Partial<T>

将对象中的所有属性更改为可选（不包含嵌套）

```typescript
type School = {
  name: string;
  address?: string;
};
type PSchool = Partial<School>;
// 源码实现：
type Partial<T> = {
  [P in keyof T]?: T[P];
};
// 实现嵌套类型的递归可选
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

#### 2、Required<T>

将指定类型中的属性都改为必选的（不包含嵌套）

```typescript
type School = {
  name: string;
  address?: string;
};
type RSchool = Required<School>;
// 源码实现
type NRequired<T> = {
  [P in keyof T]-?: T[P];
};
```

#### 3、Exclude<T,U>

将 T 中符合 U 类型的元素都剔除 ：针对联合类型

```typescript
type Fav = string | number | boolean;
type OnlyString = Exclude<Fav, number | boolean>;
// 原理: 会将联合类型依次传入（分发）
type Exclude<T, U> = T extends U ? never : T;
/*
  分发的条件：
  + 在泛型中传入联合类型
  + extends条件下
  + 裸类型：不对T进行其他操作
*/
```

#### 4、Extract<T,U>

将 T 中符合 U 类型的元素都提取 ：针对联合类型

```typescript
type Extract<T, U> = T extends U ? T : never;
```

#### 5、Pick<T,K>

在 T 中挑选所有 K 的属性组成新对象

```typescript
interface UserProps {
  name: string;
  age: number;
  sex: number;
}

type PUserProps = Pick<UserProps, 'name' | 'age'>;
// 源码实现
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

#### 6、Omit<T,K>

在 T 中挑选所有 K 的属性组成新对象

```typescript
type OUserProps = Omit<UserProps, 'name' | 'age'>;
//源码实现：
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

#### 7、Parameters<T>

获取函数的参数类型，以元组的方式返回

```typescript
const fn1 = (name: string, age: number) => {};
type Fn1Type = Parameters<typeof fn1>;
// 原理实现
type Parameters<T extends (...args: any[]) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;
```

#### 8、ReturnType<T>

接收一个函数类型，返回函数的返回值类型

```typescript
const fn2 = (name: string) => {
  return 'string';
};

type RFn2 = ReturnType<typeof fn2>;
// 源码实现
type ReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;
```

#### 9、Record<K,T>

构造一个新的对象类型： Record<string, number> 等价于 { [key: string]: number }

```typescript
type keys = 'name' | 'age' | 'sex';

interface Values {
  name: string;
  label?: string;
}

type R1 = Record<keys, Values>;

const rObj: Record<string, number> = {
  '1': 1,
  '2': 2
};

// 原理实现
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

### 协变与逆变

如下示例中 b 的类型能够兼容 a，所以 b=a 是没有问题的，反之则报错

```typescript
// 定义两个变量
let a: { name: string; age: number } = { name: 'li', age: 18 };
let b: { name: string; age: number; sex: string } = {
  name: 'li',
  age: 18,
  sex: 'man'
};

// 赋值是b的类型兼容a

// 1、no error
a = b;

/*
2、Property 'sex' is missing in type '{ name: string; age: number; }' but required in type '{ name: string; age: number; sex: string; }'.
*/
b = a;
```

#### 逆变和协变

> [逆变和协变](https://jkchao.github.io/typescript-book-chinese/tips/covarianceAndContravariance.html)

### tsconfig.json

#### 1、配置能文件相关字段含义

```json
{
  "compilerOptions": {
    /* 基本选项 */
    "target": "es5", // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "module": "commonjs", // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
    "lib": [], // 指定要包含在编译中的库文件
    "allowJs": true, // 允许编译 javascript 文件
    "checkJs": true, // 报告 javascript 文件中的错误
    "jsx": "preserve", // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
    "declaration": true, // 生成相应的 '.d.ts' 文件
    "sourceMap": true, // 生成相应的 '.map' 文件
    "outFile": "./", // 将输出文件合并为一个文件
    "outDir": "./", // 指定输出目录
    "rootDir": "./", // 用来控制输出目录结构 --outDir.
    "removeComments": true, // 删除编译后的所有的注释
    "noEmit": true, // 不生成输出文件
    "importHelpers": true, // 从 tslib 导入辅助工具函数
    "isolatedModules": true, // 将每个文件做为单独的模块 （与 'ts.transpileModule' 类似）.

    /* 严格的类型检查选项 */
    "strict": true, // 启用所有严格类型检查选项
    "noImplicitAny": true, // 在表达式和声明上有隐含的 any类型时报错
    "strictNullChecks": true, // 启用严格的 null 检查
    "noImplicitThis": true, // 当 this 表达式值为 any 类型的时候，生成一个错误
    "alwaysStrict": true, // 以严格模式检查每个模块，并在每个文件里加入 'use strict'

    /* 额外的检查 */
    "noUnusedLocals": true, // 有未使用的变量时，抛出错误
    "noUnusedParameters": true, // 有未使用的参数时，抛出错误
    "noImplicitReturns": true, // 并不是所有函数里的代码都有返回值时，抛出错误
    "noFallthroughCasesInSwitch": true, // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）

    /* 模块解析选项 */
    "moduleResolution": "node", // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
    "baseUrl": "./", // 用于解析非相对模块名称的基目录
    "paths": {}, // 模块名到基于 baseUrl 的路径映射的列表
    "rootDirs": [], // 根文件夹列表，其组合内容表示项目运行时的结构内容
    "typeRoots": [], // 包含类型声明的文件列表
    "types": [], // 需要包含的类型声明文件名列表
    "allowSyntheticDefaultImports": true, // 允许从没有设置默认导出的模块中默认导入。

    /* Source Map Options */
    "sourceRoot": "./", // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
    "mapRoot": "./", // 指定调试器应该找到映射文件而不是生成文件的位置
    "inlineSourceMap": true, // 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件
    "inlineSources": true, // 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性

    /* 其他选项 */
    "experimentalDecorators": true, // 启用装饰器
    "emitDecoratorMetadata": true // 为装饰器提供元数据的支持
  }
}
```

#### 2、使用配置文件

tsconfig.json 配置文件用来管理 TS 工程的，具体使用：

1、在当前工程目录下运行`tsc` 命令即可，TS 会自动查找当前目录下的 tsconfig.json 文件，如果没有则会向上级目录查找，直到查找到根目录后截止；

2、如果要指定配置文件可以运行`tsc -p filepath` 运行指定的配置文件

#### 3、工程引用

随着工程规模的扩大，一个工程中的代码量可能会达到数十万行的级别。当 TypeScript 编译器对数十万行代码进行类型检查时可能会遇到性能问题。“分而治之”是解决该问题的一种策略，我们可以将一个较大的工程拆分为独立的子工程，然后将多个子工程关联在一起。工程引用是 TypeScript 3.0 引入的新功能。它允许一个 TypeScript 工程引用一个或多个其他的 TypeScript 工程。借助于工程引用，我们可以将一个原本较大的 TypeScript 工程拆分成多个 TypeScript 工程，并设置它们之间的依赖关系。每个 TypeScript 工程都可以进行独立的配置与类型检查。当我们修改其中一个工程的代码时，会按需对其他工程进行类型检查，因此能够显著地提高类型检查的效率。同时，使用工程引用还能够更好地组织代码结构

1、在根工程的配置文件用配置引用的工程

```json
/*tsconfig.json*/
{
  /*... 省略配置选项*/
  /*设置引用的工程*/
  "references": [
    {
      "path": "./projectOne/"
    },
    {
      "path": "./projectTwo/"
    }
  ]
}
```

2、在子工程供配置

```json
/*tsconfig.json*/
{
  "compilerOptions": {
    "composite": true /*“--composite”编译选项的值是一个布尔值。通过启用该选项，TypeScript编译器能够快速地定位依赖工程的输出文件位置。如果一个工程被其他工程所引用，那么必须将该工程的“--composite”编译选项设置为true。*/,
    "declarationMap": true /*“--declarationMap”是推荐启用的编译选项。如果启用了该选项，那么在生成“.d.ts”声明文件时会同时生成对应的“Source Map”文件。这样在代码编辑器中使用“跳转到定义”的功能时，编辑器会自动跳转到代码实现的位置，而不是跳转到声明文件中类型声明的位置*/
  }
}
```

#### 资料来源

> - [TypeScript Tutorial](https://www.w3schools.com/typescript/index.php)
> - [2022 typescript 史上最强学习入门文章](https://juejin.cn/post/7018805943710253086#heading-42)
> - [如何进阶 TypeScript 功底？](https://zhuanlan.zhihu.com/p/503812618)
> - [TS 练习题](https://github.com/semlinker/awesome-typescript/issues?q=is%3Aissue+is%3Aopen+sort%3Acreated-asc)
