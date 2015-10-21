/**
 *　扩展功能模块 
 *  作者：秦元培
 *  时间：2015年10月15日
 **/
//引入NodeJS文件系统模块
var fs = require('fs');
//引入NodeWebkit相关模块
var gui = require('nw.gui');
var win = gui.Window.get();
//var clipboard = gui.Clipboard.get();

//是否进行了保存
var isSaved=false;

//当前编辑的文件
var currentFile;

//读取文档
function readFile(filePath)
{
  //采用同步阻塞式方式来打开文件
	var data=fs.readFileSync(filePath,"utf-8");
  return data;
}

//保存文档
function writeFile(filePath,fileContent)
{
  //采用异步方式写入文件
	fs.writeFile(filePath,fileContent,function(error){
    	if(error){
	      	console.log("Write failed: " + error);
	      	return;
    	}
      console.log("Write Successful");
  });
}

//设置当前窗口名称
function setWindowTitle(title)
{
  win.title=title;
}

//初始化当前窗口
function initWindow()
{
  //设置窗口位置在屏幕中央
  win.setPosition("center");
  initMenuBar();
}

function initMenuBar()
{
  //创建菜单栏
  var menu = new gui.Menu({ type: 'menubar' });

  //创建'文件'菜单
  var fileMenu = new gui.Menu();
  fileMenu.append(new gui.MenuItem({ label: '新建    Ctrl+N' , click: function()
  {
    //清空编辑器内容
    editor.setMarkdown("");
    //重置文件路径
    isSave=false;
    currentFile="";
    setWindowTitle("新建Markdown文件-SmarkEditor")
  }}));

  fileMenu.append(new gui.MenuItem({ label: '打开    Ctrl+O' , click: function()
  {
    alert("点击了打开");
    setWindowTitle("新建Markdown文件-SmarkEditor");
  }}));

  fileMenu.append(new gui.MenuItem({ label: '保存    Ctrl+S' }));
  fileMenu.append(new gui.MenuItem({ label: '导出为PDF '     }));
  fileMenu.append(new gui.MenuItem({ label: '导出为HTML'     }));
  menu.append(new gui.MenuItem({ label: '文件(F)', submenu: fileMenu }));

  //创建'编辑'菜单
  var editMenu = new gui.Menu();
  editMenu.append(new gui.MenuItem({ label: '复制    Ctrl+C' }));
  editMenu.append(new gui.MenuItem({ label: '剪切    Ctrl+X' }));
  editMenu.append(new gui.MenuItem({ label: '黏贴    Ctrl+V' }));
  editMenu.append(new gui.MenuItem({ label: '查找    Ctrl+F' }));
  editMenu.append(new gui.MenuItem({ label: '替换    Ctrl+H' }));
  menu.append(new gui.MenuItem({ label: '编辑(E)', submenu: editMenu }));

  //创建'帮助'菜单
  var helpMenu = new gui.Menu();
  helpMenu.append(new gui.MenuItem({ label: 'Markdown帮助' }));
  helpMenu.append(new gui.MenuItem({ label: '关于SmarkEditor' }));
  menu.append(new gui.MenuItem({ label: '帮助(H)', submenu: helpMenu }));

  win.menu = menu;
}


　