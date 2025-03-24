/*
  (1) 计算属性的相关内容

  1.1 如何进行初始化
  + 在组件实例创建时通过initComputed方法对组件内部的计算属性进行初始化
  每个计算属性对应一个watcher，并保存在组件实例的computedWatcher中，
  并且会将计算属性通过defineProperty方法定义到组件实例上，通过this.xx访问会触发定义的
  get方法，在get内部会通过key获取watcher，如果存在并且不是dirty则直接使用，如果是dirty则
  会执行传入的get方法进行计算求值，并将dirty重置为false
  📢：计算属性只有等到访问时才会计算值，是一种惰性计算
  
  1.2 如何收集依赖的
  + 在计算属性get方法中获取的属性，都会收集两个watcher：计算属性watcher和渲染的watcher
  + 这样能保证数据变化后触发两个watcher执行update方法
  + 对于计算属性的update方法只是将dirty重置为true，只有去访问时才会触发真正的计算逻辑


  （2）vue-loader具体处理了哪些内容
  + 将vue的单文件（SFC）的三部分分别处理
  + template调用compiler处理成render函数
  + script部分处理为exportScript对象
  + style借助响应的loader处理为可导入的css文件
  + 最终三部分在一个文件中导入，作为Vue实例创建的options传入

  (3)自定义指令
  + vue指令：一种数据驱动视图更方便的操作
  
  3.1 自定义一个实现图片懒加载的指令
  + 总的方法是对于img先使用默认小图片设置，真实图片地址使用data-src设置
  + 监测img元素是否出现在当前的视口内部，如果是则使用data-src替换掉默认图片
    - 监测方法1：IntersectionObserver
    - 监测sroll的滚动事件（节流操作）获取当前元素的getBoundingClientReact()

 （4）数据请求建议放在哪里？
  + created中：已经可以访问data和props，此时DOM并未创建挂载
  + 如果放在mounted中，则可能会造成页面的闪动（新数据重新渲染界面导致）

  （5）v-for的优先级高于v-if
  + 永远不要将v-for和v-if放在同一个元素上,这样会导致每一次的渲染都会触发条件判断
  + 
*/