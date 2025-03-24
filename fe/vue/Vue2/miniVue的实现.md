## miniVue 的实现

> - 在 miniVue 的实现中，为 vue 实例中的每一个属性都创建了一个 watcher 对象,这种监控粒度比较小，影响性能；
>
> - 在目前的 Vue2.x 版本中结合虚拟 DOM，已将更新力度提升到了组件级别；也就是一个 Vue 实例对应一个 watcher；数据发生变化时，会通知到 watcher，然后在 watcher 的回调函数中进行组件的虚拟 DOM 创建，再进行 DOM diff 进而完成组件的更新操作

#### Vue

> Vue 类主要完成：
>
> - 保存 options 中的数据并添加$data、$el 等属性
> - 将$data 中的属性代理到 Vue 实例上，便于在 Vue 实例中使用 this 访问
> - 将$data 中的属性值变成响应式
> - 编译模板

```js
// ---vue.js----
class Vue {
  constructor(options) {
    // 1. 通过属性保存选项的数据
    this.$options = options || {};
    this.$data = options.data || {};
    // 获取Vue实例挂载的DOM对象
    this.$el =
      typeof options.el === 'string'
        ? document.querySelector(options.el)
        : options.el;
    // 2. 把data中的成员转换成getter和setter，注入到vue实例中
    // 便于在组件上直接使用this进行属性的访问
    this._proxyData(this.$data);
    // 3. 调用observer对象，监听数据的变化：为$data中的每个属性添加set和get方法
    new Observer(this.$data);
    // 4. 调用compiler对象，解析指令和差值表达式（模板编译）
    new Compiler(this);
  }
  _proxyData(data) {
    // 遍历data中的所有属性
    Object.keys(data).forEach((key) => {
      // 把data的属性注入到vue实例中
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key];
        },
        set(newValue) {
          if (newValue === data[key]) {
            return;
          }
          data[key] = newValue;
        }
      });
    });
  }
}
```

#### Observer

> - 为$data 中属性为对象的数据，并为其添加 set 和 get 方法
> - 在 get 中收集依赖，在 set 中通知依赖
> - 如果属性值仍未对象，应该继续将对象变为响应式数据
> - Observer 为处理当属性值为数组的类型，在 Vue 中数组的响应式是拦截给数组修改值的方法（pop/push/shift/unshift/splice）等，在这些方法中通知依赖，数据发生了变化

```js
// --- Observer.js ---
class Observer {
  constructor(data) {
    this.walk(data);
  }

  walk(data) {
    // 1. 判断data是否是对象
    if (!data || typeof data !== 'object') {
      return;
    }
    // 2. 遍历data对象的所有属性
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key]);
    });
  }

  defineReactive(obj, key, val) {
    let that = this;
    // 负责收集依赖，并发送通知
    let dep = new Dep();
    // 如果val是对象，把val内部的属性转换成响应式数据
    this.walk(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 收集依赖
        Dep.target && dep.addSub(Dep.target);
        return val;
      },
      set(newValue) {
        if (newValue === val) {
          return;
        }
        val = newValue;
        // 如果新赋值的数据为对象，也要把对象编程响应式
        that.walk(newValue);
        // 发送通知
        dep.notify();
      }
    });
  }
}
```

#### Dep

> 采用观察者模式辅助添加依赖

```js
//--- dep.js ---
class Dep {
  constructor() {
    // 存储所有的观察者
    this.subs = [];
  }
  // 添加观察者
  addSub(sub) {
    if (sub && sub.update) {
      this.subs.push(sub);
    }
  }
  // 发送通知
  notify() {
    this.subs.forEach((sub) => {
      sub.update();
    });
  }
}
```

#### Watcher

> - 数据发生变化，通知到 watcher，有 watcher 的回调函数完成视图的重新渲染
>
> - 创建 watcher 实例时，由于要访问属性，由此在属性的 get 中完成依赖的收集，将 watcher 实例添加到 dep 中

