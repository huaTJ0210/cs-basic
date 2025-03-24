# Set 和 Map

#### Set

```javascript
// (1) 基本使用
const s = new Set();
[2, 3, 3, 4, 5].forEach((x) => s.add(x)); // 通过add方法增加成员
for (let i of s) {
  console.log(i); // 2,3,4,5
}

// (2) 使用数组创建set
const set = new Set([1, 2, 2, 4, 5]); // 间接的进行了数组的去重操作
[...set]; // [1,2,4,5]
set.size; // 4 :获取set成员的个数
[...new Set("ababbc")].join(""); // 去除字符串中重复的字符

// (3)set的属性和方法
let s = new Set();
s.add(1).add(2).add(2); // 注意2被加入了两次
s.size; // 2
s.has(1); // true
s.has(2); // true
s.has(3); // false
s.delete(2);
s.has(2); // false

// (4) Array.from 把Set结构转为数组
const items = new Set([1, 2, 3, 4, 5]);
const array = Array.from(items);

// (5) 遍历操作
let set = new Set(["red", "green", "blue"]);

for (let item of set.keys()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
```

#### WeakSet

> WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有两个区别
>
> - 首先，WeakSet 的成员只能是对象，而不能是其他类型的值;WeakSet 中的对象都是弱引用
> - 其次，WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用

```javascript
// （1）基本使用及注意事项
const a = [
  [1, 2],
  [3, 4],
];
const ws = new WeakSet(a);
// WeakSet {[1, 2], [3, 4]}
const b = [3, 4];
const ws = new WeakSet(b); // b中的元素不是对象
// Uncaught TypeError: Invalid value used in weak set(…)

// (2) 基本使用示例
const foos = new WeakSet();
class Foo {
  constructor() {
    foos.add(this);
  }
  method() {
    if (!foos.has(this)) {
      throw new TypeError("Foo.prototype.method 只能在Foo的实例上调用！");
    }
  }
}
```

#### Map

```JavaScript
// (1) 基本使用
const m = new Map();
const o = {p: 'Hello World'};

m.set(o, 'content')
m.get(o) // "content"

m.has(o) // true
m.delete(o) // true
m.has(o) // false

// (2) 接收特殊数组
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);

map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"

// (3) 基本方法
const map = new Map();
map.set('foo', true);
map.set('bar', false);
m.get('foo');// true
map.size // 2
map.has('foo');// true
map.delete('foo');
map.clear(); //  清除所有的成员


// (4) 遍历方法
const map = new Map([
  ['F', 'no'],
  ['T',  'yes'],
]);

for (let key of map.keys()) {
  console.log(key);
}
// "F"
// "T"

for (let value of map.values()) {
  console.log(value);
}
// "no"
// "yes"

for (let item of map.entries()) {
  console.log(item[0], item[1]);
}
// "F" "no"
// "T" "yes"

// 或者
for (let [key, value] of map.entries()) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"

// 等同于使用map.entries()
for (let [key, value] of map) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"

// (5) 数组的map方法、filter方法，可以实现 Map 的遍历和过滤（Map 本身没有map和filter方法
const map0 = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');

const map1 = new Map(
  [...map0].filter(([k, v]) => k < 3)
);
// 产生 Map 结构 {1 => 'a', 2 => 'b'}

const map2 = new Map(
  [...map0].map(([k, v]) => [k * 2, '_' + v])
    );
// 产生 Map 结构 {2 => '_a', 4 => '_b', 6 => '_c'}

```

#### WeakMap

> `WeakMap`结构与`Map`结构类似，也是用于生成键值对的集合。key 只能是对象，`WeakMap`的键名所指向的对象，不计入垃圾回收机制。
