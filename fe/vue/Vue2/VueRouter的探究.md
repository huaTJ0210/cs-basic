## VueRouter 的探究

> - 回顾 VueRouter 的基本使用
> - VueRouter 的两种模式分析
> - VueRouter 实现的原理
>   - 基础实现源码
>   - Vue.use()的实现源码
>   - history 和 html history 的简易实现源码
>   - 路由规则转化为 routeMap 对象
>   - VueRouter 的具体实现
>   - RouterLink
>   - RouterView

### VueRouter 的基本使用

> VueRouter 的详细入门见: [VueRouter](https://router.vuejs.org/zh/introduction.html)

#### 安装

```shell
npm i vue-router  #注意选择符合项目需求的版本，目前最新版本是：v4.x
```

#### 导入并使用插件

```js
// 1、导入
import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from './pages/home';
import Detail from './pages/detail';

// 2、使用插件
Vue.use(VueRouter); // 【Vue.use中做了些什么？？？】

// 3、创建路由规则
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/detail/:id', // 动态路由，便于传递参数
    name: 'Detail',
    props: true, // 可以将传递的参数放置在组件的props中:【提供props传参的好处是什么？？？】
    component: Detail // 【基于code-splitting的动态导入组件该如何编写？？？】
  }
];

// 4、创建VueRouter实例 ： 【VueRouter是如何实现单页面应用的切换的？？？】
const router = new VueRouter({
  routes
});

export default router;
```

#### 传入 Vue 的根实例对象中

```js
import Vue from 'vue';
import App from './app';
import router from './router';

new Vue({
  router // 【为什么要在此处传递router？？？】
}).$mount(App);
```

#### 在组件中使用

``` vue
<template>
  <router-link to='/'>首页</router-link>
  <router-link to='/detail/3'>详情</router-link>
  <router-view></router-view>
</template>
```

### VueRouter 的两种模式分析

#### hash 模式

> - hash 模式是基于 url 中的锚点也就是 `#` 后面的地址进行页面导航的，页面地址发生改变不会向服务端发送请求；
> - `#` 后面的地址发生改变会触发 hashchange 事件，在此事件函数中完成对页面的重新渲染
> - 兼容性较好

#### html5 的 history 模式

> - 基于 html5 的 history 提供的新方法：pushState/replaceState 可以改变页面地址，并更新导航栈中的数据，同时不引发页面的刷新；
> - 浏览器回退能触发 popState 事件函数；
> - 基于以上功能可以实现单页面的导航行为；
> - 使用 history 模式需要注意 2 点：
>   - 兼容性问题：不支持 IE10 以下的版本
>   - 需要服务端配合：在 nginx 中需要修改 try_files 配置项，将访问的所有静态页面地址重定向到 index.html 上；

### VueRouter 实现的原理

#### 简易版本的 VueRouter 实现

> 仅实现 history 模式下的路由导航功能

```js
let _Vue = null;
class VueRouter {
  static install(Vue) {
    //1、 把Vue的构造函数记录在全局，便于在VueRouter中使用Vue；
    _Vue = Vue;
    //2、 把创建Vue的实例传入的router对象注入到Vue实例
    // 这里采用混入的方式，将router挂载到Vue的原型对象上
    _Vue.mixin({
      beforeCreate() {
        // 只有根Vue的options中才存在router对象，这样判断可以避免router被多次挂载
        if (this.$options.router) {
          // 将router挂载到Vue实例上，此任务需要VueRouter来处理
          // 挂载之后所有的Vue实例中都可以获取到$router了
          _Vue.prototype.$router = this.$options.router;
        }
      }
    });
  }
  // 构造函数
  constructor(options) {
    this.options = options;
    this.routeMap = {}; // 用来存储路径与组件的映射关系
    // 将当前页面路径存在响应式的对象中，便于页面路径改变后，进行页面的重新渲染
    this.data = _Vue.observable({
      current: '/'
    });
    // 完成初始化
    this.init();
  }
  init() {
    this.createRouteMap();
    this.initComponent(_Vue);
    this.initEvent();
  }
  createRouteMap() {
    //遍历所有的路由规则 吧路由规则解析成键值对的形式存储到routeMap中
    this.options.routes.forEach((route) => {
      this.routeMap[route.path] = route.component;
    });
  }
  // 全局注册：router-link ， router-view 组件
  initComponent(Vue) {
    Vue.component('router-link', {
      props: {
        to: String
      },
      render(h) {
        return h(
          'a',
          {
            attrs: {
              href: this.to
            },
            on: {
              click: this.clickhander
            }
          },
          [this.$slots.default]
        );
      },
      methods: {
        clickhander(e) {
          // history模式中改变浏览器地址栏中的地址
          history.pushState({}, '', this.to);
          // 触发响应式对象，引发页面的重新渲染
          this.$router.data.current = this.to;
          e.preventDefault(); //阻止a标签的默认行为（向服务端发送请求）
        }
      }
    });
    const self = this;
    Vue.component('router-view', {
      render(h) {
        const cm = self.routeMap[self.data.current];
        return h(cm);
      }
    });
  }
  initEvent() {
    // 监听popstate事件，完成页面地址修改后，组件的重新渲染
    window.addEventListener('popstate', () => {
      this.data.current = window.location.pathname;
    });
  }
}
```

#### Vue.use 的内部实现

```js
Vue.use = function (plugin /*Function | Object*/) {
  // installedPlugins为已安装插件列表，若 Vue 构造函数不存在_installedPlugins属性，初始化
  const installedPlugins =
    this._installedPlugins || (this._installedPlugins = []);
  // 判断当前插件是否在已安装插件列表，存在直接返回，避免重复安装
  if (installedPlugins.indexOf(plugin) > -1) {
    return this;
  }

  // toArray方法将Use方法的参数转为数组并删除了第一个参数（第一个参数就是我们的插件）
  const args = [].slice.call(arguments, 1);
  // use是构造函数Vue的静态方法，那这里的this就是构造函数Vue本身
  // 把this即构造函数Vue放到参数数组args的第一项
  args.unshift(this);
  if (typeof plugin.install === 'function') {
    // 传入参数存在install属性且为函数
    // 将构造函数Vue和剩余参数组成的args数组作为参数传入install方法，将其this指向插件对象并执行install方法
    plugin.install.apply(plugin, args);
  } else if (typeof plugin === 'function') {
    // 传入参数是个函数
    // 将构造函数Vue和剩余参数组成的args数组作为参数传入插件函数并执行
    plugin.apply(null, args);
  }
  // 像已安装插件列表中push当前插件
  installedPlugins.push(plugin);
  return this;
};
```

#### history 的实现原理

> VueRouter 底层的路由跳转及路由监听都是基于 history 的来实现的，下面简单介绍一下 history 的基本实现及 html5 history 的实现内容

##### history 的实现源码

```js
export class History {
  constructor(router) {
    this.router = router;
    this.current = START; // 当前路由route对象，START是一个初始值对象
    // 路由监听器数组，存放路由监听销毁方法
    this.listeners = [];
  }
  // 启动路由监听：主要在该方法内部注册hashchange或popstate事件的监听
  setupListeners() {}
  // History父类中新增listen方法 保存赋值回调，用于修改Vue根实例上的响应式对象_route
  listen(cb) {
    this.cb = cb;
  }
  // 路由跳转：Vue实例上进行的路由导航都是基于transitionTo去实现的
  transitionTo(location, onComplete) {
    // 路由匹配，解析location匹配到其路由对应的数据对象
    let route = this.router.match(location);
    // 更新current
    this.current = route;
    // 修改
    // 调用赋值回调，传出新路由对象，用于更新 _route，进而引发组件的重新渲染
    this.cb && this.cb(route);
    // 跳转成功抛出回调
    onComplete && onComplete(route);
    // 更新当前地址栏中的URL
    this.ensureURL();
  }

  // 卸载
  teardown() {
    this.listeners.forEach((cleanupListener) => {
      cleanupListener();
    });

    this.listeners = [];
    this.current = '';
  }
}
```

##### html5 history 的实现源码

```js
export class HTML5History extends History {
  constructor(router) {
    // 继承父类
    super(router);
  }
  // 启动路由监听
  setupListeners() {
    // popstate事件监听回调
    const handleRoutingEvent = () => {
      this.transitionTo(getLocation(), () => {
        console.log(`HTML5路由监听跳转成功！`);
      });
    };
    // 进行事件的监听
    window.addEventListener('popstate', handleRoutingEvent);
    // 将卸载事件封装，放入到listeners中，便于后期的清理操作
    this.listeners.push(() => {
      window.removeEventListener('popstate', handleRoutingEvent);
    });
  }

  // 更新当前地址栏中的URL
  ensureURL() {
    if (getLocation() !== this.current.fullPath) {
      window.history.pushState(
        { key: Date.now().toFixed(3) },
        '',
        this.current.fullPath
      );
    }
  }

  // 路由跳转方法
  push(location, onComplete) {
    this.transitionTo(location, onComplete);
  }

  // 路由前进后退
  go(n) {
    window.history.go(n);
  }

  // 跳转到指定URL，替换history栈中最后一个记录
  replace(location, onComplete) {
    this.transitionTo(location, (route) => {
      window.history.replaceState(window.history.state, '', route.fullPath);
      onComplete && onComplete(route);
    });
  }

  // 获取当前路由
  getCurrentLocation() {
    return getLocation();
  }
}

// 获取location HTML5 路由
function getLocation() {
  let path = window.location.pathname;
  return path;
}
```

#### 路由规则转化为 routeMap

```js
export function createRouteMap(routes, oldPathMap, parentRoute) {
  const pathMap = oldPathMap || Object.create(null);
  // 递归处理路由记录，最终生成路由映射
  routes.forEach((route) => {
    // 生成一个RouteRecord并更新pathMap
    addRouteRecord(pathMap, route, parentRoute);
  });
  return pathMap;
}

// 添加路由记录
function addRouteRecord(pathMap, route, parent) {
  const { path, name } = route;

  // 生成格式化后的path(子路由会拼接上父路由的path)
  const normalizedPath = normalizePath(path, parent);

  // 生成一条路由记录
  const record = {
    path: normalizedPath, // 规范化后的路径
    regex: '', // 利用path-to-regexp包生成用来匹配path的增强正则对象，用来匹配动态路由 （/a/:b）
    components: route.component, // 保存路由组件，省略了命名视图解析
    name,
    parent, // 父路由记录
    redirect: route.redirect, // 重定向的路由配置对象
    beforeEnter: route.beforeEnter, // 路由独享的守卫
    meta: route.meta || {}, // 元信息
    props: route.props == null ? {} : route.props // 动态路由传参
  };

  // 处理有子路由情况，递归
  if (route.children) {
    // 遍历生成子路由记录
    route.children.forEach((child) => {
      addRouteRecord(pathMap, child, record);
    });
  }

  // 若pathMap中不存在当前路径，则添加pathList和pathMap
  if (!pathMap[record.path]) {
    pathMap[record.path] = record;
  }
}

// 规格化路径
function normalizePath(path, parent) {
  // 下标0为 / ，则是最外层path
  if (path[0] === '/') return path;
  // 无父级，则是最外层path
  if (!parent) return path;
  // 清除path中双斜杆中的一个
  return `${parent.path}/${path}`.replace(/\/\//g, '/');
}
```

#### VueRouter 的实现详情

##### VueRouter 类

```js
class VueRouter {
  constructor(options) {
    this.options = options;
    // 将路由配置信息转换成routeMap：{'/a/b/c' : record,}
    this.matcher = createMatcher(options.routes);
    let mode = options.mode || 'hash';
    if (!inBrowser) {
      mode = 'abstract';
    }
    this.mode = mode;

    //实现hooks
    this.beforeHooks = [];
    this.resolveHooks = [];
    this.afterHooks = [];

    switch (this.mode) {
      case 'hash':
        this.history = new HashHistory(this);
        break;
      case 'history':
        this.history = new HTML5History(this);
        break;
      case 'abstract':
        this.history = new AbstractHistory(this);
        break;
      default:
        if (process.env.NODE_ENV !== 'production') {
          throw new Error(`[vue-router] invalid mode: ${mode}`);
        }
    }
  }
  // 匹配路由
  match(location) {
    return this.matcher.match(location);
  }

  // 获取所有活跃的路由记录列表
  getRoutes() {
    return this.matcher.getRoutes();
  }

  // 动态添加路由（添加一条新路由规则）
  addRoute(parentOrRoute, route) {
    this.matcher.addRoute(parentOrRoute, route);
    // 新增
    if (this.history.current !== START) {
      this.history.transitionTo(this.history.getCurrentLocation());
    }
  }

  // 动态添加路由（参数必须是一个符合 routes 选项要求的数组）
  addRoutes(routes) {
    this.matcher.addRoutes(routes);
    // 新增???
    if (this.history.current !== START) {
      this.history.transitionTo(this.history.getCurrentLocation());
    }
  }

  init(app) {
    // 绑定destroyed hook，避免内存泄露:  $emit('hook:xxx')触发回调函数执行
    /*
       +在模板中通过 @hook:created 这种形式注册。
       + JS 中可通过vm.$on('hook:created', cb) 或者 vm.$once('hook:created', cb) 注册，vm 指当前组件实例。
        (1)如何在父组件中监听子组件生命周期:
       答案就是在父组件中获取到子组件实例（vm），然后通过注册hook: 前缀+生命周期钩子的特殊事件监听就可以了
       */
    app.$once('hook:destroyed', () => {
      if (!this.app) this.history.teardown();
      this.app = null;
    });

    // 存在即不需要重复监听路由
    if (this.app) return;

    this.app = app;

    // 新增
    // 传入赋值回调，为_route赋值，进而触发router-view的重新渲染
    // 当前路由对象改变时调用
    this.history.listen((route) => {
      app._route = route;
    });

    // 跳转当前路由path匹配渲染 用于页面初始化
    this.history.transitionTo(
      // 获取当前页面 path
      this.history.getCurrentLocation(),
      () => {
        // 启动监听放在跳转后回调中即可
        console.log('----（1）启动监听');
        this.history.setupListeners();
      }
    );
  }

  // 导航到新url，向 history栈添加一条新访问记录
  push(location) {
    this.history.push(location);
  }

  // 在 history 记录中向前或者后退多少步
  go(n) {
    this.history.go(n);
  }

  // 导航到新url，替换 history 栈中当前记录
  replace(location, onComplete) {
    this.history.replace(location, onComplete);
  }

  // 导航回退一步
  back() {
    this.history.go(-1);
  }

  // ------  hook的callback的装载-----
  beforeEach(fn) {
    return this.registerHook(this.beforeHooks, fn);
  }

  beforeResolve(fn) {
    return this.registerHook(this.resolveHooks, fn);
  }
  /*
   history的 confirmTransition 成功回调函数中遍历
    this.router.afterHooks.forEach(hook => {
          hook && hook(route, prev)
        })
 */
  afterEach(fn) {
    return this.registerHook(this.afterHooks, fn);
  }

  registerHook(list, fn) {
    list.push(fn);
    return () => {
      const i = list.indexOf(fn);
      if (i > -1) list.splice(i, 1);
    };
  }
}

VueRouter.install = install;

export default VueRouter;

// ---- createMatcher.js---

export function createMatcher(routes) {
  // 生成路由映射对象 pathMap
  const pathMap = createRouteMap(routes);

  // 动态添加路由（添加一条新路由规则）
  function addRoute(parentOrRoute, route) {
    const parent =
      typeof parentOrRoute !== 'object' ? pathMap[parentOrRoute] : undefined;
    createRouteMap([route || parentOrRoute], pathMap, parent);
  }

  // 动态添加路由（参数必须是一个符合 routes 选项要求的数组）
  function addRoutes(routes) {
    createRouteMap(routes, pathMap);
  }

  // 获取所有活跃的路由记录列表
  function getRoutes() {
    return pathMap;
  }

  // 路由匹配
  function match(location) {
    location = typeof location === 'string' ? { path: location } : location;
    return createRoute(pathMap[location.path], location);
  }

  return {
    match,
    addRoute,
    getRoutes,
    addRoutes
  };
}
```

##### VueRouter 的 install 方法

```js
import RouterView from './component/view';
import RouterLink from './component/link';

let Vue = null;
export function install(_vue) {
  // (1) 判断VueRouter是否已经挂载，避免Vue.use(VueRouter)的重复执行
  if (install.installed && Vue === _vue) {
    return;
  }
  install.installed = true;
  Vue = _vue;
  // (2) 利用根组件Vue实例创建，获取到options中的参数初始化
  // 根组件上的属性（_routerRouter、_router、_route）
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        // 判断根Vue实例上已挂载了router
        this._routerRoot = this;
        this._router = this.$options.router;
        // 调用VueRouter实例初始化方法
        this._router.init(this);

        // 将_route定义为响应式
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        // 除了根Vue实例其他组件，如果有父组件，则赋值父组件的_routerRoot
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
    }
  });

  // （3）为每个Vue组件实例挂载 $router $route
  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      return this._routerRoot._router;
    }
  });
  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return this._routerRoot._route;
    }
  });

  // （4）注册全局组件 router-view router-link
  Vue.component('RouterView', RouterView);
  Vue.component('RouterLink', RouterLink);
}
```

#### RouterLink

```js
export default {
  name: 'RouterLink',
  props: {
    to: {
      type: [String, Object],
      require: true
    }
  },
  // h ->  createElement函数 -- VNode
  render(h) {
    const href = typeof this.to === 'string' ? this.to : this.to.path;
    const data = {
      attrs: {
        href: this.$router.mode === 'hash' ? '#' + href : href
      },
      //新增
      on: {
        click: (e) => {
          e.preventDefault();
          this.$router.push(href);
        }
      }
    };
    return h('a', data, this.$slots.default);
  }
};
```

#### RouterView

```js
export default {
  name: 'RouterView',
  functional: true, // 函数式组件:没有管理任何状态，也没有监听任何传递给它的状态，也没有生命周期方法
  // 提供第二个参数作为上下文
  render(h, { parent, data }) {
    // parent：对父组件的引用
    // data：传递给组件的整个数据对象，作为 createElement 的第二个参数传入组件

    // 标识当前组件为router-view
    data.routerView = true;

    let depth = 0;
    // 逐级向上查找组件，当parent指向Vue根实例结束循环
    while (parent && parent._routerRoot !== parent) {
      const vnodeData = parent.$vnode ? parent.$vnode.data : {};
      // routerView属性存在即路由组件深度+1，depth+1
      if (vnodeData.routerView) {
        depth++;
      }
      parent = parent.$parent;
    }

    let route = parent.$route;

    if (!route.matched) return h();

    // route.matched还是当前path全部关联的路由配置数组
    // 渲染的哪个组件，走上面逻辑时就会找到depth个RouterView组件
    // 由于逐级向上时是从父级组件开始找，所以depth数量并没有包含当前路由组件
    // 假如depth=2，则route.matched数组前两项都是父级，第三项则是当前组件，所以depth=索引
    let matched = route.matched[depth];

    if (!matched) return h();

    return h(matched.components, data);
  }
};
```

#### 路由的生命周期

[生命周期](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E5%AE%8C%E6%95%B4%E7%9A%84%E5%AF%BC%E8%88%AA%E8%A7%A3%E6%9E%90%E6%B5%81%E7%A8%8B)

#### 后台管理系统中的使用

> 基于角色的菜单配置