```js
// -- watcher.js ---
class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    // data中的属性名称
    this.key = key;
    // 回调函数负责更新视图
    this.cb = cb;

    // 把watcher对象记录到Dep类的静态属性target
    Dep.target = this;
    // 触发get方法，在get方法中会调用addSub
    this.oldValue = vm[key];
    Dep.target = null;
  }
  // 当数据发生变化的时候更新视图
  update() {
    let newValue = this.vm[this.key];
    if (this.oldValue === newValue) {
      return;
    }
    this.cb(newValue);
  }
}
```

#### Compiler

> 将模板进行编译，完成 Vue 中（差值表达式、指令）特性的解析赋值，同时为在模板中使用的响应式属性添加 watcher 监控；

```js
// --- compiler.js ---
class Compiler {
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;
    this.compile(this.el);
  }
  // 编译模板，处理文本节点和元素节点
  compile(el) {
    let childNodes = el.childNodes;
    Array.from(childNodes).forEach((node) => {
      // 处理文本节点
      if (this.isTextNode(node)) {
        this.compileText(node);
      } else if (this.isElementNode(node)) {
        // 处理元素节点
        this.compileElement(node);
      }

      // 判断node节点，是否有子节点，如果有子节点，要递归调用compile
      if (node.childNodes && node.childNodes.length) {
        this.compile(node);
      }
    });
  }
  // 编译元素节点，处理指令
  compileElement(node) {
    // console.log(node.attributes)
    // 遍历所有的属性节点
    Array.from(node.attributes).forEach((attr) => {
      // 判断是否是指令
      let attrName = attr.name;
      if (this.isDirective(attrName)) {
        // v-text --> text
        attrName = attrName.substr(2);
        let key = attr.value;
        this.update(node, key, attrName);
      }
    });
  }

  update(node, key, attrName) {
    let updateFn = this[attrName + 'Updater'];
    updateFn && updateFn.call(this, node, this.vm[key], key);
  }

  // 处理 v-text 指令
  textUpdater(node, value, key) {
    node.textContent = value;
    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue;
    });
  }
  // v-model
  modelUpdater(node, value, key) {
    node.value = value;
    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue;
    });
    // 双向绑定
    node.addEventListener('input', () => {
      this.vm[key] = node.value;
    });
  }

  // 编译文本节点，处理差值表达式
  compileText(node) {
    // console.dir(node)
    // {{  msg }}
    let reg = /\{\{(.+?)\}\}/;
    let value = node.textContent;
    if (reg.test(value)) {
      let key = RegExp.$1.trim(); // 获取到key：msg
      node.textContent = value.replace(reg, this.vm[key]);

      // 创建watcher对象，当数据改变更新视图
      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue;
      });
    }
  }
  // 判断元素属性是否是指令
  isDirective(attrName) {
    return attrName.startsWith('v-');
  }
  // 判断节点是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3;
  }
  // 判断节点是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1;
  }
}
```

#### 渲染测试

```html
<!DOCTYPE html>
<html lang="cn">
  <body>
    <div id="app">
      <h1>差值表达式</h1>
      <h3>{{ msg }}</h3>
      <h3>{{ count }}</h3>
      <h1>v-text</h1>
      <div v-text="msg"></div>
      <h1>v-model</h1>
      <input type="text" v-model="msg" />
      <input type="text" v-model="count" />
    </div>
    <script src="./js/dep.js"></script>
    <script src="./js/watcher.js"></script>
    <script src="./js/compiler.js"></script>
    <script src="./js/observer.js"></script>
    <script src="./js/vue.js"></script>
    <script>
      let vm = new Vue({
        el: '#app',
        data: {
          msg: 'Hello Vue',
          count: 100,
          person: { name: 'zs' }
        }
      });
      console.log(vm.msg);
      // vm.msg = { test: 'Hello' }
      vm.test = 'abc';
    </script>
  </body>
</html>
```
