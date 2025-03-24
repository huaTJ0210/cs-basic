/*
  0、判断终端设备
   + 使用正则表达式：获取useragent

  1、软键盘问题
  + ios和android对于键盘的弹起表现方式不一致
    - iOS需要监听focus，blur监听键盘的弹起和收回
    - android端需要监听resize事件根据可视区域的高度判断
  + 让输入框到可是区域
    - iOS可以自适应
    - android需要手动处理，拿到当前元素滚动到可视区域，a
      ctiveElement.scrollIntoView();
  + iOS12和微信指定版本
    - 键盘回收后视图webview不返回
  
  2、移动端事件穿透及解决方案
    + 混用touch和click事件的产生的问题：
      touchStart-》touchEnd-》click
    + 如何解决：只使用touch事件
    + a标签click监听取消默认事件行为，在touchstart中触发
    + a标签的子元素click事件：css设置 a[href]*{pointer-events: none;}
  
  3、使用viewport模板解决部分兼容性
    + 不允许缩放 user-sacable
    + 电话和邮箱的自动识别 可以根据需求设置开放和关闭
    
  4、webkit表单元素默认行为
    + 解决方案: .css{-webkit-appearance:none;} 
    + ios上的下拉框会有圆角，所以要写border-radius:0

  5、输入框的兼容性解决
     + 
    */
