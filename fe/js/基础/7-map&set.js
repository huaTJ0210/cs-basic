/**
 * 1、Map：键值对存储的一种数据结构
 * + Map实例会维护键值对的插入顺序，因此可以根据键值对的插入顺序进行迭代
 * + Map中的键的数据类型不受限制（任意的javascript数据类型均可）
 */
const map = new Map([
  ['key1', 'value1'],
  ['key2', 'value2']
])

map.has('key1')
map.get('key2')
map.set('key3', 'value3')
map.delete('key2')

//map.entries() 获取一个迭代器对象
for (let [key, value] of map.entries()) {
}

/**
 * 1、set
 *
 */
const s = new Set()
s.add(1).add(2)
s.size
s.has(1)
s.delete(2)
for (const item of s) {
  console.log(item)
}
s.clear()
// 给数组去重复
const arr = [1, 2, 2, 3, 4, 4]
const re = [...new Set(arr)]

/**
 * 2、map vs Object
 */
const obj = {}
obj[true] = 'true'
obj[123] = '123'
obj[{ name: 1 }] = 'name'
// 所有的键都被转化为字符串了,尤其对象作为key都被转化为'[Object,Object]'
console.log(Object.keys(obj))

// map 可以使用任意类型的数据作为key
