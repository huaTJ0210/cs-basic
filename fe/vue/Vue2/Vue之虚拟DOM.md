## Vue 之虚拟 DOM

> - 什么是虚拟 DOM：用 javascript 对象来描述真实的 DOM 对象；相对比真实 DOM 对象属性较多，而虚拟 DOM 属性少
> - 为什么使用虚拟 DOM：虚拟 DOM 记录当前程序的状态（内存中保存对当前视图真实 DOM 的映射），当状态发生改变后生成新的虚拟 DOM，新旧 DOM 做对比（virtual DOM diff），在页面的复杂的情况下可以提升渲染性能；
> - 虚拟 DOM 的作用：
>   - 维护视图和状态的关系
>   - 复杂的视图情况下能提升渲染的性能
>   - 跨平台
>     - 浏览器平台渲染 DOM
>     - 服务端渲染 SSR（Nust.js/Next.js）:将虚拟 DOM 转化为 html 字符串
>     - 原生应用（weex/RN）渲染
>     - 小程序（mpvue/uni-app）等
> - DOM Diff 算法： 当状态改变时，创建新的虚拟 DOM，通过对比新旧虚拟 DOM 找到差异部分，然后进行页面的更新操作；在优化的 DOM Diff 中，树结构中的结点只进行同层级的结点比较，所以时间复杂度是 O(n)

### Snabbdom

> - init 函数设置模块，创建 patch 函数
> - 使用 h 函数创建 javascript 对象（Vnode）来描述真实 DOM
> - patch 函数对比新旧两个 Vnode，将变化的内容更新到真实 DOM

#### h 函数

> h 函数内部主要处理入参：sel、data、children、text 等，然后调用 vnode 函数返回一个虚拟节点对象

#### VNode

##### VNode 类型

```typescript
interface VNode {
  sel: string | undefined; // 选择器
  data: VNodeData | undefined; // 模块中需要的数据
  children: Array<VNode | string> | undefined; // 子节点
  elm: Node | undefined; // 真实DOM元素
  text: string | undefined; // 文本节点的内容（和children互斥）
  key: Key | undefined;
}
```

##### vnode 函数

> 创建一个普通具有 VNode 类型的 javascript 对象并返回

#### patch

> 当新旧虚拟节点调用 patch 进行对比时，会完成真实 dom 的更新操作

