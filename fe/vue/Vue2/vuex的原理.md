### Vuex 的实现原理

> 一个简易版本的 Vuex

```js
let Vue;

class Store {
  constructor(options) {
    //将store上state内部的属性全部变成响应式
    this._vm = new Vue({
      data: {
        $$state: options.state
      }
    });

    // 获取mutation
    this._mutations = options.mutations;
    // 获取actions
    this._actions = options.actions;

    this.commit = this.commit.bind(this);
    this.dispatch = this.dispatch.bind(this);
  }

  get state() {
    // vue内部提供的_data
    return this._vm._data.$$state;
  }

  // 实现提交mutation的方法
  commit(type, payload) {
    const entry = this._mutations[type];
    if (!entry) {
      console.log('unkonwn mutation type');
      return;
    }
    entry(this.state, payload);
  }

  // 实现dispatch方法
  dispatch(type, payload) {
    const entry = this._actions[type];
    if (!entry) {
      return;
    }
    entry(this, payload);
  }
}

// Vue.use的时候：install.apply(this,[....])
function install(_vue) {
  Vue = _vue;
  Vue.mixin({
    beforeCreate() {
      if (this.$option.store) {
        Vue.prototype.$store = this.$option.store;
      }
    }
  });
}

export default { Store, install };
```
