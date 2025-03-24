//  泛型函数
function assign<T, U>(target: T, source: U): T & U {
  return Object.assign({}, target, source);
}

interface Point {
  x: number;
  y: number;
}

//#region -- 子类型 --
//如子类继承父类，子类一定比父类的成员更丰富
/*
  {x:1}不是Point的子类型
   
  以下均是Point的子类型
    {x:1,y:1}
    {x:1,y:1:z:3}
  */
//#endregion

// 类型约束
function identity<T extends Point>(x: T): T {
  return x;
}

/*
  泛型函数的类型参数不表示参数之间或参数与返回值之间的某种关系，
  那么使用泛型函数可能是一种反模式。
*/
function f0<T>(x: T): T {
  return x;
}

const a = f0('a'); // a的类型是'a'

// 使用extends做类型约束 :
function getProperty<T extends object, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
