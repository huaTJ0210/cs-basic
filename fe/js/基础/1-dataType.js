// 1、基本数据类型和引用数据类型

// 2、原始值包装类型
let str1 = 'hello world';
let len1 = str1.length; // str1上调用length方法实际上是包装类型上的方法（引擎内部自动执行的）

// 3、Math
const r = Math.random(); // 0~1之间的随机数
const r1 = Math.floor(Math.random() * 7) + 2; // 2~9之间的随机数

/**
 * 4、数据类型判断
 */

/*
  4.1、 数据类型的判断：typeof
  能准确的判断出除了null以外的基本数据类型（string、number、boolean、undefined）
  还能判断function、symbol
*/

/*
  4.2、 Object.prototype.toString.call(xx)
   + 获取数据类型 [object Xx]
   + 如果传入的参数是基本类型返回的是基本类型对应的包装类型 ‘number’ ==》 Number
*/

// 数据类型检测函数
const toString = Object.prototype.toString;
function type(x) {
  // null
  if (x === null) {
    return 'null';
  }
  // 基本数据类型
  const t = typeof x;
  if (t !== 'object') {
    return t;
  }
  // 使用toString获取数据类型
  let cls;
  let clsLower;
  try {
    cls = toString.call(x).slice(8, -1);
    clsLower = cls.toLowerCase();
    return clsLower;
  } catch (error) {
    return 'object';
  }
}

/*
  5、数据类型隐式转化
  + 引用类型如果用于数据展示则先调用toString()方法，如果该方法返回基本类型则转化为字符串
  如果返回引用类型则会调用valueOf，返回基本类型则转化为字符串，返回对象类型则报错
  + 应用类型如果用于数值计算则与上述的方法调用顺序相反
*/

const foo = {
  toString() {
    return 'li';
  },
  valueOf() {
    return 1;
  }
};

// 6、 cannot read property of undefined

/*
  + 空值合并运算符：  xx ?? 'defaultValue'
  + 可选链式操作符： user?.friend?.name  ： 
   babel的处理是先判断user是否为null 然后再将user.friend赋值给一个临时变量user$friend
*/

/*
  7、Null与Undefined的区别？
  + 相同点
    - 转化为布尔类型都是false
    - 都仅有一个字面量值：null、undefined
    - 作为对象类型获取属性都会报异常
  + 不同点
    - 使用typeof获取的值不一样
    - null为关键字，undefined是window的一个属性
*/

// 8、如何判断一个value是数字类型
function isNumber(value) {
  // NaN 的类型也是number
  return typeof value === 'number' && isFinite(value);
}

// 9、布尔类型 Boolean ： true或者false

/*
   10、Number类型
   + 解决小数的加减乘除运算：bigNumber的库或者自定义工具类的方式
   + 数字的格式化输出：bigNumber
*/

//  123456789
// 从尾部开始遍历，拼接字符，当计数器能整除3并且当前index不为0，则增加一个,
function toThousands(num) {
  let result = '';
  let number = (num || 0).toString();
  let counter = 0;
  for (let i = number.length - 1; i >= 0; i--) {
    counter++;
    result = number.charAt(i) + result;
    if (!(counter % 3) && i != 0) {
      result = ',' + result;
    }
  }
  return result;
}

console.log(toThousands(123456789)); // 123,456,789
