# 数组

### Array

#### 编码实现 Array 的常用方法

##### flat

> - 输入：[1, 2, [3, 4, 5], [6, 7, [8, 9, 10]]]
>
> - 输出：[1,2,3,4,5,6,7,8,9,10];

```javascript
function flat(arr) {
  const res = [];
  flatRecursion(arr, res);
  return res;
}

function flatRecursion(arr, res) {
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (Array.isArray(item)) {
      flatRecursion(item, res);
    } else {
      res.push(item);
    }
  }
}

// (1) 使用reduce实现flatten
const selfFlatten = function (depth = 1) {
  let array = Array.prototype.slice.call(this);
  if (depth === 0) {
    return array;
  }
  return array.reduce((previous, current) => {
    if (Array.isArray(current)) {
      return [...previous, ...selfFlatten.call(current, depth - 1)];
    } else {
      return [...previous, current];
    }
  }, []);
};
```

##### map

```javascript
Array.prototype._map = function (cb) {
  const array = this;
  const res = [];
  for (let i = 0; i < array.length; i++) {
    res.push(cb(array[i], i, this));
  }
  return res;
};
```

##### reduce

```javascript
Array.prototype._reduce = function (fn, initValue) {
  const array = this;
  let res = typeof initValue === "undefined" ? array[0] : initValue;
  let startIndex = typeof initValue === "undefined" ? 1 : 0;
  array.slice(startIndex).forEach((value, index) => {
    res = fn(res, value, index + startIndex, array);
  });
  return res;
};
```

##### pipe

> 完成函数的顺序调用
>
> [f1,f2,f3,f4] ==> f4(f3(f2(f1(args))))

```javascript
const pipe =
  (...functions) =>
  (input) =>
    functions.reduce((acc, func) => func(acc), input);
```

##### compose

> [f1,f2,f3,f4] ==> f1(f2(f3(f4(args))))

```javascript
function compose(...funcs) {
  if (funcs.length === 0) {
    return (args) => args;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  );
}
```

#### 编码练习

##### 数组结构转树形结构

```js
const  source = [
   {
        id: 1,
        pid: 0,
        name: 'body'
    }, {
        id: 2,
        pid: 1,
        name: 'title'
    }, {
        id: 3,
        pid: 2,
        name: 'div'
    }
]

// 转化为树结构
const  newSource = [
  {
    id: 1,
    pid: 0,
    name: 'body',
    children: [{
            id: 2,
            pid: 1,
            name: 'title',
            children: [{
                id: 3,
                pid: 1,
                name: 'div'
            }]
        }
    }]
```

```javascript
function toTree(data) {
  const result = [];
  if (!Array.isArray(data)) {
    return [];
  }
  const map = {};
  data.forEach((item) => {
    map[item.id] = item;
  });
  data.forEach((item) => {
    const parent = map[item.pid];
    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(item);
    } else {
      result.push(item);
    }
  });
  return result;
}
```

##### 顺序执行 promise

```javascript
function runPromiseInSequence(arr, input) {
  return arr.reduce(
    (promiseChain, currentFunction) => promiseChain.then(currentFunction),
    Promise.resolve(input) // 作为初始值
  );
}
```

##### 多功能函数管道

```javascript
const double = (x) => x + x;
const triple = (x) => 3 * x;
const quadruple = (x) => 4 * x;

// Function composition enabling pipe functionality
const pipe =
  (...functions) =>
  (input) =>
    functions.reduce((accumulator, fn) => {
      return fn(accumulator);
    }, input);

// Composed functions for multiplication of specific values
const multiply6 = pipe(double, triple);
```

##### 数组去重

```javascript
//(1)
var repeatArray = [1, 2, 1, 4, 3, 5, 4, 5];
var deletedRepeatArray = Array.from(new Set(repeatArray));
console.log(deletedRepeatArray);

// (2)
var res4 = repeatArray.reduce(function (array, currentValue) {
  if (array.indexOf(currentValue) === -1) {
    array.push(currentValue);
  }
  return array;
}, []);
```

##### 按照属性对值进行分类

```javascript
/*
    (3) 按照属性的值对Object分类
    {
      '21':[{ name: 'Alice', age: 21 }],
      '20':[
          { name: 'Max', age: 20 },
          { name: 'Jane', age: 20 }
         ]
    }
  */
var people = [
  { name: "Alice", age: 21 },
  { name: "Max", age: 20 },
  { name: "Jane", age: 20 },
];
function groupBy(objArray, property) {
  return objArray.reduce(function (group, obj) {
    var key = obj[property];
    if (!(key in group)) {
      group[key] = [];
    }
    group[key].push(obj);
    return group;
  }, {});
}
var group = groupBy(people, "age");
console.log(group);
```

##### 统计

```javascript
var names = ["Alice", "Bob", "Tiff", "Bruce", "Alice"];
var countedNames = names.reduce(function (allNames, name) {
  if (name in allNames) {
    allNames[name]++;
  } else {
    allNames[name] = 1;
  }
  return allNames;
}, {});
console.log(countedNames);
```

##### 二维数组转化为一维数组

```javascript
var flatArray = [
  [1, 2],
  [3, 4],
  [5, 6],
].reduce((accumulator, currentValue) => {
  return accumulator.concat(currentValue);
}, []);
console.log(flatArray);
```

##### shuffle

```javascript
function shuffle(array) {
  for (let i = 0; i < array.length; i++) {
    const randomIndex = Math.floor(Math.random() * (array.length - i));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
}
```

##### 数组扁平化、去重、排序

> 使用递归的方式进行数组的扁平化

```js
const arr = [
  [1, 2, 2],
  [3, 4, 5, 5],
  [6, 7, 8, 9, [11, 12, [12, 13, [14]]]],
  10,
];

function flat(arr, level = 0) {
  const res = [];
  flatRescurise(arr, res, level, (cur = 0));
  return res;
}

function flatRescurise(arr, res, level, cur) {
  if (level != 0 && level < cur) {
    // 达到层级要求，直接保存数组元素
    res.push(arr);
  } else {
    for (const item of arr) {
      if (Array.isArray(item)) {
        let curIndex = cur;
        flatRescurise(item, res, level, ++curIndex);
      } else {
        res.push(item);
      }
    }
  }
}

// 数组扁平化
const flatArray = flat(arr);
// 去除数组中重复元素
const noRepeatSet = new Set(flatArray);
// 将集合转化为数组
let resultArray = Array.from(noRepeatSet);
// 排序数组
resultArray.sort((a, b) => a - b);
console.log(resultArray);
```

##### 使用迭代的方式实现数组的扁平化

```js
const arr = [1, 2, [3, 4, 5], [6, 7, [8, 9]], 10];

const flatten = (arr) => {
  while (arr.some((item) => Array.isArray(item))) {
    // concat函数可以抹平一维数组
    arr = [].concat(...arr);
  }
  return arr;
};

console.log(flatten(arr));
```
