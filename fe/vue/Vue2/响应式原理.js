/*
  1、响应式原理篇

   1.1 Observer类
   + 每个响应式对象都被添加了一个__ob__的属性用于标识是响应式的
   + 创建dep执行依赖收集
   + 对数组类型的数据，修改原型对象（便于对修改数据的方法进行拦截），且对数组的元素遍历添加响应式
   + 对象类型数据进行遍历keys，通过Object.defineProperty进行get和set的重写在内部通过dep对象收集依赖和通知依赖变化
     如果值是对象或者数组还需要递归处理
   + 提供observe方法对单个值进行响应式添加的操作，返回值的__ob__

   1.2 Dep
   + depend：用于添加依赖
   + notify：用于通知依赖
   + remove：用于删除依赖
   + subs：用于保存所有的依赖
   + uid ： 识别不同的依赖列表

   1.3 watcher
   + 接收vm、expOrFunc、cb、options等参数
   + 构造函数中会将自身添加到vm的watchers列表中
   + 会对expOrFunc处理成getter函数 
   + 调用get函数 赋值watcher到Dep.target上，执行getter进行依赖的收集
   + update方法中通过get()会获取新值，并执行回调函数
   + teardown中从dep中删除自身


  2、响应式API的实现原理篇
   
   2.1 watch 
    + watch的内部就是创建一个watcher对象，自动能完成对依赖的收集
    + 如果设置immediate，则立即触发回调执行

   2.2 computed
   + 对每个属性都创建一个watcher对象，完成属性的监听和变化之后的更新
   + 所有的watcher保存在vm._computedWatchers
   + 如果属性不在vm上还需要将属性添加到vm上
   + 对于添加到vm上的属性都重写get方法，这样每次获取值，都会从对应的watcher上获取
   + 如果watcher的dirty为true则重新执行获取
   + 如果为false则直接返回watcher.value
   + 属性发生变化后会通知watcher执行update，重新获取新值，同时会将dirty设为false

   2.3 $set & $del
   + 数组类型的直接调用splice方法处理
   + 对象类型的，分为是否为已存在的key、对象是否为响应式分别进行处理

   2.4 nextTick
   + 组件实例挂载到DOM容器上后触发
   + 将回调入队操作，使用微任务或者宏任务在下一次tick中flushQueue
   + 没有传递callback的，则返回pending（promise）对象，flushQueue时在改变为resolve的

    2.4.1 vue的异步更新流程：多次状态变更只更新一次
    + 状态发生改变后执行watcher.update,将当前watcher放入队列（更新id判断是否已经存在，已存在的不需要放入）
    + 将当前waiting修改为true，调用nextTick(flushwatchQueue)下一个tick进行更新
    + nextTick会将flushwatchQueue函数加入到内部的callbacks队列中
    + 在下一个tick中依次执行队列中的任务（promise、mutationObserver、setImmediate、settimeout）
    + 完成更新操作

   2.5 $on/$off/$once/$emit
   + 每个组件实例上都有一个_events = {key:[]}的对象用于保存当前实例注册的所有事件
   
   2.5.1 子组件使用$emit为什么能触发在父组件中使用v-on绑定的事件
   + 父组件使用v-on注册的事件都被$listeners收集
   + 子组件初始化时会获取$listeners,利用$on注册到当前组件的_events对象上
   + 子组件使用$emit触发事件,就会引发父组件v-on上绑定的事件回调函数了

   2.5 inject & provide
   + inject : 根据配置从当前组件开始向上查询父组件的provide
    如果找到就赋值，没有则继续查找，处理完成后将inject上的结果赋值到vm对象上，不是响应式的
   + provide： 向子组件和孙子组件注册数据

   2.6 mount
    + 执行beforeMount钩子函数
    + 为当前vue实例挂载一个watcher(vm,()=>vm._update(vm._render()))
    + watcher内部会进行Vnode的创建，真实DOM的挂载等操作
    + 实例挂载完毕后执行mounted钩子函数

   2.7 parseHTML
   + 挂载开始、结束、字符、属性等相关钩子函数，使用正则表达式分段解析
   + 节点关系构建采用的是栈结构
   + 最终返回的是_render函数，用于Vnode的创建

   2.8 虚拟DOM以及Diff
    + 虚拟DOM是什么
    + 虚拟DOM能做什么事情
    

   2.9 keep-alive
   + keep-alive是一个abstract组件不会实际渲染，内部存在支持LRU缓存的cache和keys数组
   + render函数中如果组件的名字不在白名单或者在黑名单中直接返回内部组件（slot.default）的Vnode
   + 符合条件的则直接在缓存中查找，cache中使用组件的key为标记（没有则创建一个唯一key：cid+tag）
   + 如果查找的到，则将缓存的vnode结点的componentInstance设置到vnode结点上，并更新LRU的缓存新鲜度
   + 如果没有查找到则将vnode缓存到cache中，并把key添加到keys中
   + 组件渲染（patch）
     - 如果vnode存在组件实例并且是keep-alive就不会进行组件mount函数的调用，也就不会触发created，mounted
     等声明周期钩子函数
     - reactivateComponent 中会将Vnode中缓存的真实DOM挂载到父组件容器中

   2.10 插槽的实现

      2.10.1 插槽是什么
       + 实现内容的分发，父组件通过插槽，将渲染内容传递给子组件，子组件利用占位的插槽
       进行渲染，提高组件的可重用性

      2.10.2 插槽实现的原理
        + 普通插槽和作用域插槽的实现。它们有一个很大的差别是数据作用域，
        + 普通插槽是在父组件编译和渲染阶段生成 vnodes，所以数据的作用域是父组件实例，
          子组件渲染的时候直接拿到这些渲染好的 vnodes。
        + 对于作用域插槽，父组件在编译和渲染阶段并不会直接生成 vnodes，
        而是在父节点 vnode 的 data 中保留一个 scopedSlots 对象，
        存储着不同名称的插槽以及它们对应的渲染函数，
        只有在编译和渲染子组件阶段才会执行这个渲染函数生成 vnodes，
        由于是在子组件环境执行的，所以对应的数据作用域是子组件实例

   2.11 vue设置key的意义
    + Dom Diff 对比新旧节点时，为了最大程度复用组件当不设置key时，可能会引发由于复用组件而导致的渲染错误，设置key作为唯一标识能保证渲染的正确性；
    + 同时在设置key的情况下也能为新旧节点对比查找提高效率；

*/
