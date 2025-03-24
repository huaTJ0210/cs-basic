const moment = require("./utils/moment.js");

// 1、获取当前日期时间的毫秒数（时间戳）
let s = Date.now();
let s1 = new Date().valueOf();
let s2 = new Date().getTime();

// 2、基本方法
let s3 = new Date();
s3.getFullYear();
s3.getMonth();

// 3、格式化日期对象
const nowTimeStamp = Date.now();
console.log(nowTimeStamp);
const d = moment(nowTimeStamp).format("YYYY-MM-DD hh:mm:ss");
console.log("------:", d);

const dd = moment("2023-03-20 00:00:00").format("YYYY-MM-DD");
console.log("******:", dd);

const d1 = new Date(d);
const st = d1.getTime();
console.log(st);

// 时间戳的处理函数
function getDate(st) {
  const date = new Date(st);

  const year = date.getFullYear();
  const month = formatZero(date.getMonth() + 1);
  const days = formatZero(date.getDate());

  const hour = date.getHours();
  const minute = date.getMinutes();
  const seconds = date.getSeconds();

  return `${year}-${month}-${days} ${hour}:${minute}:${seconds}`;
}

function formatZero(number) {
  return (number = number < 10 ? "0" + number : number);
}

const d3 = getDate(Date.now());
console.log(d3);


// 判断是合法的日期
const isValidDate = (date) => date instanceof Date && !isNaN(date.getTime());
