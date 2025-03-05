## 1、响应式原理的基本实现

### 1.1、Proxy、track、trigger、effect

### 1.2、reactive、ref、computed、watcher

## 2、虚拟 DOM 与 diff 算法

> - 双端遍历法
> - 快速 diff：最长递增子序列法

## 3、组件

> 组件由于自身状态发生改变而触发的更新是异步的【通过任务队列（set），Promise 微任务队列】

### 3.1、emit 自定义事件的实现

> 自定义事件都会被挂载到组件的 props 中，使用 emit 函数会根据 eventName 找到对应的 props，然后执行 props 中的回调函数。

### 3.2、setup 函数的实现

> 组件挂载时会执行 setup 函数并传入 props 和 context【emit、attrs、slots 等】，返回一个对象，这个对象会被挂载到组件的实例上。

### 3.3、插槽的的工作原理和实现

> 编译器对于插槽的处理会将插槽的内容编译成一个函数，这个函数会被挂载到组件的实例上，然后在渲染函数中会调用这个函数，将插槽的内容渲染到页面上。

### 4、组件的生命周期

> onMounted: 判断当前组件实例是否存在，如果存在则将注册函数添加到组件实例的 mounted 数组中。在组件挂载后，会依次执行 mounted 数组中的函数。

## 4、内建组件

### 4.1 keep-alive
