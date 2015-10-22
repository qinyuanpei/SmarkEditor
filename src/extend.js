/**
 *　扩展功能模块 
 *  作者：秦元培
 *  时间：2015年10月15日
 **/


//引入NodeJS文件系统模块
var fs = require('fs');
//引入NodeWebkit相关模块
var gui = require('nw.gui');
//窗口API
var win = gui.Window.get();
//剪切版API
var clipboard = gui.Clipboard.get();

//是否进行了保存
var isSaved=false;

//当前编辑的文件
var editFile;

//存储模式
var saveMode="markdown";

//上下问菜单
var contextMenu;

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
        
/**
 * 初始化当前窗口
 * @param {Object} editormd对象             
 */
function initWindow(ed)
{
  //设置窗口位置在屏幕中央
  win.setPosition("center");
  //初始化当前菜单栏
  initMenuBar(ed);
  InitContextMenu(ed);
}

/**
 * 初始化当前菜单栏
 * @param {Object} editormd对象             
 */
function initMenuBar(ed)
{
  //创建菜单栏
  var menu = new gui.Menu({ type: 'menubar' });

  //创建'文件'菜单
  var fileMenu = getFileMenu(ed);
  menu.append(new gui.MenuItem({ label: '文件(F)', submenu: fileMenu }));

  //创建'编辑'菜单
  var editMenu = getEditMenu(ed);
  menu.append(new gui.MenuItem({ label: '编辑(E)', submenu: editMenu }));

  //创建'视图'菜单
  var viewMenu = getViewMenu(ed);
  menu.append(new gui.MenuItem({ label: '视图(V)', submenu: viewMenu }));

  //创建'帮助'菜单
  var helpMenu = getHelpMenu(ed);
  menu.append(new gui.MenuItem({ label: '帮助(H)', submenu: helpMenu }));

  //设置菜单
  win.menu = menu;
}

/**
 * 初始化上下文菜单
 * @param {Object} editormd对象             
 */
function InitContextMenu(ed)
{
  contextMenu=new gui.Menu();

  contextMenu.append(new gui.MenuItem({ 
    label: '复制    Ctrl+C',
    click: function(){
      clipboard.set(ed.getSelection());
    } 
  }));

  contextMenu.append(new gui.MenuItem({ 
    label: '剪切    Ctrl+X',
    click: function(){
      clipboard.set(ed.getSelection());
      ed.replaceSelection('');
    }
  }));

  contextMenu.append(new gui.MenuItem({ 
    label: '黏贴    Ctrl+V',
    click: function(){
      ed.replaceSelection(clipboard.get());
    }
  }));

  document.getElementById("editormd").addEventListener('contextmenu',function(ev){
    ev.preventDefault();
    contextMenu.popup(ev.x, ev.y);
    return false;
  });
}

/*
 * 返回'文件'菜单
 * 参数：编辑器对象
 */
function getFileMenu(ed)
{
  //创建'文件'菜单
  var fileMenu = new gui.Menu();

  //'新建'菜单项
  fileMenu.append(new gui.MenuItem({
    label: '新建    Ctrl+N', 
    click: function() {
      onFileNewHandle(ed);
    }
  }));

  //'打开'菜单项
  fileMenu.append(new gui.MenuItem({ 
    label: '打开    Ctrl+O', 
    click: function() {
      $("#fileOpen").trigger("click");
    }
  }));

  //'保存'菜单项
  fileMenu.append(new gui.MenuItem({
    label: '保存    Ctrl+S',
    click: function(){
      saveMode="markdown";
      onFileSaveHandle(editFile,ed);
    }
  }));

  //'导出为PDF'菜单项
  fileMenu.append(new gui.MenuItem({ 
    label: '导出为PDF ',
    click: function(){
      saveMode="pdf";
      onFileSaveHandle(editFile,ed);
    }     
  }));

  //'导出为HTML'菜单项
  fileMenu.append(new gui.MenuItem({ 
    label: '导出为HTML',
    click: function(){
      saveMode="html";
      onFileSaveHandle(editFile,ed);
    }
  }));

  return fileMenu;
}

/*
 * 返回'编辑'菜单
 * 参数：编辑器对象
 */
