// 1、校验html文本是否合法
const text = `<div>123<p>123</p></div>`

console.log(isValideHtmlText(text)) // true

const text1 = `<div><p>123</p><span></div>`

console.log(isValideHtmlText(text1)) // true

function isValideHtmlText(text) {
  // 1、获取文本中所有的开始和结束标签
  const arrayOfHtmlText = text.match(/<[^<>]+>/g)
  console.log(arrayOfHtmlText)
  // 2、遍历数组，对开始标签尽心压栈处理，遇到结束标签且匹配栈顶元素则进行出栈处理，不匹配则直接返回false
  const stack = []
  for (let index = 0; index < arrayOfHtmlText.length; index++) {
    const item = arrayOfHtmlText[index]
    if (isStartTag(item)) {
      stack.push(item)
    } else if (isEndTag(item)) {
      const cur = stack[stack.length - 1]
      if (cur === item.replace(/\//, '')) {
        stack.pop()
      } else {
        return false
      }
    }
  }
  // 栈为空则证明是合法的
  return stack.length === 0
}

function isEndTag(tag) {
  return tag.includes('/')
}
function isStartTag(tag) {
  return !tag.includes('/')
}
