const wordNumCharRegExp = /^[\u4e00-\u9fa5_a-zA-Z0-9\+\-\*\\/]+$/;

/**
 * 判断字符串中文、字母、数字、标点符号
 * */

function isValidText(str) {
  const isString = typeof str === "string";
  const reg = new RegExp(wordNumCharRegExp, "g");
  const isValid = reg.test(str);
  return isString && isValid;
}

console.log(isValidText("hua hua"));

console.log(isValidText("huahua？？"));
