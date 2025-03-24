/*
基本语法
   （1）\d : 匹配一个数字
   （2）\w ： 字母、数字、下划线 等价于：[a-zA-Z0-9_]
   （3）. ： 可以匹配任意字符(\n \r 除外)
   ----  规定字符的长度 ---
   （4）* ： 代表前面的字符出现 (0 - n) o* :
   （5）+ : 代表前面的字符出现（1 - n） o+ : 
   （6）？ ：0或者1个
   （7）{n}:表示n个字符
   （8）{n,m}:表示n-m个字符
   
   /\d{3}\s+\d{3,8}/

   --- 精准匹配 ----
   (1) [0-9a-zA-Z\_]可以匹配一个数字、字母或者下划线；
   (2) [0-9a-zA-Z\_]+可以匹配至少由一个数字、字母或者下划线组成的字符串，比如'a100'，'0_Z'，'js2015'等等；
   (3) [a-zA-Z\_\$][0-9a-zA-Z\_\$]*可以匹配由字母或下划线、$开头，后接任意个由一个数字、字母或者下划线、$组成的字符串，也就是JavaScript允许的变量名；
   (4) [a-zA-Z\_\$][0-9a-zA-Z\_\$]{0, 19}更精确地限制了变量的长度是1-20个字符（前面1个字符+后面最多19个字符
  --- 开头、结尾、 或 ---
  (1) ^表示行的开头，^\d表示必须以数字开头。
  (2) $表示行的结束，\d$表示必须以数字结束。
*/

// (1) 匹配 0 ~ 99的正整数
// var regExp = /^(?:0|[1-9]\d)$/ // (?:pattern)例如， 'industr(?:y|ies) 就是一个比 'industry|industries' 更简略的表达式。
// console.log(regExp.test(00))

const a = "const xnskyyzx = '../pages/login/xnskyyzx.vue'";

const regExp = /'([^']*)'/;

const b = a.replace(regExp, function (match, offset, letter) {
  return `()=>import(${match})`;
});

console.log(b);

// 只允许输入数字和小数的正则
const onlyNumerOrDecimal = /^\d+$|^\d*\.\d+$/g;

// 只允许输入数字和小数的正则表达式