function getEditMenu(ed)
{
  //创建'编辑'菜单
  var editMenu = new gui.Menu();

  //'复制'菜单项
  editMenu.append(new gui.MenuItem({ 
    label: '复制    Ctrl+C',
    click: function(){
      clipboard.set(ed.getSelection());
    } 
  }));

  //'剪切'菜单项
  editMenu.append(new gui.MenuItem({ 
    label: '剪切    Ctrl+X',
    click: function(){
      clipboard.set(ed.getSelection());
      ed.replaceSelection('');
    }
  }));

  //'黏贴'菜单项
  editMenu.append(new gui.MenuItem({ 
    label: '黏贴    Ctrl+V',
    click: function(){
      ed.replaceSelection(clipboard.get());
    }
   }));

  //'查找'菜单项
  editMenu.append(new gui.MenuItem({ 
    label: '查找    Ctrl+F',
    click: function(){
      ed.search();
    } 
  }));

  //替换菜单项
  editMenu.append(new gui.MenuItem({ 
    label: '替换    Ctrl+H',
    click: function(){
      ed.search("replace");
    }
  }));

  return editMenu;
}

/*
 * 返回'视图'菜单
 * 参数：编辑器对象
 */
function getViewMenu(ed)
{
  //创建'视图'菜单
  var viewMenu = new gui.Menu();

  viewMenu.append(new gui.MenuItem({ 
    label: '工具栏',
    type: 'checkbox',
    checked: "true",
    click: function(){
      if(this.checked==false){
        ed.hideToolbar(function(){
          console.log("hide the toolbar")
        });
      }else{
        ed.showToolbar(function(){
          console.log("show the toolbar")
        });
      }
    } 
  }));

  viewMenu.append(new gui.MenuItem({ 
    label: '编辑器',
    type: 'checkbox',
    checked: 'true',
    click: function(){
      if(this.checked==false){
        ed.previewing();
        console.log("hide the editor");
      }else{
        ed.previewed();
          console.log("show the editor");
      }
    } 
  }));

  viewMenu.append(new gui.MenuItem({ 
    label: '实时预览',
    type: 'checkbox',
    checked: 'true',
    click: function(){
      if(this.checked==false){
        ed.unwatch(function(){
          console.log("hide the preview")
        });
      }else{
        ed.watch(function(){
          console.log("show the preview")
        });
      }
    } 
  }));

  viewMenu.append(new gui.MenuItem({ 
    label: '设置',
    click: function(){
      
    } 
  }));

  return viewMenu;
}

/*
 * 返回'帮助'菜单
 * 参数：编辑器对象
 */
function getHelpMenu(ed)
{
  //创建'帮助菜单'
  var helpMenu = new gui.Menu();

  helpMenu.append(new gui.MenuItem({ 
    label: '使用帮助',
    click: function(){
      ed.executePlugin("helpDialog", "help-dialog/help-dialog");
    } 
  }));

  helpMenu.append(new gui.MenuItem({ 
    label: '关于SmarkEditor',
    click: function(){
      ed.createInfoDialog();
    } 
  }));

  return helpMenu;
}

/*
 * 读取文件操作
 * 参数：文件路径
 * 参数：编辑器对象
 */
function onFileReadHandle(filepath,ed)
{
  editFile=filepath;
  isSaved=true;
  var data=readFile(editFile);
  ed.setMarkdown(data);
  win.title=editFile + "-" + "SmarkEditor";
}

/*
 * 写入文件操作
 * 参数：文件路径
 * 参数：存储类型[markdown,html,pdf]
 * 参数: 编辑器对象
 */
function onFileSaveHandle(filepath,ed)
{
  editFile=filepath;
  switch(saveMode)
  {
    case "markdown":
    saveMarkdown(editFile,ed);
    break;
    case "html":
    saveHTML(editFile,ed);
    break;
    case "pdf":
    savePDF(editFile,ed);
    break;
  }
}

/*
 * 新建文件操作
 * 参数: 编辑器对象
 */
function onFileNewHandle(ed)
{
  ed.clear();
  isSaved=false;
  editFile="";
  win.title="新建Markdown文件-SmarkEditor";
}

/*
 * 保存markdown
 * 参数：文件路径
 * 参数: 编辑器对象
 */
function saveMarkdown(filepath,ed)
{
  if(isSaved==false){
      //设置对话框文件类型
      $("#fileSave").attr('accept','.md');
      //打开对话框
      $("#fileSave").trigger("click");
    }else{
      writeFile(filepath,ed.getValue());
      win.title=filepath + "-" + "SmarkEditor";
    }
}

/*
 * 保存HTML
 * 参数：文件路径
 * 参数: 编辑器对象
 */
function saveHTML(filepath,ed)
{
  //设置对话框文件类型
  $("#fileSave").attr('accept','.html');
  //打开对话框
  $("#fileSave").trigger("click");

}

/*
 * 保存PDF
 * 参数：文件路径
 * 参数: 编辑器对象
 */
function savePDF(filepath,ed)
{
  //设置对话框文件类型
  $("#fileSave").attr('accept','.pdf');
  //打开对话框
  $("#fileSave").trigger("click");
}


　