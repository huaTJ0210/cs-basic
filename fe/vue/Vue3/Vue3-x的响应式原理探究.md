> - Vue3.x 中使用 Proxy 替代 Vue2.x 版本中使用 Object.defineProperty 的方式对依赖收集/触发更新；
> - Proxy 弥补了 defineProperty 对数组索引赋值、长度改变、对象删减属性等无法监测的缺陷；
> - 使用 Proxy 创建响应式不需要一初始化就进行循环递归调用设置属性的 get/set 方法，使得性能也得到了提升

### Reflect

> Reflect 对象的方法与 Object 上的方法一一对应，主要优化了将一些命令式编程转化为函数式调用，同时优化了方法调用的报错信息，如果函数调用失败只会返回 true 和 false，并不会产生异常；

### reactive

> reactive 函数是将一个对象转化为响应式：主要在对应代理的 handler 方法中完成依赖的收集和触发操作

```js
export function reactive(target) {
  // 1、判断目标是否为对象类型
  if (!isObject(target)) return target;
  // 2、创建代理的处理对象
  const handler = {
    get(target, key, receiver) {
      // --- 收集依赖---
      track(target, key);
      // 根据key获取结果
      const result = Reflect.get(target, key, receiver);
      // 如果result仍旧为对象则继续调用reactive进行处理，否则返回本身
      return convert(result);
    },
    set(target, key, value, receiver) {
      // 根据key获取目标的原始值
      const oldValue = Reflect.get(target, key, receiver);
      let result = true;
      if (oldValue !== value) {
        // 原始值和当前值不一致则进行更新
        result = Reflect.set(target, key, value, receiver);
        // 触发更新 -- 通知key对应的deps执行相应的回调函数
        trigger(target, key);
      }
      return result;
    },
    deleteProperty(target, key) {
      // 判断目标中是否存在当前key
      const hadKey = hasOwn(target, key);
      const result = Reflect.deleteProperty(target, key);
      if (hadKey && result) {
        // 触发更新 -- 通知key对应的deps执行相应的回调函数
        trigger(target, key);
      }
      return result;
    }
  };
  // 返回代理对象
  return new Proxy(target, handler);
}
```

### 收集依赖及触发更新

> targetMap（数据类型为 WeakMap） : key 为目标对象，value 则为 depsMap
>
> depsMap（数据类型为 Map）: key 为目标对象的属性，value 则为 deps
>
> deps：一个存储对象属性对应的回调函数的集合（Set 类型）

```js
let targetMap = new WeakMap();

export function track(target, key) {
  // 判断当前是否存在需要触发更新的回调函数 【effect可以理解为vue2.0的watcher】
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  dep.add(activeEffect); // 向依赖列表中添加回调函数
  activeEffect.deps.push(dep);
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const dep = depsMap.get(key);
  if (dep) {
    // 依次触发依赖列表中的回调函数
    dep.forEach((effect) => {
      effect();
    });
  }
}
```

### ref

> ref 函数将一个基本类型数据转化为响应式

```js
export function ref(obj) {
  // 判断 obj 是否是ref 创建的对象，如果是的话直接返回
  if (isObject(obj) && obj.__v_isRef) {
    return obj;
  }
  // 如果obj是对象，则使用reactive进行转化
  let value = convert(obj);
  // 创建一个临时对象
  const r = {
    __v_isRef: true, // 作为使用ref创建对象的标志符
    get value() {
      track(r, 'value'); // 依赖收集
      return value;
    },
    set value(newValue) {
      if (newValue !== value) {
        obj = newValue;
        // 如果设置的值仍旧为对象类型，则会把设置的值也转化为响应式
        value = convert(obj);
        trigger(r, 'value'); // 依赖触发
      }
    }
  };
  return r;
}

export function toRefs(proxy) {
  const ret = proxy instanceof Array ? new Array(proxy.length) : {};

  for (const key in proxy) {
    ret[key] = toProxyRef(proxy, key);
  }

  return ret;
}

function toProxyRef(proxy, key) {
  const r = {
    __v_isRef: true,
    get value() {
      return proxy[key];
    },
    set value(newValue) {
      proxy[key] = newValue;
    }
  };
  return r;
}
```

### effect

> 可以监听回调函数内部响应式数据的变化，一旦发生变化，就会触发回调函数的再次执行

```js
let activeEffect = null;
export function effect(callback) {
  activeEffect = callback;
  callback(); // 访问响应式对象属性，去收集依赖
  activeEffect = null;
}
```

### computed

```js
export function computed(getter) {
  const result = ref();
  effect(() => (result.value = getter()));
  return result;
}
```

### 其他

```js
// 工具类函数
const isObject = (val) => val !== null && typeof val === 'object';
const convert = (target) => (isObject(target) ? reactive(target) : target);
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (target, key) => hasOwnProperty.call(target, key);
```
