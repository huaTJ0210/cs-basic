var regExp =
  /^[\u4e00-\u9fa5_a-zA-Z0-9\s\·\~\！\@\#\￥\%\……\&\*\（\）\——\-\+\=\【\】\{\}\、\|\；\‘\’\：\“\”\《\》\？\，\。\、\`\~\!\#\$\%\^\&\*\(\)\_\[\]{\}\\\|\;\'\'\:\"\"\,\.\/\<\>\?]+$/;

var str = "";
//console.log(regExp.test(str));

// 中文、字母、数字、标点符号
function isValidText(str) {
  return regExp.test(str);
}

const cssOrSass = /\.(c|s[ac])ss$/i;

console.log(cssOrSass.test("a.bcss"));
