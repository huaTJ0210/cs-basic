## 组件

### 1、emit 自定义事件的实现

> 自定义事件都会被挂载到组件的 props 中，使用 emit 函数会根据 eventName 找到对应的 props，然后执行 props 中的回调函数。

### 2、setup 函数的实现

> 组件挂载时会执行 setup 函数并传入 props 和 context【emit、attrs、slots 等】，返回一个对象，这个对象会被挂载到组件的实例上。

### 3、插槽的的工作原理和实现
