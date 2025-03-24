/*
  (1) switch中的逻辑判断：
  javascript的switch语句中数据进行比较是 === ，不会进行隐式的类型转化
*/
function isString(str) {
  switch (str) {
    case "1":
      console.log("1");
      break;
    case "2":
      console.log("2");
    default:
      console.log("other");
  }
}

console.log(isString("1"));
console.log(isString(1)); // 采用严格相等进行判断因此执行的是default中的逻辑

/*
 (2) javascript中的一些判空方法
*/
let obj;
if (obj == undefined) {
  console.log("obj为null或者undefined");
}
obj = {};

// 判断是否为空对象
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// 空数组
let emptyArray = [];
emptyArray instanceof Array && emptyArray.length === 0;

// 空字符串
let str = "";
str == "" || str.trim().length === 0;

// 0 或者 NaN
let num = 0;

num === 0 || num !== num;

// !x == true
let expression;
if (!expression) {
  console.log("expression可能的值：null、undefined、空字符串、0、NaN");
}
