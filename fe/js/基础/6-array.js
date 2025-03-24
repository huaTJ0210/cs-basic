// 0、 数组的基本方法

// splice: splice(start, deleteCount, item1, item2, itemN)

// fill: fill(value, start, end)

// 1、扁平数组转树形结构

function convertTree(array) {
  const res = [];
  const map = {};

  array.forEach((element) => {
    const id = element.id;
    if (!map[id]) {
      map[id] = {
        children: [],
      };
    }
    map[id] = { ...map[id], ...element };

    const current = map[id];
    const parentId = current.parentId;

    if (!map[parentId]) {
      map[parentId] = {
        id: parentId,
        children: [],
      };
      if (parentId === 0) {
        res.push(map[parentId]);
      }
    }
    map[parentId].children.push(current);
  });

  return res;
}

const array = [
  { id: 1, name: "菜单1", parentId: 0 },
  { id: 2, name: "菜单2", parentId: 0 },
  { id: 3, name: "菜单3", parentId: 2 },
  { id: 4, name: "菜单4", parentId: 2 },
  { id: 5, name: "菜单5", parentId: 3 },
];

// const res = convertTree(array)
// console.log(JSON.stringify(res))

// 2 : 实现数组的flat方法
Array.prototype.flatMock = function (level = 1) {
  const array = this;
  const result = [];
  flatRecursively(result, array, 0, level);
  return result;
};

function flatRecursively(result, array, curLevel, level) {
  if (curLevel === level) {
    result.push(array);
    return;
  }
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (Array.isArray(item)) {
      let cur = curLevel;
      flatRecursively(result, item, cur++, level);
    } else {
      result.push(item);
    }
  }
}

const arr1 = [1, 2, [3, 4], [[5, 6], 7]];
// console.log(arr1.flatMock(2));

// 3、instanceOf:通过原型链的查找判断一个变量是否为某个数据类型的实例
const arr2 = [1, 2, 3];
arr2 instanceof Array;

// 4、constructor
const arr3 = [1, 2, 3];
arr3.constructor === Array;
arr3.__proto__ = Array.prototype; //构造函数的原型

// 5、filter ： 过滤/去重 得到一个新的数组

// 6、reduce：累加器处理数组元素
const arr4 = [1, 2, 2, 3, 3, 3, 4, 5];
// 6-1： 统计数组中每个元素出现的次数
const countOfElement = arr4.reduce((acc, cur) => {
  acc[cur] ? acc[cur]++ : (acc[cur] = 1);
  return acc;
}, {});

// 7、获取数组的最大值或者最小值
Array.prototype.min = function () {
  let min = this[0];
  for (let i = 1; i < this.length; i++) {
    if (min > this[i]) {
      min = this[i];
    }
  }
  return min;
};

Array.min = function (array) {
  return Math.min.apply(Math, array);
};

Array.prototype.max = function (array) {
  return array.reduce((acc, cur) => {
    return acc > cur ? cur : acc;
  });
};

// 8 、数组中出现次数最多的元素
const arr5 = [1, 2, 3, 3, 3, 4, 5, 6, 7];

function findMost(array) {
  let maxEl = "";
  let maxCount = 0;
  array.reduce((acc, cur) => {
    acc[cur] ? acc[cur]++ : (acc[cur] = 1);
    if (acc[cur] > maxCount) {
      maxCount = acc[cur];
      maxEl = cur;
    }
    return acc;
  }, {});
  return [maxEl, maxCount];
}

function arrayUnique(array) {
  let map = new Map();
  return array.filter((item) => !map.get(item) && map.set(item, 1));
}
