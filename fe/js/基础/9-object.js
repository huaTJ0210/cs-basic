/**
 * 0、对象: 一组无序属性的集合
 *  + 创建方式
 *   - 使用Object创建
 *   - 使用对象字面量创建
 * */

const o = new Object();
o.name = "li";

const o1 = {
  name: "za",
  sayHi() {
    console.log("sayHi");
  },
};

/**
 *  0.1 、对象属性的特性
 *  + 对于对象属性的描述
 * */

const o2 = Object.defineProperty({}, "name", {
  value: "zs",
  writable: true,
  configurable: true,
  enumerable: true,
});

Object.defineProperties(
  {},
  {
    name: {
      value: "za",
      writable: false,
      enumerable: false,
      configurable: false,
    },
  }
);

/**
 *  1、遍历对象
 *  + for..in : 遍历得到的是可枚举属性，包含原型对象上的属性
 *  + for..of : 使用迭代器进行遍历
 * */

const obj = {
  age: 10,
  name: "li",
};

for (let key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(key);
  }
}

for (let [key, value] of Object.entries(obj)) {
  console.log(key, value);
}

// 将对象转化为map结构
console.log(new Map(Object.entries(obj)));

// 2 、values、keys
Object.values(obj);
Object.keys(obj); // 对象自身可枚举的属性

// 3、getOwnPropertyDescriptors
const p1 = {
  firstName: "lei",
  lastName: "wang",
  get fullName() {
    return this.firstName + " " + this.lastName;
  },
};

/*
// 需要注意，复制的get方法直接转化为固定属性
  const p2 = Object.assign({}, p1)
p2.lastName = 'zhang'
console.log(p2)
*/

const description = Object.getOwnPropertyDescriptors(p1);
const p2 = Object.defineProperties({}, description);
console.log(p2);

/**
 *  4、基本概念
 *  + 构造函数
 *  + 原型
 *  + 原型链
 *  + 实例对象
 *  + instanceof
 */

/**
 * 5、继承
 */

function Person() {}

function Student() {
  // 盗用父类构造函数，解决无法给父类构造函数传递初始化参数问题
  Person.call(this);
}

/**
 * 5.1、 原型链 : Student.prototype = new Person()
 *  存在的问题：
 *  + 当存在引用类型的属性时会导致所有Student实例都共享该属性
 *  + 无法给父类构造函数传递初始化参数
 */

/**
 * 5.2、 盗用构造函数 ： 在子类构造函数中调用 Person.call(this)
 *  存在的问题：
 *  + 共享的属性和方法必须定义在父类的构造函数中
 */

/**
 * 5.3、 组合式继承 ： 原型链+盗用构造函数
 *  存在的问题：
 *  + 父类的构造函数会被调用2次
 */

/**
 * 5.4、 原型式继承
 *  适用情况：
 *  + 使用一个基准的对象构建一个新对象，并对新对象进行增强
 *  + 无需创建构造函数，但也会出现所有实例共享一个原型对象带来的问题
 *
 *  + ES5对原型式继承规范后定义了新的方法：Object.create()并接收2个参数
 *   - 参数1：基准对象
 *   - 参数2：属性描述对象，用来对新对象增加属性（类似Object.defineProperty的第2个参数）
 *
 */
function createObject(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

/**
 * 5.5、 寄生式继承：创建一个实现继承的函数，以某种方式增强对象，然后返回这个对象
 *
 */

function createAnother(o) {
  let clone = createObject(o);
  clone.sayHi = function () {};
  return clone;
}

/**
 * 5.6 寄生式组合继承
 *
 */

Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;

/**
 *  6、 new操作符的实现(工作原理)
 */

function newFunc(constructor, ...rest) {
  // 创建一个新对象，并且内部[[prototype]]指向constructor.prototype
  const obj = Object.create(constructor.prototype);
  // 调用constructor
  const result = constructor.apply(obj, rest);
  return typeof result === "object" && result !== null ? result : obj;
}

/**
 * 7、 instanceof操作符的实现原理
 */

function intanceofMock(l, r) {
  // 校验函数入参的合法性
  if (typeof l !== "object") {
    return false;
  }

  while (true) {
    if (l === null) {
      return false;
    }
    if (l.__proto__ === r.prototype) {
      return true;
    }
    l = l.__proto__;
  }
}

function instanceofFunc(a, b) {
  if (typeof a !== "object") {
    return false;
  }
  let proto = Object.getPrototypeOf(a);
  while (proto) {
    if (proto === b.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

// 8、通过指定key路径获取对象的值

const objOne = {
  user: {
    posts: [
      {
        title: "Foo",
        comments: ["Good one", "interesting"],
      },
    ],
  },
};

const get = (paths, objOne) =>
  paths.reduce((res, cur) => (res && res[cur] ? res[cur] : null), objOne);

// 函数柯里化 ： 将本来传递多个参数的函数转化为只传递一个参数的函数
const newGet = (paths) => (objOne) =>
  paths.reduce((res, cur) => (res && res[cur] ? res[cur] : null), objOne);

// ['Good one', 'interesting']
console.log(get(["user", "posts", 0, "comments"], objOne));

const getUserComments = newGet(["user", "posts", 0, "comments"]);
console.log(getUserComments(objOne));

/**
 * 9、对象的浅拷贝
 *
 */

function shadowCopy(source) {
  if (source == undefined || typeof source !== "object") {
    // 基本类型及null、undefined直接返回
    return source;
  }
  const res = source instanceof Array ? [] : {};
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      res[key] = source[key];
    }
  }
  return res;
}

/**
 * 10、对象的深拷贝
 * +
 */

const isObject = (item) => item !== null && typeof item === "object";
const isFunction = (obj) => typeof obj === "function";

/*
function deepClone(obj, hash = new WeakMap()) {
  if (hash.get(obj)) {
    return hash.get(obj);
  }
  if (!isObject(obj)) {
    return obj;
  }
  if (isFunction(obj)) {
    return obj;
  }

  let cloneObj;
  const Constructor = obj.constructor;
  switch (Constructor) {
    case Boolean:
    case Number:
    case String:
    case RegExp:
    case Date:
      return new Constructor(obj);
    default:
      cloneObj = new Constructor();
      hash.set(obj, cloneObj);
  }
  // 字符串及Symbol的属性都可以获取
  Reflect.ownKeys(obj).forEach((key) => {
    cloneObj[key] = deepClone(obj[key], hash);
  });
  return cloneObj;
}
*/

const deepClone = (obj, hash = new WeakMap()) => {
  if (!isObject(obj)) return obj;
  if (isFunction(obj)) return obj;
  if (hash.has(obj)) return hash.get(obj);
  const Constructor = obj.constructor;
  switch (Constructor) {
    case String:
    case Number:
    case Boolean:
    case Date:
    case RegExp:
      return new Constructor(obj);
  }
  // 保证新创建对象原型链
  const allDesc = Object.getOwnPropertyDescriptors(obj);
  let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc);
  // 解决循环引用
  hash.set(obj, cloneObj);
  // 可枚举、不可枚举及symbol皆复制
  Reflect.ownKeys(obj).forEach((key) => {
    cloneObj[key] = deepClone(cloneObj[key], hash);
  });
  return cloneObj;
};

/**
 * 11、Object.create() : polyfill
 */

Object.create = function (proto, propDes) {
  const f = function () {};
  f.prototype = proto;
  const res = new f();
  Object.defineProperties(res, propDes);
  return res;
};
