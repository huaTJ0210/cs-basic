/**
 * 1、函数的组合，将若干函数组合成一个新的函数
 *  函数的调用顺序从右到左
 */
const compose =
  (...fns) =>
  (value) =>
    fns.reduceRight((acc, fn) => fn(acc), value);

// 1-1
const fn1 = (x) => x + 1;
const fn2 = (x) => x * 2;
const fn3 = (x) => Math.pow(x, 2);

const lastFn = compose(fn3, fn2, fn1);
console.log(lastFn(2));

// 1-2
const equalTo = (y) => (x) => x === y;
const equalToOne = equalTo(1); // 得到一个新函数
const divideBy = (y) => (x) => x % y;
const remainderOfTwo = divideBy(2);

const isOdd = compose(equalToOne, remainderOfTwo);

/**
 * 2、管道：将输入依次调用函数进行处理，最终得到输出
 * + 和compose函数的操作相反
 *
 */

// 2.1 将一个函数的参数逆序处理后得到一个新函数

const reverseArgs =
  (fn) =>
  (...args) =>
    fn(...args.reverse());
// 2.2 将compose函数修改成pipe函数
const pipe = reverseArgs(compose);

/**
 * 3、curry：函数柯里化
 * 将多个函数的参数转化为只有一个参数的函数调用（缓存函数的若干参数）
 */

const curry = (fn) => {
  return function inner(...args) {
    if (args.length < fn.length) {
      return (...innerArgs) => {
        return inner(args.concat(Array.from(...innerArgs)));
      };
    }
    return fn(...args);
  };
};
