# SmarkEditor
一款基于[Editor.md](https://github.com/pandao/editor.md)和[node-webkit](https://github.com/nwjs/nw.js)的Markdown编辑器.


# 主要特性

- 支持通用 Markdown / CommonMark 和 GFM (GitHub Flavored Markdown) 风格的语法；
- 支持实时预览、图片（跨域）上传、预格式文本/代码/表格插入、代码折叠、跳转到行、搜索替换、只读模式、自定义样式主题和多语言语法高亮等功能；
- 支持 [ToC（Table of Contents）](https://pandao.github.io/editor.md/examples/toc.html)、[Emoji表情](https://pandao.github.io/editor.md/examples/emoji.html)、[Task lists](https://pandao.github.io/editor.md/examples/task-lists.html)、[@链接](https://pandao.github.io/editor.md/examples/@links.html)等 Markdown 扩展语法；
- 支持 TeX 科学公式（基于 [KaTeX](https://pandao.github.io/editor.md/examples/katex.html)）、流程图 [Flowchart](https://pandao.github.io/editor.md/examples/flowchart.html) 和 [时序图 Sequence Diagram](https://pandao.github.io/editor.md/examples/sequence-diagram.html);
- 支持[识别和解析 HTML 标签，并且支持自定义过滤标签及属性解析](https://pandao.github.io/editor.md/examples/html-tags-decode.html)，具有可靠的安全性和几乎无限的扩展性；
- 支持本地.md文件读取和保存，支持HTML和PDF导出(**计划中的功能**);
- 支持将本地.md文件同步到有道云笔记和Github远程仓库(**开发中的功能**);
- 基于node-webkit进行封装，在在线版的基础上增加更多本地化特性;

# 应用截图

![程序界面](http://i13.tietuku.com/8f3611d58823848f.jpg)

# 编译打包
* 1、按照node-webkit打包方式，将src目录下的所有文件采用ZIP压缩压缩为app.zip;
* 2、将.zip扩展名改为.nw，此时得到文件app.nw;
* 3、进入node-webkit主文件夹，将app.nw拷贝到该目录下，执行命令:
```
copy /b nw.exe + app.nw app.exe
```
* 4、执行app.exe即可执行该应用程序;

# 编译版本
在release目录中可以找到编译打包好的可执行文件；
