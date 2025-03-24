// --------- @type标注变量的类型 ---------

/**
 * @type {number}
 */
let myNumber = 10;

/**
 * @type {string[]}
 */
let myArray = ["apple", "banana", "orange"];

/**
 * @type {Object.<string, number>}
 */
let myObject = {
  key1: 10,
  key2: 20,
};

/**
 * @type {function(string): number}
 */
let myFunction = function (str) {
  return str.length;
};

/**
 * @description: 函数
 * @param {string} arg - 入参
 * @return {string}
 */
const testFunc = (arg) => {
  return arg;
};
