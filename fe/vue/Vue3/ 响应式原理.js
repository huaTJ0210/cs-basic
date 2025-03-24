let activeEfect // 当前活动的effect，也是全局对象
let effects // 全局effect集合中

// 1、将对象改为响应式
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, newValue) {
      trigger(target, key)
      target[key] = newValue
    }
  })
}

// 2 给任意值添加响应式
function ref(obj) {
  const refObj = {
    get value() {
      track(refObj, 'value')
      return obj
    },
    set value(newValue) {
      trigger(refObj, 'value')
      obj = newValue
    }
  }
  return refObj
}

// 3、在获取依赖的值时；将effect添加到全局effects集合中
function track(target, key) {
  if (activeEfect) {
    const effects = getPropertyEffects(target, key)
    effects.add(activeEfect)
  }
}

// 4、依赖发生变化是，获取依赖对应的所有effect；并执行
function trigger(target, key) {
  const effects = getPropertyEffects(target, key)
  if (effects) {
    effects.forEach(effect => effect())
  }
}

// 5 从全局effects集合中查找key对应的effects列表
function getPropertyEffects(target, key) {
  if (!effects) {
    effects = new WeakMap()
  }
  if (!effects[target]) {
    const map = new Map([[key, new Set()]])
    effects[target] = effects.set(target, map)
  }
  if (!effects[target][key]) {
    effects[target][key] = new Set()
  }

  return effects[target][key]
}

//  ===== 测试 ====
// 首次执行，将update这个effect进行包裹成函数，并设置到全局的activeEffect中
function dependenceChange(update) {
  const effect = () => {
    activeEfect = effect
    update()
    activeEfect = null
  }
  effect()
}

let a = ref(1)
let b = ref(2)

function update() {
  console.log(' === update ====')
  return a.value + b.value
}
dependenceChange(update)

a.value = 3
