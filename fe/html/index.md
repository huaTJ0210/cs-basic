# HTML

## 网页的相关概念

### 如何理解 HTML 的语义化

> 1. 什么是语义化：使用的标签名能够解释展示内容的类型（段落、图片）
> 2. 为什么要使用语义化：
>    - 去除 CSS 后，页面仍具有一定的结构
>    - 提升用户体验，例如：labl 绑定表单控件
>    - 利于 SEO
>    - 便于团队开发和维护
> 3. 如何使用语义化：避免使用无语义化的标签`<div>/<span>`之类;其他新应用标签`<header>、<footer>、<nav>`

### HTML

> 超文本标记语言【不仅仅是文本，还有视频、图片、音频等】

### 网页

> 一个以 html 或者 htm 为后缀的文件，可使用浏览器打开，内容是 HTML 标签标记的超文本（文字，图片、视频等）

### 浏览器

> - 浏览器内核：负责网页的布局和绘制
> - 主流浏览器：IE（Trident）、firefox（Geoko）、Safari（webkit）、Chrome（Blink）

### web 标准

> 使得各个厂商的浏览器能按照标准去支持；标准主要包含：结构（html）、表现（css）、行为（JavaScript）

## HTML 标签导读

### HTML 语法规范

#### 基本规范

> 1. HTML 标签是尖括号包围的关键字:`<html/>`
> 2. HTML 标签通常是成对出现的`<html></html>`;开始标签和结束标签
> 3. 有特殊的单标签如：`<img/>、<br/>`

#### 标签关系

> 1. 包含关系 ： `<html>与<body>`
> 2. 并列关系 : `<head>与<body>`

#### 网页基本内容

> 1. `<!DOCTYPE html>` :文档类型标签声明，位于文件的头部
> 2. `<html lang="en">`: 表明该网页是英文
> 3. `<meta charset="UTF-8">` 文档采用的字符集（避免出现乱码）

### HTML 标签

#### 标签语义化

> 标签是用来做什么的，显示的内容类型是什么

#### 常用的标签

```html
<html>
  <head>
    <title>常用的html标签</title>
  </head>
  <body>
    <h1>标题标签，显示文本会加粗，一共有6个级别。显示内容会换行</h1>
    <p>段落标签，显示文本段落，显示内容会换行</p>
    <p>
      段落与段落之间有大的
      <br />
      <!--br是换行标签，间隔小些-->
      间隔
    </p>
  </body>
</html>
```

#### 案例

> - 标题标签、段落标签、换行标签、文本的格式化（粗体、斜体、下划线）标签
> - div、span 标签
> - img 标签及其属性
> - a 标签

```html
<html>
  <head>
    <title>常用的html标签</title>
  </head>
  <body>
    <h1>最大标题</h1>
    <h4>4级小标题（1）</h4>
    <p>段落与段落之间有大的间隔</p>
    <h4>4级小标题（2）</h4>
    <p>
      段落标签，显示文本段落，显示内容会换行；
      <strong>加粗</strong>
      效果;
      <em>倾斜</em>
      效果;
      <del>删除</del>
      效果
      <ins>下划线</ins>
      效果
    </p>
    <p>
      lucy
      <br />
      2016年12月31号
    </p>
    <div>理解为一个大盒子，单独占有一行</div>
    <span>百度</span>
    <span>新浪</span>
    <span>小盒子在一行中显示</span>
    <img
      src="图片的路径"
      alt="当图片显示不出来时，显示的文本内容"
      title="当鼠标落在图片上，显示的提示信息"
      width="图像宽度"
      height="图像高度【修改其中一个，会自动等比例缩放】"
    />
    <a
      href="链接的地址"
      target="打开页面的方式【_self:当前页面打开；_blank:在新窗口打开】"
      >文本或者图片</a
    >
  </body>
</html>
```

### HTML 表单

#### 表单域

> ```
> <form></form>
> ```

#### 表单控件

```html
<html>
  <body>
    <form action="/register" method="POST" name="registerform">
      <label for="user_name">用户名：</label>
      <input type="text" name="username" id="user_name" />
      <br />
      <label>性别：</label>
      <input type="radio" name="sex" value="男" id="man" />
      <labl for="name">男</labl>
      <input type="radio" name="sex" value="女" id="woman" />
      <labl for="woman">女</labl>
      <br />
      <label>爱好：</label>
      <input type="checkbox" name="hobby" value="eat" />
      <label>美食</label>
      <input type="checkbox" name="hobby" value="sport" />
      <label>运动</label>
      <br />
      <label>籍贯:</label>
      <select>
        <option selected>--请选择籍贯--</option>
        <option>山东</option>
        <option>北京</option>
        <option>天津</option>
      </select>
      <br />
      <label>个人简介</label>
      <textarea>个人介绍</textarea>
    </form>
  </body>
</html>
```

### HTML 列表

```html
<html>
  <body>
    <!--1、无序列表-->
    <ul>
      <li>香蕉</li>
      <li>西瓜</li>
      <li>苹果</li>
    </ul>
    <!--2、有序列表-->
    <ol>
      <li>第一</li>
      <li>第二</li>
      <li>第三</li>
    </ol>
    <!--3、自定义列表-->
    <dl>
      <dt>名词概念</dt>
      <dd>解释1</dd>
      <dd>解释2</dd>
      <dd>解释3</dd>
    </dl>
  </body>
</html>
```
