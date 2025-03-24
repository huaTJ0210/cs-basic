/*
  1、响应式API

  1.1 ref
  + 可创造对任意类型的引用，并在不丢失响应式的前提下传递
  1.2 reactive
  + 对引用类型添加响应式；仅对（array、object、set、map等）有效，解构时会丢失响应式
  1.3 watchEffect
  + 对添加的函数fn立即执行，如果函数内部存在响应式数据，能自动添加依赖收集，状态发生改变后会立即
  执行传入的函数fn
  
  2、组合api与选项api之间的区别
  + 选项api以组件为中心，逻辑被强制拆分到各个函数中，编码阶段对于逻辑组织设计要求不高
  + 组合api在函数作用域中使用响应式api，能对业务逻辑进行更好的拆分和复用，需要较高的逻辑拆分能力

  3、mixin实现逻辑复用和组合api的区别
   3.1 mixin的问题
  + 混入多个mixin需要梳理逻辑，数据来源不清晰
  + 命名需要避免冲突
  + mixin之间通讯比较复杂：需要注入或者eventBus之类的协助
   3.2 组合API
   + 更好的逻辑复用
   + 更灵活的代码组织
   + 更好的类型判断

 4、组合api和react hooks之间的对比
   + react的使用限制，函数组件顶层作用域上，
   + 依赖收集需要手动指定
   + 依赖设置的不明确比较容易造成额外的渲染（给子组件挂载事件，每次更新都是新的函数，就会造成额外渲染）
   useCallback解决

 5、渲染机制
   
   5.1 模板是如何被渲染成真实DOM的
    > `流程从createApp(<App/>).mount(#root)开始`
    1. 组件`<App/>`会被vue-loader提前处理（template转为render函数，可以执行生成vnode）为`{render(){}, setup(){}}`
    2. 创建根节点的vnode，类型是component
    3. 执行`patch(oldVnode,newVnode,container)`,由于是新建因此不存在oldVnode(挂载在container上)
    4. patch内部会进行判断vnode的类型：（1）component类型则创建组件实例，并执行render创建vnode；（2）element类型则创建对应的真实DOM；
    5. 如果存在子节点则遍历执行patch方法，并传入创建的DOM（A）作为container，所有vnode均创建完毕后，将DOM（A）添加到#root上；
    6. 创建流程完毕

 6、如何理解副作用函数effect
    > proxy getter 中进行_effect对象的收集；proxy  setter中进行触发_effect对象执行run函数；
    > _effect对象究竟是什么？

    + _effect就是ReactiveEffect创建的实例，包含一个run函数
    + `effect(fn)` 调用内部会执行_effect.run()--> run的内部执行fn
    ，将此_effect对象收集到fn中响应式属性的依赖中
    + 响应式对象属性修改，则会触发对应_effect.run的执行，进而执行fn中的逻辑

 7、一次浏览的tick发生多次更新，vue如何处理的？
    + 发生更新时，会调用triggerEffect；内部进行_effect.scheduled的判断，
      如果存在则对此次更新进行入队操作（queueJob）
    + 入队的顺序根据组件id进行排序，保证父组件有限于子组件进行更新
    + 同一个浏览器tick中所有更新都会入队（队列中不会有重复，除非违反单项数据流的操作，会进行递归的更新）；
    + 在promise.then中执行flushqueue操作执行更新

 8、watch函数的执行原理
    1. `watch(source,cb)` 因为source的类型有多种，因此需要对source进行处理；
    2. `doWatch`中将source转换为`getter=（）=>source`;
    3. 创建`_effect = new ReactiveEffect(getter)`
    4. 执行`_effect.run()`根据getter函数获取当前source的值，同时对_effect进行了依赖收集
    5. 发生更新时会出触发triggerEffect判断当前_effect. scheduler,
    如果有值则进行queueJob操作，将创建的一个job（包含回调函数的执行）加入队列中

 9、computed的执行过程分析
    **案例1**
    > 在模板中使用计算属性

    + 计算属性返回一个只读ref，当 `{{computedRef.value}}`时，会完成对render effect的收集
    + 获取computedRef的值会触发内部get函数，完成对computed effect的收集
    + 执行getter函数返回需要的值
    + 发生状态更新时，会触发computed effect的scheduler，判断当前dirty为false，则触发triggerEffect，重新计算属性
    + 然后再触发render effect完成更新操作

    **案例2**
    ```js
    const { ref, effect, computed } = Vue

    const n = ref(0)
    const plusOne = computed(() => n.value + 1)
    effect(() => {
    n.value
    console.log(plusOne.value)
    })
    n.value++

    // 1 2 2
    ```
    + effect执行fn，n.value完成了对effect的依赖收集
    + plus.value 获取完成对computed effect的依赖收集，打印：1
    + n.value++ 触发收集的effect，此时computed effect优先级高，会触发computed的getter获取新值
    + 此时n.value变为2 
    + 再打印plusOne.value是2
    + 最后剩余一个effect执行再次打印为：2 ；使用的是计算属性的缓存


10、Vue3在模板编译时做了哪些优化？
    + 静态提升
    + 更新类型标记
    + 树结构打平

11、KeepAlive的原理
    > 多个组件实例进行切换，完成对卸载组件实例的缓存，在组件重新切换回来时不用重新的创建

    + KeepAlive会对子组件添加标识符_keepalive;渲染时首先通过key(组件名称)在cache中查找：
        1、如果没有则走mountComponent流程：同时将组件vNode添加到cache中
        2、如果存在则从缓存中获取，调用activate将vnode挂载到对应容器中
    + KeepAlive涉及LRU缓存
    1、使用map记录缓存的内容
    2、利用队列存储所有key值，需要删除缓存则从队尾删除，需要添加则从队首添加

12、slot实现的原理
    > 关于 <slot> 内置元素的实现原理，本质上就是父组件在渲染的时候，如果遇到了 <slot> 内容，
    >则会暂时将其缓存到组件实例上，然后在组件实例化的过程中，
    >从父组件中取出对应的 slots 按照名称进行渲染到指定位置。
    */
