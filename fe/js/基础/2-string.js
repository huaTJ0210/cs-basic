/**
 * String类型
 */

// 1、字符串的定义方式
let str1 = "hello";
let str2 = String("hello"); //String函数会将传入的值转化为字符串
str1 === str2; //true： String函数遇到字符串返回的是本身
let str3 = new String("hello"); // 生成一个字符串类型的实例对象
str1 !== str3; // 类型不一样

// 2、字符串的扩展
const str4 = "hello world";
let str5 = str4.substring(0, 6); // endIndex不包含
let str6 = str4.slice(0, 6); // slice和substring的差别在于slice的参数可以是负数，而substring不行。 slice中的start如果为负数
str4.includes("hello");
str4.startsWith("hello");
str4.endsWith("world");

// 3、字符串的逆序输出
let str7 = "hello world";

function reverseStr1(str) {
  let _str = str;
  return _str.split("").revserse().join("");
}

function reverseStr2(str) {
  let _str = str;
  let len = _str.length;
  let result = "";
  for (let i = len - 1; i >= 0; i--) {
    result += _str[i];
  }
  return result;
}

function reverseStr3(str) {
  let res = "";
  let len = str.length;
  return recursionStr(str, len - 1, res);
}
function recursionStr(str, pos, res) {
  if (pos < 0) {
    return res;
  }
  res += str[pos--];
  return recursionStr(str, pos, res);
}

console.log(reverseStr3(str7));

// 4、统计字符串中出现次数最多的字符
const str8 = "weweweiiiiii";

function getMaxCount1(str) {
  const map = {};
  for (let i = 0; i < str.length; i++) {
    const s = str[i];
    if (!map[s]) {
      map[s] = 1;
    } else {
      map[s] += 1;
    }
  }
  let maxCount = 0;
  let maxChar = "";
  for (let key in map) {
    const count = map[key];
    if (count > maxCount) {
      maxCount = count;
      maxChar = key;
    }
  }
  return [maxChar, maxCount];
}

function getMaxCount2(str) {
  const map = {};
  let maxCount = 0;
  let maxChar = "";
  str.split("").forEach((s) => {
    if (!map[s]) {
      const count = str.split(s).length - 1;
      if (count > maxCount) {
        maxCount = count;
        maxChar = s;
      }
    } else {
      map[s] = true;
    }
  });
  return [maxChar, maxCount];
}

function getMaxCount3(str) {
  let maxCount = 0;
  let maxChar = "";
  const _str = str.split("").sort().join("");
  for (let i = 0; i < _str.length; i++) {
    const s = str[i];
    const end = str.lastIndexOf(s);
    const count = end - i + 1;
    if (count > maxCount) {
      maxCount = count;
      maxChar = s;
    }
    i = end + 1;
  }
  return [maxChar, maxCount];
}

console.log(getMaxCount3(str8));

// 5、去除字符串中重复出现的字符
const str9 = "hello world";
function removeDuplicateChar1(str) {
  const map = {};
  let res = "";
  for (let i = 0; i < str.length; i++) {
    const s = str[i];
    if (!map[s]) {
      res += s;
      map[s] = true;
    }
  }
  return res;
}

function removeDuplicateChar2(str) {
  let res = Array.prototype.filter.call(str, function (char, index, arr) {
    // 字符首次出现
    return index === arr.indexOf(char);
  });
  return res.join("");
}

function removeDuplicateChar3(str) {
  //ES6的set具有自动去重的功能
  const set = new Set(str.split(""));
  return [...set].join("");
}

// 6 判断一个字符串是不是回文字符串
const str10 = "abccba";
function isPalindrome1(str) {
  let _str = str;
  _str = _str.split("").reverse().join("");
  return _str === str;
}

function isPalindrome2(str) {
  let start = 0;
  let end = str.length - 1;
  while (start < end) {
    if (str[start] === str[end]) {
      start++;
      end--;
    } else {
      return false;
    }
  }
  return true;
}

// 缩小问题规模：首尾比较后，删除获取子串再进行判断
function isPalindrome3(str) {
  if (!str.length) {
    return true;
  }
  let end = str.length - 1;
  if (str[0] !== str[end]) {
    return false;
  }
  return isPalindrome2(str.slice(1, end));
}