```js
// --- 对比新旧虚拟节点，并把差异渲染到真实DOM上 ---
function patch(oldVnode,newVnode){
  //oldVnode可以是一个DOM对象，
  if(!isVnode(oldVnode)){
    //将DOM对象转化为虚拟DOM
    oldVnode = emptyNodeAt(oldVnode)
  }
  // 判断两个虚拟DOM对象是否相同
  if(sameVnode(oldVnode,newVnode)){
    patchVnode(oldVnode,newVnode)
  }else{
    elm = oldVnode.elm
    parent = api.parentNode(elm)

    createElm(vnode) // 根据新虚拟节点，创建展示DOM挂载在vnode的elm上
    if(parent !==null){
      // 将新创建的虚拟DOM挂载到真实DOM上
      api.insertBefore(parent,vnode.elm,api.nextSibling(elm))
      // 移除老虚拟节点对应的真实DOM
      removeVnodes(parent,[oldVnode],0,0)
    }
  }
}

// --- 当新旧Vnode为相同结点（key&&sel相同）时触发patchVnode----

function patchVnode(oldVnode,newVnode){
  //判断newVnode是否为文本节点
  if(isUndef(newVnode.text)){
      // 当newVnode是元素节点
      if(isDef(oldVnode.children)&&isDef(newVnode.children)){
        if(oldVnode.children!==newVnode.children){
          // 执行更新子节点的过程
           updateChildren(oldVnode.elm,oldVnode.children,newVnode.children)
        }
      }else if(isDef(newVnode.children)){
        if(isDef(oldVnode.text)){
           api.setTextContent(oldVnode.elm,'')
        }
        addVnodes(oldVnode.elm,null,newVnode.children,0,newVnode.children.length-1)
      }else if(isDef(oldVnode.children)){
        // 新节点为注释节点，需要清空
         removeVnodes(elm,newVnode.children,0,newVnode.children.length-1) // 移除旧结点的子元素
      }else if(isDef(oldVnode.text)){
          // 新节点为注释节点，需要清空
        api.setTextContent(elm,'')
      }
  }else if(oldVnode.text !== newVnode.text){// 新节点是文本节点并且与旧结点的text不同时
    if(isDef(oldVnode.children)){// oldVnode是元素节点存在子节点时
      removeVnodes(elm,newVnode.children,0,newVnode.children.length-1) // 移除旧结点的子元素
    }
    // 复用旧元素节点，并修改textContent的值
    api.setTextContent(oldVnode.elm,newVnode.text)
  }
}

// ---- 子节点的更新操作 ---

function updateChildren(parentElm: Node,oldCh: VNode[],newCh: VNode[],insertedVnodeQueue: VNodeQueue) {
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];

    // 使用map记录每一个结点{key:index},其中key是节点的键值，index是索引
    let oldKeyToIdx: KeyToIndexMap | undefined;
    let idxInOld: number;
    let elmToMove: VNode;
    let before: any;

    // ----开始循环----
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (oldStartVnode == null) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
      } else if (oldEndVnode == null) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (newStartVnode == null) {
        newStartVnode = newCh[++newStartIdx];
      } else if (newEndVnode == null) {
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {// 比较新头与旧头
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {// 比较新尾与旧尾
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) {// 比较旧头与新尾
        // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        // 把元素插入到oldEndVnode之后
        api.insertBefore(
          parentElm,
          oldStartVnode.elm!,
          api.nextSibling(oldEndVnode.elm!)
        );
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) {// 比较旧尾与新头
        // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        // 把元素插入到oldstartVnode之前
        api.insertBefore(parentElm, oldEndVnode.elm!, oldStartVnode.elm!);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (oldKeyToIdx === undefined) {
          // 使用map记录旧的所有子节点的index，使用结点的key为键值名称
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        }
        // 使用新节点的key在map中查找旧节点
        idxInOld = oldKeyToIdx[newStartVnode.key as string];
        if (isUndef(idxInOld)) {
          // New element ： 旧节点数组中没有查询到可以重复利用的结点
          api.insertBefore(
            parentElm,
            createElm(newStartVnode, insertedVnodeQueue),
            oldStartVnode.elm!
          );
        } else {
          elmToMove = oldCh[idxInOld];// 记录待移动的节点
          if (elmToMove.sel !== newStartVnode.sel) {
            api.insertBefore(
              parentElm,
              createElm(newStartVnode, insertedVnodeQueue),
              oldStartVnode.elm!
            );
          } else {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined as any;
            api.insertBefore(parentElm, elmToMove.elm!, oldStartVnode.elm!);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }


    // while循环节结束，新的子节点数组没有遍历完成时：
    if (newStartIdx <= newEndIdx) {
      //如果newCh[newEndIdx + 1]存在，那么他对应的是旧的子元素数组末尾【最新的已处理过的元素】
      // 如果before为null直接parent.appendChild()
      before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
      addVnodes(
        parentElm,
        before,
        newCh,
        newStartIdx,
        newEndIdx,
        insertedVnodeQueue
      );
    }
    // while循环节结束，旧的子节点数组没有遍历完成时：
    if (oldStartIdx <= oldEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }
```

#### vue 中 key 的使用意义

> - Dom Diff 对比新旧节点时，为了最大程度复用组件当不设置 key 时，可能会引发由于复用组件而导致的渲染错误，设置 key 作为唯一标识能保证渲染的正确性；
> - 同时在设置 key 的情况下也能为新旧节点对比查找提高效率；
