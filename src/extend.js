/**
 *　扩展功能模块 
 *  作者：秦元培
 *  时间：2015年10月15日
 **/

//引入NodeWebkit相关模块
var gui = require('nw.gui');
var win = gui.Window.get();
//var clipboard = gui.Clipboard.get();
//引入NodeJS文件系统模块
var fs = require('fs');



//var editor=testEditor；
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

function initContextMenu()
{
  menu = new gui.Menu();
  menu.append(new gui.MenuItem({
    label: '复制',
    click: function() {
      clipboard.set(editor.getSelection());
    }
  }));
  menu.append(new gui.MenuItem({
    label: '剪切',
    click: function() {
      clipboard.set(editor.getSelection());
      editor.replaceSelection('');
    }
  }));
  menu.append(new gui.MenuItem({
    label: '黏贴',
    click: function() {
      editor.replaceSelection(clipboard.get());
    }
  }));

  document.getElementById("textarea").addEventListener('contextmenu', function(ev) { 
    ev.preventDefault();
    menu.popup(ev.x, ev.y);
    return false;
  });
}


　