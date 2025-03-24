## Vue 的内部实现原理探究

### Vue 首次渲染的过程

> - Vue 版本 2.5.x
> - Vue 的构造函数中给 Vue 原型对象附加一些方法和属性，同时将 options 中的配置进行处理
>
>   - 处理 inject，并将注入的数据变成响应式
>
>   - 处理 props，并将 props 一一添加到 Vue 的实例对象上
>   - 处理 methods，并将 methods 一一添加到 Vue 的实例对象上
>   - 处理 data，并将 data 中的数据整体变为响应式
>   - 处理 computed 和 watcher
>
> - 调用$mount 进行渲染
>
>   - 如果存在模板，需要将模板转化为 render 函数
>   - 如果不存在模板，则创建渲染 Watcher 对象，并在 Watcher 对象内部调用 updateComponent =》 vm.\_update(vm.\_render(), hydrating)

#### Vue 初始化实例成员

> Vue 构造函数（[vue](https://github.com/vuejs/vue/tree/v2.6.14)/[src](https://github.com/vuejs/vue/tree/v2.6.14/src)/[core](https://github.com/vuejs/vue/tree/v2.6.14/src/core)/[instance](https://github.com/vuejs/vue/tree/v2.6.14/src/core/instance)/index.js）

```js
function Vue(options) {
  this._init(options);
}

// 注册vm的_init()方法，并初始化vm
initMixin(Vue);
//  注册vm的$data/$props/$delete/$watch
stateMixin(Vue);
// 初始化事件相关方法$on/$once/$off/$emit
eventsMixin(Vue);
// 初始化生命周期相关方法_update/$forceUpdate/$destroy
lifecycleMixin(Vue);
// 混入render $nextTick/_render
renderMixin(Vue);

export default Vue;
```

##### \_init()方法

```js
function _init() {
  vm._self = vm;

  // 初始化vm实例的私有或者共有变量：$parent/$children/$refs
  initLifecycle(vm);
  // 初始化vm._events
  initEvents(vm);
  // 初始render的h函数（createElement）
  initRender(vm);

  callHook(vm, 'beforeCreate'); // 生命周期函数

  /*
     根据inject中key在当前vm实例或者父vm实例的_provide中查找对应的值，
     如果找到则存储在result对象中；
     最终调用defineReactive将result设置为响应式对象
    */
  initInjections(vm);

  /*
      响应式数据构建
    */
  initState(vm);

  // 给当前的vm实例初始化_provide对象
  initProvide(vm); // resolve provide after data/props
  callHook(vm, 'created');

  // 调用$mount进行挂载
  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
}
```

### 数据的响应式原理

#### Dep

> - Dep 类内部定义一个数组，用于保存对应属性 key 的依赖（watcher）列表，同时负责在属性的 get 方法中添加依赖：`dep.depend()`;
>
> - 在属性的 set 方法中通知依赖(各种 watcher：组件，自定义的 watcher)执行回调方法：`dep.notify()`;
> - 每个 Dep 都有一个唯一的 uid，规避被重复添加到 watcher 的依赖中（deps：数组类型，存放 watcher 被加入到哪些 dep 中）；

#### Watcher

> - watcher 实例通过对传入的 expOrfn 进行 path 解析返回获取指定属性值的 getter 函数（==expOrfn 如果是函数类型直接赋值给 getter==）；通过调用 getter 函数获取属性的值，由于触发了属性的 getter，所以将 watcher 实例收集到了该属性的依赖列表中（将 watcher 设置到 window.target ，然后调用 getter();在设置 window.target=null,即完成了依赖的收集）；
> - 当属性发生改变时，在 set 方法中会通知该属性对应的依赖列表，则对应的 watcher 的 update 函数会执行，由此再执行设置的 callback 函数执行相应的业务逻辑
> - ==如何避免依赖收集重复的 watcher？==：在 Watcher 内部初始化 deps（数组类型），depIds（集合类型）；在 addDep 方法中判断当前要添加的 depId 是否已存在，不存在就添加，然后调用 dep 的 addsub 将 watcher 添加到依赖数组中
> - $watcher 的实现原理？
>   - immediate：设置该值为 true 时，则直接获取监测值，并调用回调函数
>   - deep：当 watcher 中设置 deep 为 true，则会在调用 getter 方法获取当前值后，采用递归的方式对 value 进行处理，如果 value 已经是响应式对象了并且已经添加到集合中，则直接返回；否则一一遍历数据（数组或者对象）；对于对象获取值会触发 getter 方法，此时 window.target 还存在 watcher 实例，这样就能添加依赖了

##### Observer

> - Observer 的主要用途对于响应式属性（状态）完成：获取值时添加依赖（每个属性都有对应的 watcher 实例），修改值时通知依赖（watcher 中的 update 函数执行）的回调函数进行更新
> - Observer 实例给每个待转为响应式的对象设置一个属性：** ob ** 保存着 Observer 的实例；通过这个属性可以避免重复给对象添加响应式；
> - 对于对象和数组 Observer 的处理方式不同:
>   - 数组类型的数据会修改数组的原型对象为自定义对象==[value.__proto__ = 代理对象]==（使用 Object.create(Array.prototype)创建），拦截（push/pop/shift/unshift/splice/reverse/sort）当数组元素发生变动时通知依赖；依赖的收集是在获取数组的 getter 方法中完成的；==数组的依赖列表存在 Observer 实例上（便于 get 方法和拦截器都能访问到）==
>   - 对象类型的数据 Observer 会遍历对象的所有 key，使用 Object.defineProperty(data,key,value)进行 getter 方法中收集依赖，setter 方法中通知依赖更新；对于属性值是对象的采用递归的方式（==new Observer(obj)==）添加响应式
> - 对于数组新增元素的响应式检测：
>   - 通过拦截 push/unshit/splice 获取 inserted，对该值进行响应式处理，并手动触发值的更新通知
> - vue2 中不能对对象的新增 key 、删除 key 、数组下标赋值、数组长度更改等进行响应式

##### 数组拦截器实现对指定方法的拦截

> 数组的响应式拦截不同于对象需要特殊处理

```js
const arrayPrototype = Array.prototype;
const proxyArrayPrototype = Object.create(arrayPrototype);
[('push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort')].forEach(
  (method) => {
    const originMethod = arrayPrototype[method];
    Object.defineProperty(proxyArrayPrototype, method, {
      value: function (...args) {
        const result = originMethod.apply(this, args);
        // this代表当前数组
        const ob = this.__ob__; // 当前值获取Observer实例
        // 对数组中新增的元素进行增加响应式
        let inserted; // 保存新增的数据
        switch (method) {
          case 'push':
          case 'unshift':
            inserted = args;
            break;
          case 'splice':
            inserted = args.slice(2);
            break;
        }
        // 如果有数据新增
        if (inserted) {
          // observeArray ： 循环遍历数组的每一个元素，调用observer(item),完成响应式添加
          ob.observeArray(inserted);
        }
        ob.dep.notify(); // 触发依赖通知
        return result;
      },
      enumerable: false,
      writable: true,
      configurable: true
    });
  }
);
```

##### 数组如何收集依赖

> - 在 Observer 的构造函数中创建`this.dep = new Dep()`,将 dep 挂载到 Observer 的实例上
> - 在进行遍历对象属性时，当属性的值是对象则返回一个 observer 实例，这样就可以在 getter 中调用`ob.dep.depend()`;将依赖收集；

#### computed（计算属性）

> 1、创建计算属性的 wachers 存储容器：`vm._computedWatchers = Object.create(null)`

> 2、遍历 computed 中的所有 key，为每一个 key 创建 wacher

```js
watchers[key] = new Watcher(
  vm,
  getter || noop, // 开发者自定义的计算属性的函数
  noop,
  computedWatcherOptions
);
```

> 3、创建的每一个计算属性 watcher 都会被加入到 vm 的 watchers 中 : `vm._watchers.push(this)` 【位于 watcher 的构造函数中，便于后续的清理】

> 4、如果 key 不在 vm 实例上，需要将属性挂载到 vm 上，当调用计算属性求值时，则会触发计算属性定义的函数

```js
// 将计算属性设置的函数转化为computedGetter
// 每当计算属性被读取时，computedGetter 函数都会被执行。
function createComputedGetter(key) {
  return function computedGetter() {
    const watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      return watcher.evaluate();
    }
  };
}
```

### 模板编译

#### 解析器

> - 将模板转化为 AST（抽象语法树，每个节点都是 js 对象，保存后续节点渲染所需要的数据{tag:标签名，type：元素的类型，attrsList：属性列表，children：[], parent：父节点，static：是否为静态节点}）
> - HTML 解析器解析开始标签、结束标签、文本、注释然后触发对应的钩子函数创建对应的 AST 对象
> - HTML 解析器构建 AST 关系时采用的是 stack 数据结构

##### 开始标签的解析

```js
// 匹配HTML开始标签的正则表达式
const reg = /^<((?:[a-zA-Z_][\w]*)?[a-zA-Z_][\w]*)/;

const res1 = '<div></div>'.match(reg);
// [ '<div', 'div', index: 0, input: '<div></div>', groups: undefined ]
console.log(res1);
const res2 = '</div><div>'.match(reg);
console.log(res2); // null
```

#### 优化器

> - 在 AST 上找出所有的静态节点并打上标记

#### 代码生成器

### Vue 内部相关 API 的实现

#### 与数据相关的实例方法

> 在 Vue 的初始化构造函数定义下，调用 stateMixin 将$set、$delete、$watch 挂载到 Vue.prototype 上

##### $set(target,key,value)

```js
export function set(target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }

  // 新增key
  const ob = target.__ob_;
  if (target._isVue || (ob && ob.vmCount)) {
    // 不能是vue实例或者Vue实例的根数据对象--data
    return val;
  }
  if (!ob) {
    target[key] = val;
    return val;
  }
  ob.defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val;
}
```

##### $delete

```js
export function del(target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return;
  }
  const ob = target.__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    // 不能是vue实例或者根实例对象
    return;
  }
  // eslint-disable-next-line no-prototype-builtins
  if (!target.hasOwnProperty(key)) {
    return;
  }
  delete target[key];
  if (!ob) {
    return;
  }
  ob.dep.notify();
}
```

#### 事件相关的实例代码

##### $on

```js
function on(event,fn){
  // event可以是字符串或字符串数组
  /*
    _events是Vue实例上一个保存触发事件的集合【vm._events = Object.create(null)】
    {
      event:[],
      event1:[]
    }
  */
  const vm = this
  if(Array.isArray(event)){
    for(let i=0,l=event.length;i<l;i++){
      this.on(event[i],fn)
    }
  }else{
    (vm._events[event]||vm._events[event]=[]).push(fn)
  }
  return vm
}
```

##### $off

```js
function off(event, fn) {
  const vm = this;
  // 函数没有传递参数直接移除所有
  if (arguments.length === 0) {
    vm._events = Object.create(null);
    return;
  }

  // event为数组时：遍历数组，再次调用off方法

  if (typeof fn === 'undefined') {
    vn._event[event] = [];
    return;
  }
  const fns = vm._events[event];
  if (Array.isArray(fns) && fns.length > 0) {
    let cb;
    //
    let i = fns.length;
    while (i--) {
      cb = fns[i];
      // $once添加的事件被包裹了，所以才需要判断cb.fn === fn
      if (cb === fn || cb.fn === fn) {
        fns.splice(i, 1);
        break;
      }
    }
  }
  return vm;
}
```

##### $emit

```js
function emit(event, ...args) {
  const vm = this;
  const fns = vm._events[event];
  if (Array.isArray(fns) && fns.length > 0) {
    fns.forEach((fn) => fn.apply(vm, args));
  }
  return event;
}
```

##### $once

```js
function once(event, fn) {
  const vm = this;
  function innerFn() {
    vm.off(event, innerFn);
    fn.apply(vm, arguments);
  }
  innerFn.fn = fn; // 便于在off事件中移除回调函数
  vm.on(event, innerFn);
  return vm;
}
```

#### 生命周期相关的实例方法

##### $forceUpdate

> 迫使 vue 实例重新的渲染，仅仅影响实例本身及插入插槽内容的子组件，并不是所有子组件

```js
function forceUpdate() {
  const vm = this;
  if (vm._watcher) {
    vm._watcher.update();
  }
}
```

##### $destroy

```js
function destroy() {
  const vm = this;
  if (vm._isBeingDestroyed) {
    return;
  }
  callHook(vm, 'beforeDestroy');
  vm._isBeingDestroyed = true;

  // 删除与父级之间的链接
  const parent = vm.$parent;
  if (parent && !parent._isBeingDestroyed) {
    remove(parent.$children, vm);
  }

  // vue实例挂载的监控当前组件所有状态的watcher
  if (vm._watcher) {
    vm._watcher.tearDown();
  }
  // 用户创建的watcher: 所有用户创建的watcher都保存在组件的_watchers中
  let i = vm._watchers.length;
  while (i--) {
    vm._watchers[i].teardown();
  }
  vm._isDestory = true;
  // 在vnode树上触发destroy钩子函数解绑指令
  vm.__patch__(vm.vnode, null);
  // 解绑所有监听器
  vm.$off();
}
```

##### $nextTick

> - 当更新了状态，需要对更新状态之后的 DOM 做操作，就需要 nextTick；如果更新了状态直接拿当前 DOM 则还是旧的数据
> - vue 实例的状态修改是想微任务队列（除非当前环境不支持微任务实现）里添加的

```js
const callbacks = [];
let pending = false;

// 依次执行微任务队列中的任务
function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callback.length = 0;
  copies.forEach((fn) => fn());
}

let useMacroTask = false;

// 创建一个执行微任务的函数
let microTimerFunc;
let macroTimerFunc = function () {
  /*
  依次根据执行环境判断使用下列的哪一种
    setImmediate
    MessageChannel
    settimeout
  */
};
const p = Promise.resolve();
microTimerFunc = () => {
  p.then(flushCallbacks);
};

// 新增代码
export function withMacroTask(fn) {
  return (
    fn._withTask ||
    (fn._withTask = function () {
      useMacroTask = true;
      const res = fn.apply(null, arguments);
      useMacroTask = false;
      return res;
    })
  );
}

// nextTick
function nextTick(cb, ctx) {
  callbacks.push(() => {
    if (cb) {
      cb.call(ctx);
    }
  });
  if (!pending) {
    pending = true;
    // 如果监听回调函数（on监听的事件）被withMacroTask包裹
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
}
```

##### $mount

```js
function mountComponent(vm, el) {
  if (!vm.$options.render) {
    // 创建一个空函数
  }
  // 触发生命周期函数
  callHook(vm, 'beforeMount');
  // 挂载
  vm._watcher = new Watcher(vm, () => {
    // vm._render():调用模板的渲染函数
    // vm._render()调用会watcher收入到组件中所有状态的依赖列表中
    // vm._update是对最新的VNode进行patch的
    vm._update(vm._render());
  });
  // 触发生命周期函数
  callHook(vm, 'mounted');
  return vm;
}
```

#### 全局 API 的实现

##### Vue.extend

> 实际创建了一个 sub 函数继承自 Vue 构造函数；

##### Vue.use

> 根据 plugin 在缓存中查找，没有则执行 plugin（或者 plugin.install）函数
>
> 然后将 plugin 放入缓存中，避免多次调用再次创建

### Vue 的生命周期

> - 初始化阶段 ： beforeCreate、created
> - 模板编译 ： template --> render 函数
> - 挂载阶段 ： beforeMount、 Mounted 、beforeUpdate、updated
> - 卸载阶段 ： beforeDestroy、destroyed

##### callHook

> vue 实例中用户添加的生命周期函数都会被加入到
>
> $options 的数组中，并且数据结构是数组(原因是 mixin 的时候，生命周期也会被添加):
>
> $options['created'] = [fn]

```js
function callHook(vm, hook) {
  const handlers = vm.$options[hook];
  if (handlers) {
    for (let i = 0, l = handlers.length; i < l; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        /*
         +  handerErrors会依次调用父组件的errorCaptured钩子函数
          与全局的config.errorHandler
          + 在组件的errorCaptured钩子函数中可以捕获子组件的错误
        */
        handerErrors(e, vm, `${hook} hook`);
      }
    }
  }
}
```

##### handleError

> Vue 中所有的用户定义的函数都是被会被 Vue 调用，在调用中都会被 try...catch;
>
> 如果有异常则会调用 handleError 进行错误的处理

```js

function handlerError(err,vm,info){
  if(vm){
    let cur = vm
    // 如果组件继承链路或者父组件链路上存在errorCaptured钩子函数，则会依次调用
    while((cur = cur.$parent)){
      const hooks = cur.$options.errorCaptured
      if(hooks){
        for(let i =0;i < hooks.length;i++){
          try{
           const capture =  hooks[i].call(cur,err,vm,ingo)
           if(!capture){
             // 调用时出现手动返回false则不会继续向全局上报
             return
           }
          }catch{
            // errorCaptured内部的错误则会被发到全局事件处理
             globalHandleError(err,vm,info)
          }
        }
      }
    }
  }
  // 全局处理
  globalHandleError(err,vm,info)
}



function globalHandleError(err,vm,info){
  // config.errorHandler --> Vue.config.errorhandler
  if(config.errorHandler){
    try{
      // 全局的错误处理
      return config.errorHandler.call(null,err,vm,info)
    }
  }
}
```

#### 初始化实例属性

> 初始化一些$开头(vue 暴露的属性)、\_开头(vue 内部的属性)属性；

#### 初始化事件

> - 初始化：`vm._events = Object.create(null)`,用来保存所有的自定义事件
> - 父组件向子组件注册的事件保存在 vm.$options._parentListeners 【数据结构：`{increment:function(){}}`】，子组件在初始化的时候需要将这些事件通过vm.$on 注册到自己的事件列表中
> - 更新新旧节点的事件列表
>   - 遍历新的事件列表，如果旧的事件列表没有则属于新增，如果存在则对比是否有修改
>   - 遍历旧的事件列表，如果在新的事件列表中没有则需要删除

#### inject

> - 接收父组件层级上注入的属性，可以用来初始化 props/data，所以它的初始化在 props 和 data 之前
> - 遍历 inject 对象所有的属性（keys），通过 while 循环的方式依次在父组件的\_provided 中查找，并赋值
> - 将得到的结果（result 对象）调用 defineReactive 转化为响应式

#### 初始化状态

##### initState

> 初始化：props、methods、data、computed、watch

```js
function initState(vm) {
  vm._watchers = [];
  const opts = vm.options;
  if (opts.props) {
    initProps(vm, opts.props);
  }
  if (opts.methods) {
    initMethods(vm, opts.props);
  }
  if (opts.data) {
    initData(vm);
  } else {
    observe((vm.data = {}), true);
  }
  if (opts.computed) {
    initComputed(vm, opts.computed);
  }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}
```

##### props

> 规格化 props 为标准对象；
>
> 需要对对象设置的 type 进行验证

##### method

> 将 method 挂载到 vm 上

##### data

> 初始化到 vm 上并添加响应式

##### provide

> 如果 provide 是函数则将 provide 执行，获取的值添加到 vm.\_provided

### 指令

#### v-if 指令

```js
/*
   <li v-if='has'>if</li>
   <li v-else>else</li>
*/
// 会根据has的值决定创建哪个节点
has ? _c('li', [_v('if')]) : _c('li', [_v('else')]);
```

#### v-for 指令

```js
/*
   <li v-for="(item,index) in list">v-for {{index}}</li>
*/

// _l是函数renderList的别名，当执行这段代码字符串时，会循环变量list，并
// 依次调用第二个参数
_l(list, function (item, index) {
  return _c('li', [
    // 创建一个文本节点
    _v('v-for' + _s(index))
  ]);
});
```

#### v-on 指令

```js
/*
   withMacroTask(handler)
   withMacroTask 函数的作用是给回调函数做一层包装，当事件触发时，
   如果因为回调中修改了数据而触发更新 DOM 的操作，
   那么该更新操作会被推送到宏任务(macrotask)的任务队列中： nextTick中的回调函数会被放入到宏任务队列中
*/
```

#### 自定义指令

> 当虚拟 DOM 进行渲染时，会触发 update 钩子函数，在此函数中会触发指令的更新操作

#### keep-alive

> [keep-alive](https://juejin.cn/post/6844903837770203144)
>
> - keep-alive 是一个抽象组件，并不会被在 DOM 树中被渲染；
> - 支持黑白名单的配置以及可以设置最大的缓存数量；
> - 使用 LRU（最近最少使用策略），采用哈希表（Map）存储
> - 使用数组缓存虚拟 DOM 的键集合

##### 组件 created 方法

> 初始存储虚拟 DOM 的数组（保存虚拟 DOM 的 key）和 map（缓存 VNode）

##### 组件 mounted 方法

> 创建 watcher 监控黑白名单的更改，然后触发 cache 的更新

##### 组件 destroy 方法

> 触发缓存组件的 destroy 生命周期钩子函数；移除缓存的组件

##### 组件渲染 render 方法

> - 获取当前第一个子组件（$slots）然后获取组件的配置（主要获取组件的 name）
> - 判断如果在白名单中没有或者黑名单中有，直接返回当前组件
> - 生成组件的 key(如果设置了组件的唯一 key 就默认使用，如果没有设置则框架会生成一个 key【cid+tag】)
> - 根据 key 在缓存中查找，如果存在直接设置虚拟 DOM 的组件实例为缓存的实例；并调整 key 的顺序
> - 如果根据 key 没有找到，则进行缓存 VNode，并且判断当前是否超出最大的缓存阈值，
> - 设置组件的 data.keepAlive 为 true

##### keep-alive 是如何使用缓存的组件的

> 在虚拟 VNode 进行 pacth 的时候，判断当前 VNode 是否存在组件实例，如果有则直接调用 insert(parentElm, vnode.elm, refElm) 【将缓存的 DOM（vnode.elm）插入父元素中】

#### LRU 缓存策略

> 1. 新数据插入到链表头部；
> 2. 每当缓存命中（即缓存数据被访问），则将数据移到链表头部；
> 3. 当链表满的时候，将链表尾部的数据丢弃。
