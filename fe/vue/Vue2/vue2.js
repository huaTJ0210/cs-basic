/*
 1、vue与react的对比
 （1）相同点
  + 均采用声明式去应对视图层的变化，并在状态改变后自动更新视图
  + 底层采用虚拟DOM的方式，最小化去变更真实的DOM节点
  + 都提供了组件化的开发方式，react的函数组价和类组件，vue的单文件组件；
  + 重点都聚焦于视图层，路由及状态管理等功能交付与其他库来实现
  + 对于大型项目业务逻辑复用与拆分vue3的组合式api及react hooks都给出了很好的支持
  (2) 不同点
  + 响应式原理的实现不一样，react状态更新后需要重新以当前组件为根重新创建虚拟DOM进行构建，Diff后找出差异
  更新视图，Vue在则在渲染期就已经完成了对状态依赖的收集，状态发生变化后能很精确的完成对指定视图的更新
  + 最新的Vue3在模板编译上做了很多优化：静态提升、动态类型标记、树结构打平，在DOM diff时可以更高效的完成
  对组件的更新；React最新的Fiber架构将老版本的stack调和，转为可中断可恢复的fiber架构，控制DOM diff占用主线程的时间
  为更高级别的任务让路，并在空闲时间完成更新（scheduler的调度器，类似requestidlecallback）
  + 视图层声明式：React采用了JSX，Vue采用的是基于html的template模板；
  + css方面Vue天然支持组件级别的作用域（scoped），react需要使用css module/css in js 等方案
  + 脚手架方面vue-cli支持自定义配置，CRA是不建议去修改配置，如需修改需要三方库或者run reject完成
  


2、MVVM 与 MVC 的区别
+ MVVM分为三个部分：View、ViewModel、Model；并且View和ViewModel进行双向绑定
（实现响应式，状态改变视图自动更新）
+ MVC也分为三个部分：View、Controller、Model；但View和Contoller没有实现双向的绑定
需要Controller内部手动处理；通讯规则view和model之间必须通过controller的中转
这样能保证view和model的复用


3、如何理解Vue中的指令，指令如何自定义，及指令的生命周期函数，实现过自定义指令吗？

 3.1 什么是指令
 + 指令在Vue中是以v-开头的特殊属性，在底层渲染的DOM上应用响应式行为

 3.2 vue2.x中指令的创建
 + 全局创建：Vue.directive('v-xx',{
    bind(el,binding){
      binding --> : value,name,arg、modifier（修饰符）
    },
    inserted(){} // 被绑定元素插入父节点时
    update(){} // 可能发生在子Vnode的更新之前
    componentUpdated(){}
    unbind(){}
  })
 + 局部创建：
    directives:{

    }
  3.3 vue3中指令的创建
   + 全局 app.directive()
   + 组件内部 vFocus：约定
   + 生命周期已调整
  
  3.4 自定义指令
  + v-focus、v-permission

  3.5 指令实现的原理
  + vnode上收集组件的所有指令集合，集合的元素是一个个对象，包含指定对应生命周期需要执行的内容
  + 在组件的不同生命周期上会遍历指令集合，传入对应的生命周期，进而执行指令

4、vue的生命周期
 + vue2.x的生命周期：简述各个生命周期可以处理哪些事情
 + vue3的生命周期新增setup在beforeCreate之前
 + 生命周期钩子函数的变动

 5、计算属性（computed的）与监听器（watch）的区别，他们的实现原理是什么？

   5.1 区别
   + 计算属性会自动进行依赖收集，对计算结果进行缓存，只在状态改变后重新计算，
   + watch是对某个状态的监控，状态改变触发相应的逻辑执行，适合执行状态变更后的异步操作

   5.2 计算属性实现的原理
   + 创建watch，执行getter方法是进行依赖收集，并将值附加到vue实例上（通过this可以调用）
   + 在状态发生变更后，watch执行回调将dirty重置为true，再次取值需要重新执行getter函数
   + 状态为发生改变，dirty为false，则可以直接使用旧值

   5.3 watch实现的原理
   + watch可以接收很多类型的参数，统一处理为：()=>source
   + 首次通过获取一次值完成对watch的依赖收集
   + 状态发生变更后就会执行watch设置的callback函数

  6、v-if与v-show的区别
  + v-show只是在css层面上执行元素的隐藏和显示，适用于频繁的切换
  + v-if是真正意义的元素销毁和重新创建

   6.1 如何优化v-if
   + 在元素的显示需求或者优先级低的情况下先设置为false，在nextTick中重置为true；
   可让优先级别高的元素先显示

  7、Vue中设置key值的作用？
  + 列表渲染DOM diff时，遇到元素位置发生变更的情况可以通过移动元素位置代替重新创建提升性能
  + 动态组件进行切换时，由于vue的重用机制，会导致一些元素（input）的状态发生错乱，使用key值可以让
  vue重新创建

  8、事件相关 (指令绑定的都是自定义事件)

    8.1  $emit $on $off $once

    8.2 事件修饰符
      + native :原生事件监听
      + prevent
      + stop
      + 键盘的shift/ctrl
      + exact:精确控制键盘事件

    8.3 $listeners 
      + 子组件可以获取父组件所有的绑定事件

  9、v-model
  + v-model的作用，如何实现自定义组件的双向绑定（v-model）
  + 当需要更改v-model的属性名和事件名时，vue2中提供model:{prop:xx,event:xx}

   9.1 Vue3中做了修改
   + 自定义组件使用v-model会被拆分 :modelValue 和 @update:modelValue
   + 自定义事件内部需要使用defineProps和defineEmits来定义prop和event，具体内部绑定有两种方式
     - （1）组件内部也可以采用一个可读可写的计算属性来实现
     -  (2) 将prop、event绑定到表单元素上
   + 如想修改prop名称直接 v-model:propName即可
   + 一个组件可以接受多个v-model的绑定

   9.2 v-model的修饰
   + lazy
   + number
   + trim
   + 在Vue3中可以自定义修饰符：在defineProps时传递modelModifiers: { default: () => ({}) }

     function emitValue(e) {
        let value = e.target.value
        if (props.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1)
      }
      emit('update:modelValue', value)
    }

  10、组件中data为什么要声明为函数？
    + 组件可以复用避免出现，多个组件引用同一个对象的情况发生
  
  11、如何理解props的单项数据流？子组件如何通知父组件的进行更改操作？

    11.1 什么是单项数据流？
    + 所有的 prop 都使得其父子 prop 之间形成了一个单向下行绑定：
    父级 prop 的更新会向下流动到子组件中，但是反过来则不行。
    这样会防止从子组件意外变更父级组件的状态，从而导致你的应用的数据流向难以理解。

    11.2 如果想修改有什么方式[对props进行双向绑定 -- 不建议这样使用]
    + 子组件通过$emit('update:xxx',value),父组件监听此事件；为了简化可以使用.sync的修饰符
    + 具体用法: v-bind:title.sync="doc.title" 可以省略事件的监听

    11.3 什么是$attr
    + 一个非 prop 的 attribute 是指传向一个组件，
      但是该组件并没有相应 prop 定义的 attribute。

  12 、插槽

    12.1 插槽的基本使用

    12.2 插槽的实现原理
    + 在模板编译时，会被编译成一个对象，并保存在组件的Vnode中
    + 在子组件挂载时，遇到slot会从父组件获取这些插槽对象然后进行渲染

  13、组件之间的通讯有哪些？
   + 父子组件之间的通讯方式：props，emit/on，provide/inject 
   + 兄弟组件之间通讯 ： eventBus 
   + 全局组件之间通信 ： eventBus 和 vuex
   
   13.1 eventBus如何实现？
    + 第一种：创建一个vue对象（不含DOM的），使用$emit、$on、$off
    + 第二种简单场景直接获取根实例避免创建vue实例

  14、递归组件：
   + 递归终止的条件、组件具有名称
   + 使用场景：tree组件

  15、vue的过渡动画
   + 基于transition组件
   + 设置css的类名：提供多个过渡类别：v-enter、e-enter-active v-leave等

  16、深入响应式原理

   16.1 vue2的响应式原理实现：
   + 组件实例创建，然后会对组件实例中的data进行响应式的改写，数组会修改原型对象便于方法的拦截，
   + 对象则通过Object.defineProperty进行set和get的重写。在get内部收集依赖，在set内部触发依赖更新（
   Dep对象进行解耦），并对响应式对象都添加响应式标记
   + 组件初始化渲染，创建一个watcher的对象，传入(）=>{ vm._update(vm._render())}
   + wacher的内部会执行这个函数，因此会触发属性值的获取，这样就完成了对watch的收集
   + 属性值更改后会通知watch进行update的调用，进行重新的渲染操作

   16.2 vue在状态更新后的操作是异步的
   + 状态更新后会将watch放入到队列中，相同的watch会被过滤掉
   + 在浏览器的下一个tick中执行更新（根据环境选择：promise.then、mutationObserver、setImidate、setTimeout）
   + 状态改变后想要操作DOM需要使用nextTick

   17、路由VueRouter

    17.1 路由守卫
    + 全局路由守卫 ： beforeEach、afterEach
    + 组件级别的路由守卫：beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave

    17.2 路由实现的原理
    + 从router.push说起

    17.3 动态路由
    + 用来做运行时动态添加路由的

    18、状态管理Vuex
    + store ：
    + state ： 状态容器
    + mutations ： 唯一可以修改store的方式
    + actions ： 执行异步动作后再提交更新状态的操作
    + getters ： state的计算属性（可以理解）
    + dispatch ：派发异步action
    + commit ： 提交mutations修改状态

    19、Vue的插件机制
    + Vue.use(插件)，插件必须有install方法，
    + 会使用Vue的mixin方式将插件的实例挂载到全局的vue实例上

    20、Vue项目的优化
    + 路由懒加载:加速首页打开速度，webpack可以进行分包
    + 某些场景下使用keep-alive能够缓存组件的实例，可避免再次创建
    + 组件卸载时进行事件监听的移除和定时器等的销毁
    + 第三方框架进行按需导入
    + 

*/
